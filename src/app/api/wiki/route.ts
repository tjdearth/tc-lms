import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { isWikiAdminForBrand } from "@/lib/admin-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

/**
 * Require that the user is either a global admin or a GM for the given brand.
 * Returns null if authorized, or a Response if denied.
 * Also returns the session email for further checks.
 */
async function requireWikiAdmin(brand?: string): Promise<{ denied: NextResponse | null; email: string | null }> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;
  if (!email) {
    return { denied: NextResponse.json({ error: "Unauthorized" }, { status: 403 }), email: null };
  }
  // Global admins can edit any brand
  if (isAdmin(email)) {
    return { denied: null, email };
  }
  // GMs can edit their own brand
  if (brand) {
    const allowed = await isWikiAdminForBrand(email, brand);
    if (allowed) return { denied: null, email };
  }
  return { denied: NextResponse.json({ error: "Unauthorized" }, { status: 403 }), email };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\d.]+\s*/g, "") // remove leading numbering like "3.2.1.1 "
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtmlForSearch(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);
}

// POST — create a wiki node
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, node_type, parent_id, sort_order, brand, html_content, slug, is_published } = body;

    // Auth: global admin or GM for the target brand
    const nodeBrand = brand || "tc";
    const { denied } = await requireWikiAdmin(nodeBrand);
    if (denied) return denied;

    if (!title || !node_type) {
      return NextResponse.json({ error: "title and node_type are required" }, { status: 400 });
    }

    const row: Record<string, unknown> = {
      title,
      node_type,
      parent_id: parent_id || null,
      sort_order: sort_order || 0,
      brand: brand || "tc",
      slug: slug || slugify(title),
      is_published: is_published !== undefined ? is_published : true,
    };

    if (html_content) {
      row.html_content = html_content;
      row.search_text = stripHtmlForSearch(html_content);
    }

    const { data, error } = await supabaseAdmin
      .from("wiki_nodes")
      .insert(row)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — update a wiki node
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Look up the node's brand for GM auth check
    const { data: existingNode } = await supabaseAdmin
      .from("wiki_nodes")
      .select("brand")
      .eq("id", id)
      .single();
    const nodeBrand = existingNode?.brand || "tc";
    const { denied } = await requireWikiAdmin(nodeBrand);
    if (denied) return denied;

    // Rebuild search_text if html_content changed
    if (updates.html_content) {
      updates.search_text = stripHtmlForSearch(updates.html_content);
    }

    // Auto-generate slug if title changed
    if (updates.title && !updates.slug) {
      updates.slug = slugify(updates.title);
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("wiki_nodes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT — bulk re-transform all article HTML content
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PUT(_req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { data: articles, error: fetchErr } = await supabaseAdmin
      .from("wiki_nodes")
      .select("id, html_content")
      .eq("node_type", "article")
      .not("html_content", "is", null);

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    let updated = 0;
    for (const article of articles || []) {
      const html = article.html_content as string;
      if (!html.includes('class="scribe-step"')) continue;

      const transformed = transformScribeHtml(html);
      if (transformed !== html) {
        await supabaseAdmin
          .from("wiki_nodes")
          .update({
            html_content: transformed,
            search_text: stripHtmlForSearch(transformed),
            updated_at: new Date().toISOString(),
          })
          .eq("id", article.id);
        updated++;
      }
    }

    return NextResponse.json({ success: true, updated, total: articles?.length || 0 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function transformScribeHtml(html: string): string {
  let result = html;
  result = result.replace(/<p class="scribe-author">[\s\S]*?<\/p>/gi, "");
  result = result.replace(/^(\s*<br\s*\/?>\s*)+/gi, "");
  result = result.replace(/(<\/p>)\s*(<br\s*\/?>\s*)+/gi, "$1");

  // Parse step blocks properly by finding matching closing </div>
  const blocks: string[] = [];
  let i = 0;
  while (i < result.length) {
    const stepStart = result.indexOf('<div class="scribe-step">', i);
    if (stepStart === -1) { blocks.push(result.substring(i)); break; }
    blocks.push(result.substring(i, stepStart));
    let depth = 0, j = stepStart, endIdx = -1;
    while (j < result.length) {
      const openDiv = result.indexOf("<div", j);
      const closeDiv = result.indexOf("</div>", j);
      if (closeDiv === -1) break;
      if (openDiv !== -1 && openDiv < closeDiv) { depth++; j = openDiv + 4; }
      else { depth--; if (depth === 0) { endIdx = closeDiv + 6; break; } j = closeDiv + 6; }
    }
    if (endIdx === -1) { blocks.push(result.substring(stepStart)); break; }
    let stepHtml = result.substring(stepStart, endIdx);
    const numMatch = stepHtml.match(/<p class="scribe-step-text">\s*(\d+)\.\s*/);
    if (numMatch && !stepHtml.includes('class="step-number"') && !stepHtml.includes('scribe-step-warning') && !stepHtml.includes('scribe-step-tip') && !stepHtml.includes('scribe-step-alert')) {
      const num = numMatch[1];
      let inner = stepHtml.replace(/^<div class="scribe-step">\s*/, "").replace(/\s*<\/div>$/, "");
      inner = inner.replace(/<p class="scribe-step-text">\s*\d+\.\s*/, "<p>");
      const afterStep = result.substring(endIdx);
      const screenshotMatch = afterStep.match(/^\s*(<(?:p|div) class="scribe-screenshot-container">[\s\S]*?<\/(?:p|div)>)/i);
      let screenshotHtml = "";
      if (screenshotMatch) {
        screenshotHtml = screenshotMatch[1].replace(/<p class="scribe-screenshot-container">/gi, '<div class="scribe-screenshot-container">').replace(/<\/p>$/i, "</div>");
        endIdx += screenshotMatch[0].length;
      }
      stepHtml = `<div class="scribe-step"><div class="step-number">${num}</div><div class="step-content">${inner}${screenshotHtml}</div></div>`;
    }
    blocks.push(stepHtml);
    i = endIdx;
  }
  result = blocks.join("");
  result = result.replace(/<p class="scribe-screenshot-container">([\s\S]*?)<\/p>/gi, '<div class="scribe-screenshot-container">$1</div>');
  return result;
}

// DELETE — delete a wiki node
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Look up the node's brand for GM auth check
    const { data: existingNode } = await supabaseAdmin
      .from("wiki_nodes")
      .select("brand")
      .eq("id", id)
      .single();
    const nodeBrand = existingNode?.brand || "tc";
    const { denied } = await requireWikiAdmin(nodeBrand);
    if (denied) return denied;

    // Check for children
    const { data: children } = await supabaseAdmin
      .from("wiki_nodes")
      .select("id")
      .eq("parent_id", id)
      .limit(1);

    if (children && children.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete a node with children. Delete or move children first." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("wiki_nodes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

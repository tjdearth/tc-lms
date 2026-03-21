import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

// DELETE — delete a wiki node
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

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

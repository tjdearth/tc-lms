"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import VideoEmbed from "./VideoEmbed";
import { useEffect, useCallback, useRef, useState } from "react";

const BRAND_COLORS = [
  // TC core
  { label: "TC Navy", color: "#304256" },
  { label: "TC Accent", color: "#27a28c" },
  // DMC brands
  { label: "Italy", color: "#C6B356" },
  { label: "Spain", color: "#7C1137" },
  { label: "East Africa", color: "#4F9E2D" },
  { label: "France", color: "#58392E" },
  { label: "UK", color: "#6D7581" },
  { label: "Indonesia", color: "#ADA263" },
  { label: "Japan", color: "#E9395E" },
  { label: "UAE", color: "#B28A72" },
  { label: "Mexico", color: "#E56456" },
  { label: "Australia", color: "#B04D32" },
  { label: "Colombia", color: "#FEE9A8" },
  { label: "Greece", color: "#0E1952" },
  { label: "Thailand", color: "#636218" },
  { label: "Peru", color: "#95AFA2" },
  { label: "Turkey", color: "#247F82" },
  { label: "Morocco", color: "#F56A23" },
  // Common extras
  { label: "Black", color: "#000000" },
  { label: "Dark Gray", color: "#374151" },
  { label: "Gray", color: "#6b7280" },
  { label: "Red", color: "#dc2626" },
  { label: "White", color: "#ffffff" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", color: "#fef08a" },
  { label: "Green", color: "#bbf7d0" },
  { label: "Blue", color: "#bfdbfe" },
  { label: "Pink", color: "#fbcfe8" },
  { label: "Orange", color: "#fed7aa" },
  { label: "TC Accent", color: "#ccfbf1" },
];

interface BlockEditorProps {
  content: string;
  onChange: (html: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/wiki/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Upload failed");
  }
  const data = await res.json();
  return data.url;
}

async function proxyUploadUrl(url: string): Promise<string> {
  const res = await fetch("/api/wiki/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Proxy upload failed");
  }
  const data = await res.json();
  return data.url;
}

function isOurUrl(src: string): boolean {
  if (!src) return false;
  if (src.includes("supabase.co/storage")) return true;
  return false;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded text-xs font-medium transition-colors ${
        active
          ? "bg-accent/15 text-accent"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />;
}

function ColorDropdown({
  colors,
  activeColor,
  onSelect,
  onClear,
  title,
  icon,
}: {
  colors: { label: string; color: string }[];
  activeColor: string | undefined;
  onSelect: (color: string) => void;
  onClear: () => void;
  title: string;
  icon: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={title}
        className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-0.5 ${
          activeColor
            ? "bg-accent/15 text-accent"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
      >
        {icon}
        <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="opacity-50">
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 w-[220px]">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {colors.map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => {
                  onSelect(c.color);
                  setOpen(false);
                }}
                title={c.label}
                className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform relative"
                style={{ backgroundColor: c.color }}
              >
                {activeColor === c.color && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={c.color === "#ffffff" || c.color === "#FEE9A8" || c.color === "#fef08a" ? "#374151" : "#ffffff"}
                    strokeWidth="3"
                    className="absolute inset-0 m-auto"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            className="w-full text-left text-[11px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
          >
            Remove color
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlockEditor({ content, onChange }: BlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacePosRef = useRef<number | null>(null);

  const handleImageUpload = useCallback(
    async (file: File, editorInstance: ReturnType<typeof useEditor>) => {
      if (!editorInstance) return;
      setUploading(true);
      setUploadStatus("Uploading image...");
      try {
        const url = await uploadImage(file);
        editorInstance.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Image upload failed");
      } finally {
        setUploading(false);
        setUploadStatus("");
      }
    },
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ inline: false }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#27a28c] underline cursor-pointer hover:text-[#1e7a6a]",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      VideoEmbed,
    ],
    content,
    editorProps: {
      attributes: {
        class: "block-editor-content scribe-content outline-none min-h-[300px] p-4",
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        // Case 1: Binary image on clipboard (right-click copy image, screenshot paste)
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              setUploading(true);
              setUploadStatus("Uploading image...");
              uploadImage(file)
                .then((url) => {
                  const node = view.state.schema.nodes.image.create({ src: url });
                  const tr = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(tr);
                })
                .catch((err) => {
                  alert(err instanceof Error ? err.message : "Image upload failed");
                })
                .finally(() => {
                  setUploading(false);
                  setUploadStatus("");
                });
            }
            return true;
          }
        }

        // Case 2: HTML paste with <img> tags (Ctrl+C a section from a webpage)
        // Let Tiptap handle the paste normally. Then try to re-upload external images.
        const html = event.clipboardData?.getData("text/html");
        if (html) {
          const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
          const externalUrls: string[] = [];
          let m;
          while ((m = imgRegex.exec(html)) !== null) {
            const src = m[1];
            if (src && !src.startsWith("data:") && !src.startsWith("blob:") && !isOurUrl(src)) {
              externalUrls.push(src);
            }
          }

          if (externalUrls.length > 0) {
            // After Tiptap processes the paste, try to re-upload external images
            setTimeout(() => {
              reUploadExternalImages(view, externalUrls);
            }, 200);
          }
        }

        return false; // Let Tiptap handle the paste
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        const file = files[0];
        if (!file.type.startsWith("image/")) return false;
        event.preventDefault();
        setUploading(true);
        setUploadStatus("Uploading image...");
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        uploadImage(file)
          .then((url) => {
            const node = view.state.schema.nodes.image.create({ src: url });
            if (coordinates) {
              view.dispatch(view.state.tr.insert(coordinates.pos, node));
            } else {
              view.dispatch(view.state.tr.replaceSelectionWith(node));
            }
          })
          .catch((err) => {
            alert(err instanceof Error ? err.message : "Image upload failed");
          })
          .finally(() => {
            setUploading(false);
            setUploadStatus("");
          });
        return true;
      },
      // When user clicks on an image node, allow replacing it
      handleClickOn: (view, pos, node) => {
        if (node.type.name === "image" && !isOurUrl(node.attrs.src || "")) {
          // This is an external/broken image — offer to replace
          replacePosRef.current = pos;
          replaceInputRef.current?.click();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Try to re-upload external images via server proxy
  const reUploadExternalImages = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (view: any, urls: string[]) => {
      const uniqueUrls = Array.from(new Set(urls));
      let succeeded = 0;
      let failed = 0;

      setUploading(true);
      setUploadStatus(`Re-uploading ${uniqueUrls.length} image(s)...`);

      const results: Array<{ originalSrc: string; newUrl: string } | null> = [];

      for (const originalSrc of uniqueUrls) {
        try {
          const newUrl = await proxyUploadUrl(originalSrc);
          results.push({ originalSrc, newUrl });
          succeeded++;
        } catch {
          results.push(null);
          failed++;
        }
        setUploadStatus(
          `Re-uploading images... ${succeeded + failed}/${uniqueUrls.length}`
        );
      }

      // Replace URLs in the document
      const successfulResults = results.filter(Boolean) as Array<{
        originalSrc: string;
        newUrl: string;
      }>;

      if (successfulResults.length > 0) {
        // Collect positions to update (reverse order to maintain position validity)
        const updates: Array<{
          pos: number;
          attrs: Record<string, unknown>;
        }> = [];
        view.state.doc.descendants(
          (node: { type: { name: string }; attrs: Record<string, unknown> }, pos: number) => {
            if (node.type.name === "image" && node.attrs.src) {
              const match = successfulResults.find(
                (r) => r.originalSrc === node.attrs.src
              );
              if (match) {
                updates.push({
                  pos,
                  attrs: { ...node.attrs, src: match.newUrl },
                });
              }
            }
          }
        );

        if (updates.length > 0) {
          // Apply in reverse order so positions stay valid
          updates.sort((a, b) => b.pos - a.pos);
          let tr = view.state.tr;
          for (const update of updates) {
            tr = tr.setNodeMarkup(update.pos, undefined, update.attrs);
          }
          view.dispatch(tr);
        }
      }

      setUploading(false);
      if (failed > 0 && succeeded === 0) {
        setUploadStatus("");
        // Don't alert — images will show with external URLs. User can click to replace.
        console.warn(
          `Could not re-upload ${failed} image(s) from external source. Click on any broken image to replace it.`
        );
      } else if (failed > 0) {
        setUploadStatus("");
        console.warn(
          `Re-uploaded ${succeeded} image(s). ${failed} could not be fetched — click to replace.`
        );
      } else {
        setUploadStatus("");
      }
    },
    []
  );

  // Sync external content changes (e.g. switching between nodes)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Add click-to-replace for broken images in the editor DOM
  useEffect(() => {
    if (!editor) return;
    const editorEl = editor.view.dom;

    const handleImgError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img.tagName !== "IMG") return;
      // Style the broken image as a clickable placeholder
      img.style.minHeight = "80px";
      img.style.minWidth = "200px";
      img.style.background = "#f3f4f6";
      img.style.border = "2px dashed #d1d5db";
      img.style.borderRadius = "8px";
      img.style.cursor = "pointer";
      img.title = "Click to upload a replacement image";
    };

    editorEl.addEventListener("error", handleImgError, true);
    return () => editorEl.removeEventListener("error", handleImgError, true);
  }, [editor]);

  if (!editor) return null;

  const addImageFromUrl = () => {
    const url = prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addVideo = () => {
    const url = prompt("Video URL (YouTube, Vimeo, Loom, Google Drive, or direct .mp4):");
    if (url) {
      editor.chain().focus().setVideoEmbed({ src: url }).run();
    }
  };

  const addImageFromFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, editor);
    }
    e.target.value = "";
  };

  // Replace a broken image at a known position
  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const pos = replacePosRef.current;
    if (!file || pos === null || !editor) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadStatus("Replacing image...");
    try {
      const url = await uploadImage(file);
      // Find the node at this position and replace its src
      const resolvedPos = editor.state.doc.resolve(pos);
      const node = resolvedPos.nodeAfter;
      if (node && node.type.name === "image") {
        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: url,
          })
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      setUploadStatus("");
      replacePosRef.current = null;
      e.target.value = "";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white relative">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleReplaceImage}
      />

      {/* Upload overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {uploadStatus || "Uploading..."}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <Divider />

        {/* Inline formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            const url = window.prompt("Enter URL:", "https://");
            if (url) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
          }}
          active={editor.isActive("link")}
          title={editor.isActive("link") ? "Remove link" : "Add link"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </ToolbarButton>

        {/* Text color */}
        <ColorDropdown
          colors={BRAND_COLORS}
          activeColor={editor.getAttributes("textStyle").color}
          onSelect={(color) => editor.chain().focus().setColor(color).run()}
          onClear={() => editor.chain().focus().unsetColor().run()}
          title="Text color"
          icon={
            <span className="relative font-bold text-xs leading-none">
              A
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ backgroundColor: editor.getAttributes("textStyle").color || "#374151" }}
              />
            </span>
          }
        />

        {/* Highlight */}
        <ColorDropdown
          colors={HIGHLIGHT_COLORS}
          activeColor={editor.getAttributes("highlight").color}
          onSelect={(color) =>
            editor.chain().focus().toggleHighlight({ color }).run()
          }
          onClear={() => editor.chain().focus().unsetHighlight().run()}
          title="Highlight"
          icon={
            <span className="relative font-bold text-xs leading-none px-0.5 rounded-sm" style={{ backgroundColor: editor.getAttributes("highlight").color || "#fef08a" }}>
              H
            </span>
          }
        />

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="6" x2="20" y2="6" />
            <line x1="10" y1="12" x2="20" y2="12" />
            <line x1="10" y1="18" x2="20" y2="18" />
            <text x="2" y="8" fill="currentColor" stroke="none" fontSize="8" fontWeight="600">1</text>
            <text x="2" y="14" fill="currentColor" stroke="none" fontSize="8" fontWeight="600">2</text>
            <text x="2" y="20" fill="currentColor" stroke="none" fontSize="8" fontWeight="600">3</text>
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Callout / Quote"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </ToolbarButton>

        {/* Image: upload + URL */}
        <div className="relative group">
          <ToolbarButton onClick={addImageFromFile} title="Upload image">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={addImageFromUrl} title="Image from URL">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="16" height="16" rx="2" />
              <circle cx="7" cy="7" r="1.5" />
              <polyline points="18 12 13 7 4 16" />
              <path d="M18 16l3-3" />
              <path d="M21 18l-3 3" />
              <line x1="18" y1="16" x2="21" y2="18" />
            </svg>
          </ToolbarButton>
        </div>
        <ToolbarButton onClick={addVideo} title="Embed video">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </ToolbarButton>

        <Divider />

        {/* Horizontal rule */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal line"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </ToolbarButton>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import VideoEmbed from "./VideoEmbed";
import { useEffect, useCallback, useRef, useState } from "react";

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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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

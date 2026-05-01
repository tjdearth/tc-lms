// Shared helpers for video URL handling across micro-learning views.
// Supports YouTube, Vimeo, Loom, and Google Drive.

export interface VideoSource {
  kind: "youtube" | "vimeo" | "loom" | "drive" | "direct" | "unknown";
  id: string | null;
}

export function detectVideoSource(url: string): VideoSource {
  if (!url) return { kind: "unknown", id: null };

  // YouTube — handles youtube.com/watch?v=, youtu.be/, /embed/, /shorts/
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/
  );
  if (yt) return { kind: "youtube", id: yt[1] };

  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "vimeo", id: vimeo[1] };

  // Loom
  const loom = url.match(/loom\.com\/share\/([\w-]+)/);
  if (loom) return { kind: "loom", id: loom[1] };

  // Google Drive — handles /file/d/ID, open?id=ID, /d/ID
  const drive = url.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)|\/d\/([\w-]+)/
  );
  if (drive) return { kind: "drive", id: drive[1] || drive[2] };

  // Direct video file (.mp4 etc.)
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return { kind: "direct", id: null };
  }

  return { kind: "unknown", id: null };
}

// Convert any supported video URL to an embeddable iframe src
export function toEmbedUrl(url: string): string {
  const src = detectVideoSource(url);
  switch (src.kind) {
    case "youtube":
      return `https://www.youtube.com/embed/${src.id}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${src.id}`;
    case "loom":
      return `https://www.loom.com/embed/${src.id}`;
    case "drive":
      return `https://drive.google.com/file/d/${src.id}/preview`;
    default:
      return url;
  }
}

// Get an auto-generated thumbnail/poster image URL for a video, or empty string.
// `size` is a hint — Drive uses w-prefixed widths, YouTube uses fixed quality keys.
export function getVideoThumbnail(url: string, size: number = 400): string {
  const src = detectVideoSource(url);
  if (src.kind === "youtube" && src.id) {
    // hqdefault works for any video; use maxresdefault when caller wants larger
    const quality = size >= 600 ? "maxresdefault" : "hqdefault";
    return `https://img.youtube.com/vi/${src.id}/${quality}.jpg`;
  }
  if (src.kind === "drive" && src.id) {
    return `https://lh3.googleusercontent.com/d/${src.id}=w${size}`;
  }
  return "";
}

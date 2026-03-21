import { Node, mergeAttributes } from "@tiptap/core";

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, string>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

function toEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([\w-]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

  // Google Drive
  const driveMatch = url.match(
    /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/
  );
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;

  // Already an embed URL or direct video — return as-is
  return url;
}

const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => {
          // Handle iframe src
          const iframe = element.querySelector("iframe");
          if (iframe) return iframe.getAttribute("src");
          // Handle video src
          const video = element.querySelector("video");
          if (video) return video.getAttribute("src");
          // Handle data attribute
          return element.getAttribute("data-src");
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-embed]',
      },
      {
        tag: "iframe",
        getAttrs: (node) => {
          const src = (node as HTMLElement).getAttribute("src") || "";
          if (
            src.includes("youtube") ||
            src.includes("vimeo") ||
            src.includes("loom")
          ) {
            return { src };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src || "";
    const embedSrc = toEmbedUrl(src);

    // Check if it's a direct video file
    const isDirectVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(embedSrc);

    if (isDirectVideo) {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, {
          "data-video-embed": "",
          "data-src": src,
          class: "video-embed-wrapper",
        }),
        [
          "video",
          {
            src: embedSrc,
            controls: "true",
            style:
              "width:100%;max-width:100%;border-radius:0.5rem;border:1px solid #e5e7eb;",
          },
        ],
      ];
    }

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-video-embed": "",
        "data-src": src,
        class: "video-embed-wrapper",
      }),
      [
        "iframe",
        {
          src: embedSrc,
          frameborder: "0",
          allowfullscreen: "true",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          style:
            "width:100%;aspect-ratio:16/9;border-radius:0.5rem;border:1px solid #e5e7eb;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: toEmbedUrl(options.src) },
          });
        },
    };
  },
});

export default VideoEmbed;

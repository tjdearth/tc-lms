import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* eslint-disable @typescript-eslint/no-explicit-any */
const components = {
  h1: ({ children }: any) => <h1 className="text-lg font-bold text-gray-800 mt-6 mb-3">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-base font-semibold text-gray-800 mt-6 mb-3">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">{children}</h3>,
  strong: ({ children }: any) => <strong className="font-semibold text-gray-800">{children}</strong>,
  em: ({ children }: any) => <em>{children}</em>,
  ul: ({ children }: any) => <ul className="ml-4 list-disc text-[13px] leading-relaxed my-3">{children}</ul>,
  ol: ({ children }: any) => <ol className="ml-4 list-decimal text-[13px] leading-relaxed my-3">{children}</ol>,
  li: ({ children }: any) => <li className="text-[13px] leading-relaxed mb-1">{children}</li>,
  p: ({ children }: any) => <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{children}</p>,
  a: ({ href, children }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#27a28c] hover:underline">{children}</a>,
  code: ({ children }: any) => <code className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[12px] font-mono text-gray-800">{children}</code>,
  blockquote: ({ children }: any) => <blockquote className="border-l-2 border-[#27a28c] pl-3 my-2 text-gray-600 italic">{children}</blockquote>,
  hr: () => <hr className="border-gray-200 my-4" />,
  del: ({ children }: any) => <del className="text-gray-400">{children}</del>,
  table: ({ children }: any) => <table className="w-full text-[13px] border-collapse my-3">{children}</table>,
  thead: ({ children }: any) => <thead className="border-b border-gray-200">{children}</thead>,
  th: ({ children }: any) => <th className="text-left text-gray-800 font-semibold py-1.5 pr-4">{children}</th>,
  td: ({ children }: any) => <td className="text-gray-600 py-1.5 pr-4 border-b border-gray-100">{children}</td>,
  input: ({ checked }: any) => <input type="checkbox" checked={checked} disabled className="mr-1.5 accent-[#27a28c]" />,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function MarkdownText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{text}</ReactMarkdown>
    </div>
  );
}

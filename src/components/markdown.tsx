import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LocalizedLink } from "./localized-link";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-dark">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children, title }) => href?.startsWith("/") ? <LocalizedLink href={href} title={title}>{children}</LocalizedLink> : <a href={href} title={title}>{children}</a> }}>{content}</ReactMarkdown>
    </div>
  );
}

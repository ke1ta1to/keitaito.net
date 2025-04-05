import { JSDOM } from "jsdom";

interface LinkCardProps {
  href: string;
}

export async function LinkCard({ href }: LinkCardProps) {
  const dom = await JSDOM.fromURL(href);
  const doc = dom.window.document;
  const title = doc.querySelector("title")?.textContent || "No title found";
  const description =
    doc.querySelector("meta[name='description']")?.getAttribute("content") ||
    "No description found";
  const image = doc
    .querySelector("meta[property='og:image']")
    ?.getAttribute("content");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-8 flex h-32 overflow-hidden rounded bg-gray-50"
    >
      <div className="flex flex-1 flex-col overflow-hidden p-4 whitespace-nowrap">
        <div className="overflow-hidden font-bold text-ellipsis">{title}</div>
        <div className="overflow-hidden text-sm text-ellipsis text-gray-500">
          {description}
        </div>
        <div className="mt-auto overflow-hidden text-sm text-ellipsis text-gray-500">
          {href}
        </div>
      </div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} className="h-full w-auto shrink-0" />
      )}
    </a>
  );
}

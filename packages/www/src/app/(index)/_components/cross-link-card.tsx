import { IconExternalLink, IconInfoCircle } from "@tabler/icons-react";

import prisma from "../../../../lib/prisma";

import { OverviewCard } from "@/components/overview-card";

export async function CrossLinkCard() {
  const crossLink = await prisma.crossLink.findMany();

  return (
    <OverviewCard title="相互リンク">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {crossLink.map((link) => (
          <li key={link.id} className="overflow-hidden">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-start gap-4 p-2"
            >
              {link.image && (
                <div className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={link.image}
                    alt={link.title}
                    className="h-16 w-24 rounded object-cover"
                  />
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-medium group-hover:underline">
                  {link.title}
                </h3>
                {link.description && (
                  <p className="mt-1 truncate text-sm text-gray-700">
                    {link.description}
                  </p>
                )}
              </div>
              <IconExternalLink className="mt-1 h-5 w-5 shrink-0 self-start text-gray-400" />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-3 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <IconInfoCircle className="h-4 w-4 text-gray-400" />
            <span>相互リンクの申請について</span>
          </div>
          <button
            className="cursor-pointer rounded bg-gray-100 px-2 py-1 text-gray-600 hover:bg-gray-200"
            type="button"
          >
            掲載申請
          </button>
        </div>
      </div>
    </OverviewCard>
  );
}

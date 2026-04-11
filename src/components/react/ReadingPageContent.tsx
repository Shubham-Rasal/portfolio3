import type {
  ReadingCategory,
  ReadingLinkKind,
} from "../../data/reading";
import {
  BookOpen,
  BookOpenText,
  Database,
  ExternalLink,
  FileDown,
  FileText,
  Globe,
  Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const linkIcons: Record<ReadingLinkKind, LucideIcon> = {
  paper: FileText,
  blog: BookOpen,
  wiki: Library,
  web: Globe,
  pdf: FileDown,
  docs: BookOpenText,
  huggingface: Database,
  default: ExternalLink,
};

type Props = {
  categories: ReadingCategory[];
};

export default function ReadingPageContent({ categories }: Props) {
  return (
    <div className="lw-sans">
      {categories.map((cat) => (
        <section
          key={cat.id}
          className="mt-12 first:mt-0 scroll-mt-24"
          aria-labelledby={`cat-${cat.id}`}
        >
          <header className="mb-1">
            <h2
              id={`cat-${cat.id}`}
              className="text-[11px] font-medium uppercase tracking-[0.16em]"
              style={{ color: "var(--lw-muted)" }}
            >
              {cat.title}
            </h2>
            {cat.subtitle ? (
              <p className="mt-1 text-[13px] leading-snug" style={{ color: "var(--lw-muted)" }}>
                {cat.subtitle}
              </p>
            ) : null}
          </header>

          <ul className="mt-4 border-t divide-y" style={{ borderColor: "var(--lw-border)" }}>
            {cat.items.map((item) => (
              <li key={`${cat.id}-${item.title}`} className="py-3.5 first:pt-3" style={{ borderColor: "var(--lw-border)" }}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-[1.05rem] sm:text-[1.08rem] font-normal leading-snug" style={{ color: "var(--lw-text)" }}>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--lw-muted)" }}>
                      {item.hook}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end sm:pt-0.5">
                    {item.links.map((link) => {
                      const Icon = linkIcons[link.kind];
                      return (
                        <a
                          key={link.href + link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[13px] transition"
                          style={{ color: "var(--lw-muted)" }}
                        >
                          <Icon
                            className="h-3 w-3 shrink-0 opacity-50"
                            strokeWidth={1.5}
                            aria-hidden
                          />
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@aback-ui/ui";

import { blocks } from "@/data/blocks";
import { componentGroups } from "@/data/component-catalog";
import { guideNav, type NavSection } from "@/data/site";

const componentCount = componentGroups.reduce((count, group) => count + group.items.length, 0);

function NavLink({
  href,
  active,
  onNavigate,
  children,
  count,
}: {
  href: string;
  active: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-1.5 text-sm transition-colors duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring",
        active
          ? "bg-brand-wash font-medium text-link"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="truncate">{children}</span>
      {count !== undefined ? (
        <span className={cn("text-xs tabular-nums", active ? "text-link" : "text-muted-foreground")}>{count}</span>
      ) : null}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
      {children}
    </p>
  );
}

function GuideSection({
  section,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <SectionTitle>{section.title}</SectionTitle>
      <ul className="flex flex-col gap-px">
        {section.items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} active={pathname === item.href} onNavigate={onNavigate}>
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Every documentation destination, grouped the way the sidebar and the
 * mobile drawer show it. One tree, so the two can never disagree.
 */
export function DocsNavTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-7">
      {guideNav.slice(0, 2).map((section) => (
        <GuideSection key={section.title} section={section} pathname={pathname} onNavigate={onNavigate} />
      ))}

      <div>
        <SectionTitle>Components</SectionTitle>
        <ul className="flex flex-col gap-px">
          <li>
            <NavLink
              href="/docs/components"
              active={pathname === "/docs/components"}
              onNavigate={onNavigate}
              count={componentCount}
            >
              All components
            </NavLink>
          </li>
        </ul>
        {componentGroups.map((group) => (
          <div key={group.category} className="mt-4">
            <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">{group.category}</p>
            <ul className="flex flex-col gap-px border-l border-separator ml-3">
              {group.items.map((item) => {
                const href = `/docs/components/${item.name}`;
                return (
                  <li key={item.name} className="-ml-px">
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={pathname === href ? "page" : undefined}
                      className={cn(
                        "block border-l py-1.5 pl-3 pr-3 text-sm transition-colors duration-150",
                        "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring",
                        pathname === href
                          ? "border-primary-500 bg-brand-wash font-medium text-link"
                          : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>Blocks</SectionTitle>
        <ul className="flex flex-col gap-px">
          <li>
            <NavLink
              href="/docs/blocks"
              active={pathname === "/docs/blocks"}
              onNavigate={onNavigate}
              count={blocks.length}
            >
              All blocks
            </NavLink>
          </li>
          {blocks.map((block) => {
            const href = `/docs/blocks/${block.name}`;
            return (
              <li key={block.name}>
                <NavLink href={href} active={pathname === href} onNavigate={onNavigate}>
                  {block.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {guideNav.slice(2).map((section) => (
        <GuideSection key={section.title} section={section} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";

import { Pagination } from "@/components/ui/pagination";

const items = Array.from({ length: 47 }, (_, index) => ({
  id: index + 1,
  title: `Deployment ${String(index + 1).padStart(2, "0")}`,
}));

const PAGE_SIZE = 6;

export function PaginationExample() {
  const [page, setPage] = useState(3);
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const visible = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ul className="divide-y divide-border border border-border">
        {visible.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-2.5">
            <span className="font-mono text-xs text-foreground">{item.title}</span>
            <span className="text-xs text-muted-foreground">page {page}</span>
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        labels={{ navigation: "Deployment pages" }}
      />
      <p className="text-xs text-muted-foreground">
        Page {page} of {pageCount} · {items.length} deployments
      </p>
    </div>
  );
}

import { useState } from "react";
import type { Story } from "@ladle/react";
import { DataTable } from "./DataTable";
import type { ColumnDef, SortState } from "./DataTable";

/* ---------- Shared sample data ---------- */

interface Post {
  id: string;
  title: string;
  platform: string;
  status: string;
  scheduled: string;
  impressions: number;
}

const POSTS: Post[] = [
  {
    id: "1",
    title: "Why AI pilot projects fail",
    platform: "LinkedIn",
    status: "Scheduled",
    scheduled: "2026-06-01",
    impressions: 12400,
  },
  {
    id: "2",
    title: "Shipping vs. speculating",
    platform: "Twitter / X",
    status: "Draft",
    scheduled: "2026-06-03",
    impressions: 8910,
  },
  {
    id: "3",
    title: "The six-month staging trap",
    platform: "LinkedIn",
    status: "Published",
    scheduled: "2026-05-28",
    impressions: 6240,
  },
  {
    id: "4",
    title: "Design system ROI",
    platform: "Twitter / X",
    status: "Scheduled",
    scheduled: "2026-06-05",
    impressions: 3100,
  },
  {
    id: "5",
    title: "Why engineers hate estimates",
    platform: "LinkedIn",
    status: "Draft",
    scheduled: "2026-06-08",
    impressions: 0,
  },
];

const BASE_COLUMNS: ColumnDef<Post>[] = [
  {
    id: "title",
    header: "Title",
    accessor: (row) => row.title,
    sortable: true,
  },
  {
    id: "platform",
    header: "Platform",
    accessor: (row) => row.platform,
    sortable: true,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    filterable: true,
  },
  {
    id: "scheduled",
    header: "Scheduled",
    accessor: (row) => row.scheduled,
    sortable: true,
  },
  {
    id: "impressions",
    header: "Impressions",
    accessor: (row) => row.impressions.toLocaleString(),
    sortable: true,
  },
];

/* ---------- Default — uncontrolled, no sort ---------- */

export const Default: Story = () => (
  <DataTable
    columns={BASE_COLUMNS}
    rows={POSTS}
    pageCount={1}
    caption="Scheduled posts"
    totalRows={POSTS.length}
  />
);

Default.storyName = "Default";

/* ---------- WithSort — controlled sort ---------- */

export const WithSort: Story = () => {
  const [sortState, setSortState] = useState<SortState | null>(null);

  const sorted = [...POSTS].sort((a, b) => {
    if (!sortState) return 0;
    const { columnId, direction } = sortState;
    const aVal = String(a[columnId as keyof Post]);
    const bVal = String(b[columnId as keyof Post]);
    const cmp = aVal.localeCompare(bVal);
    return direction === "asc" ? cmp : -cmp;
  });

  return (
    <DataTable
      columns={BASE_COLUMNS}
      rows={sorted}
      sortState={sortState}
      onSortChange={setSortState}
      pageCount={1}
      caption="Scheduled posts — sortable"
      totalRows={sorted.length}
    />
  );
};

WithSort.storyName = "WithSort";

/* ---------- WithPagination — controlled pagination ---------- */

const LONG_POSTS: Post[] = Array.from({ length: 43 }, (_, i) => ({
  id: String(i + 1),
  title: `Post number ${i + 1}`,
  platform: i % 2 === 0 ? "LinkedIn" : "Twitter / X",
  status: i % 3 === 0 ? "Published" : i % 3 === 1 ? "Scheduled" : "Draft",
  scheduled: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
  impressions: (i + 1) * 312,
}));

export const WithPagination: Story = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(LONG_POSTS.length / pageSize);
  const pageRows = LONG_POSTS.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DataTable
      columns={BASE_COLUMNS}
      rows={pageRows}
      page={page}
      pageSize={pageSize}
      pageCount={pageCount}
      onPageChange={setPage}
      caption="All posts — paginated"
      totalRows={LONG_POSTS.length}
    />
  );
};

WithPagination.storyName = "WithPagination";

/* ---------- EmptyState ---------- */

export const Empty: Story = () => (
  <DataTable
    columns={BASE_COLUMNS}
    rows={[]}
    pageCount={0}
    caption="Scheduled posts"
    emptyState={
      <div style={{ textAlign: "center", padding: "var(--space-8)" }}>No scheduled posts.</div>
    }
  />
);

Empty.storyName = "Empty";

/* ---------- EmptyDefaultSlot — uses default EmptyState ---------- */

export const EmptyDefault: Story = () => (
  <DataTable columns={BASE_COLUMNS} rows={[]} pageCount={0} caption="Scheduled posts" />
);

EmptyDefault.storyName = "EmptyDefault";

/* ---------- WithToolbar — filter slot above table ---------- */

export const WithToolbar: Story = () => {
  const [query, setQuery] = useState("");
  const filtered = POSTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.platform.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DataTable
      columns={BASE_COLUMNS}
      rows={filtered}
      pageCount={1}
      caption="Scheduled posts — with toolbar"
      totalRows={filtered.length}
      toolbar={
        <input
          type="search"
          placeholder="Filter posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-2)",
            padding: "var(--space-2) var(--space-3)",
            font: "inherit",
            width: "240px",
          }}
          aria-label="Filter posts"
        />
      }
    />
  );
};

WithToolbar.storyName = "WithToolbar";

/* ---------- Compact density ---------- */

export const Compact: Story = () => (
  <DataTable
    columns={BASE_COLUMNS}
    rows={POSTS}
    pageCount={1}
    density="compact"
    caption="Scheduled posts — compact"
    totalRows={POSTS.length}
  />
);

Compact.storyName = "Compact";

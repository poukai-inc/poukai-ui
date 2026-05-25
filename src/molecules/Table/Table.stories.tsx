import type { Story, StoryDefault } from "@ladle/react";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "./Table";

export default {
  title: "Molecules / Table",
} satisfies StoryDefault;

/* ---------- Shared sample data ---------- */

const COLUMNS = ["Name", "Role", "Status", "Joined"];

const ROWS = [
  { name: "Arian Zargaran", role: "Founder", status: "Active", joined: "2023" },
  { name: "Sam Rivera", role: "Engineer", status: "Active", joined: "2024" },
  { name: "Morgan Lee", role: "Designer", status: "On leave", joined: "2024" },
];

/* ---------- Default — comfortable density, default tone ---------- */

export const Default: Story = () => (
  <Table aria-label="Team members">
    <TableHead>
      <TableRow>
        {COLUMNS.map((col) => (
          <TableHeaderCell key={col}>{col}</TableHeaderCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {ROWS.map((row) => (
        <TableRow key={row.name}>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.role}</TableCell>
          <TableCell>{row.status}</TableCell>
          <TableCell>{row.joined}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

Default.storyName = "Default";

/* ---------- WithSubcomponents — compound API via Table namespace ---------- */

export const WithSubcomponents: Story = () => (
  <Table aria-label="Scheduled posts" density="comfortable" tone="default">
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Platform</Table.HeaderCell>
        <Table.HeaderCell align="end">Scheduled</Table.HeaderCell>
        <Table.HeaderCell align="center">Actions</Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Why AI pilot projects fail</Table.Cell>
        <Table.Cell>LinkedIn</Table.Cell>
        <Table.Cell align="end">2026-06-01</Table.Cell>
        <Table.Cell align="center">Edit · Delete</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Shipping vs. speculating</Table.Cell>
        <Table.Cell>Twitter / X</Table.Cell>
        <Table.Cell align="end">2026-06-03</Table.Cell>
        <Table.Cell align="center">Edit · Delete</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>The six-month staging trap</Table.Cell>
        <Table.Cell>LinkedIn</Table.Cell>
        <Table.Cell align="end">2026-06-07</Table.Cell>
        <Table.Cell align="center">Edit · Delete</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

WithSubcomponents.storyName = "WithSubcomponents";

/* ---------- ResponsiveOverflow — table inside a scroll container ---------- */

export const ResponsiveOverflow: Story = () => (
  <div style={{ overflowX: "auto", width: "100%", maxWidth: "420px" }}>
    <Table aria-label="Engagement metrics" density="compact">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Post</TableHeaderCell>
          <TableHeaderCell align="end">Impressions</TableHeaderCell>
          <TableHeaderCell align="end">Clicks</TableHeaderCell>
          <TableHeaderCell align="end">CTR</TableHeaderCell>
          <TableHeaderCell align="end">Replies</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Why AI fails</TableCell>
          <TableCell align="end">12,400</TableCell>
          <TableCell align="end">834</TableCell>
          <TableCell align="end">6.7%</TableCell>
          <TableCell align="end">42</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ship vs. speculate</TableCell>
          <TableCell align="end">8,910</TableCell>
          <TableCell align="end">521</TableCell>
          <TableCell align="end">5.8%</TableCell>
          <TableCell align="end">29</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Staging trap</TableCell>
          <TableCell align="end">6,240</TableCell>
          <TableCell align="end">380</TableCell>
          <TableCell align="end">6.1%</TableCell>
          <TableCell align="end">17</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

ResponsiveOverflow.storyName = "ResponsiveOverflow";

/* ---------- SubtleTone — embedded inside a section band ---------- */

export const SubtleTone: Story = () => (
  <div style={{ background: "var(--surface-section)", padding: "var(--space-6)" }}>
    <Table aria-label="Comments awaiting approval" tone="subtle">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Author</TableHeaderCell>
          <TableHeaderCell>Comment</TableHeaderCell>
          <TableHeaderCell align="end">Submitted</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Alex Kim</TableCell>
          <TableCell>Great post on AI pilots.</TableCell>
          <TableCell align="end">2026-05-20</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jordan Patel</TableCell>
          <TableCell>Would love a deeper dive on tooling.</TableCell>
          <TableCell align="end">2026-05-21</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

SubtleTone.storyName = "SubtleTone";

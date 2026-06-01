import type { StoryDefault, Story } from "@ladle/react";
import { useState } from "react";
import { FileUploader, type FileEntry } from "./FileUploader";
import { Field } from "../Field/Field";

export default {
  title: "Molecules / FileUploader",
} satisfies StoryDefault;

/* ── Idle (no files, zero config) ── */

export const Idle: Story = () => (
  <div style={{ width: "480px", padding: "var(--space-4)" }}>
    <FileUploader />
  </div>
);

/* ── With accept + maxSizeBytes hints ── */

export const WithConstraints: Story = () => (
  <div style={{ width: "480px", padding: "var(--space-4)" }}>
    <FileUploader
      accept="image/*,application/pdf"
      maxSizeBytes={10485760}
      dropZoneLabel="Drag images or PDFs here, or click to browse"
    />
  </div>
);

/* ── Single-file mode ── */

export const SingleFile: Story = () => (
  <div style={{ width: "480px", padding: "var(--space-4)" }}>
    <FileUploader
      multiple={false}
      accept=".pdf"
      dropZoneLabel="Drag a PDF here, or click to browse"
    />
  </div>
);

/* ── Disabled ── */

export const Disabled: Story = () => (
  <div style={{ width: "480px", padding: "var(--space-4)" }}>
    <FileUploader disabled dropZoneLabel="File upload disabled" />
  </div>
);

/* ── With files (controlled, pre-populated) ── */

const MOCK_FILES: FileEntry[] = [
  {
    id: "f1",
    file: new File([""], "design-spec.pdf", { type: "application/pdf" }),
  },
  {
    id: "f2",
    file: new File(["x".repeat(2048000)], "photo.jpg", { type: "image/jpeg" }),
  },
  {
    id: "f3",
    file: new File([""], "report.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }),
  },
];

export const WithFiles: Story = () => {
  const [files, setFiles] = useState<FileEntry[]>(MOCK_FILES);
  return (
    <div style={{ width: "480px", padding: "var(--space-4)" }}>
      <FileUploader
        files={files}
        onFilesAdded={(entries) => setFiles((prev) => [...prev, ...entries])}
        onFileRemoved={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        accept="image/*,application/pdf,.docx"
        maxSizeBytes={26214400}
      />
    </div>
  );
};

/* ── With progress ── */

export const WithProgress: Story = () => {
  const [files, setFiles] = useState<FileEntry[]>([
    {
      id: "p1",
      file: new File([""], "upload-me.mp4", { type: "video/mp4" }),
      progress: 42,
    },
    {
      id: "p2",
      file: new File([""], "thumbnail.png", { type: "image/png" }),
      progress: 100,
    },
  ]);
  return (
    <div style={{ width: "480px", padding: "var(--space-4)" }}>
      <FileUploader
        files={files}
        onFilesAdded={(entries) => setFiles((prev) => [...prev, ...entries])}
        onFileRemoved={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      />
    </div>
  );
};

/* ── With errors / rejected files ── */

export const WithErrors: Story = () => {
  const [files, setFiles] = useState<FileEntry[]>([
    {
      id: "e1",
      file: new File([""], "valid-doc.pdf", { type: "application/pdf" }),
    },
    {
      id: "e2",
      file: new File([""], "too-large.zip", { type: "application/zip" }),
      error: "File type not supported",
    },
    {
      id: "e3",
      file: new File(["x".repeat(30000000)], "bigfile.mp4", { type: "video/mp4" }),
      progress: 15,
      error: "Upload failed: connection timeout",
    },
  ]);
  return (
    <div style={{ width: "480px", padding: "var(--space-4)" }}>
      <FileUploader
        files={files}
        onFilesAdded={(entries) => setFiles((prev) => [...prev, ...entries])}
        onFileRemoved={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        accept="image/*,application/pdf"
        maxSizeBytes={26214400}
      />
    </div>
  );
};

/* ── Inside Field (canonical integration) ── */

export const InsideField: Story = () => (
  <div style={{ width: "480px", padding: "var(--space-4)" }}>
    <Field label="Attach media" helper="JPEG, PNG, PDF · max 25 MB each" id="story-media-upload">
      <FileUploader accept="image/*,application/pdf" maxSizeBytes={26214400} />
    </Field>
  </div>
);

/* ── Inside Field with error ── */

export const InsideFieldWithError: Story = () => (
  <div style={{ width: "480px", padding: "var(--space-4)" }}>
    <Field
      label="Supporting documents"
      error="At least one PDF is required."
      id="story-docs-upload"
      required
    >
      <FileUploader accept=".pdf,application/pdf" />
    </Field>
  </div>
);

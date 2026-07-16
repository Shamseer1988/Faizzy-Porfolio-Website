"use client";

import { useRef, useState } from "react";

type Props = {
  /** form field name that carries the stored URL (submitted with the form) */
  name: string;
  defaultValue?: string;
  label?: string;
  /** accept attribute for the file picker, e.g. "image/*" or "image/*,video/*" */
  accept?: string;
  placeholder?: string;
};

// Uploads a file to R2 via /api/admin/upload and stores the returned public
// URL in a text field. The text field stays editable so you can also paste a
// URL by hand — uploads just fill it in for you.
export default function MediaUpload({
  name,
  defaultValue = "",
  label,
  accept = "image/*",
  placeholder = "/uploads/… or https://…",
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const isImage = /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url) || url.startsWith("data:image");

  return (
    <div className="media-upload">
      {label && <label>{label}</label>}
      <div className="media-upload-row">
        <input
          type="text"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="media-upload-input"
        />
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Uploading…" : "⬆ Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={onPick}
          hidden
        />
      </div>
      {error && <p className="media-upload-err">{error}</p>}
      {url && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" className="media-upload-preview" />
      )}
    </div>
  );
}

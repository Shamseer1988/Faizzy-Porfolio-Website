"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Could not send right now. Please try again later.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("ok");
    } catch {
      setError("Network problem — check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form className="card rv" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="f-name">Your name</label>
        <input id="f-name" name="name" required maxLength={100} placeholder="Lionel Messi" />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input
          id="f-email"
          name="email"
          type="email"
          required
          maxLength={200}
          placeholder="goat@football.com"
        />
      </div>
      <div className="field">
        <label htmlFor="f-msg">Message</label>
        <textarea
          id="f-msg"
          name="message"
          required
          maxLength={4000}
          placeholder="Hi Zohan! Loved your robot…"
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "🚀 Launch message"}
      </button>
      {status === "ok" && (
        <p className="form-note ok">Message sent! It&apos;s waiting in the admin inbox. ✔</p>
      )}
      {status === "error" && <p className="form-note err">{error}</p>}
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  frameForCategory,
  frameIds,
  frames,
  isFrameId,
  type FrameId,
} from "@/lib/frames";
import { copySchema, emptyCopy, type CopyFields, type Piece } from "@/lib/types";

const fields = [
  ["name", "Name"],
  ["category", "Category"],
  ["materials", "Materials"],
  ["story", "Story"],
  ["adHeadline", "Ad headline"],
  ["adBody", "Ad body"],
  ["socialCaption", "Social caption"],
  ["altText", "Alt text"],
] as const satisfies ReadonlyArray<readonly [keyof CopyFields, string]>;

type DraftStatus =
  | "idle"
  | "generating"
  | "ready"
  | "publishing"
  | "published"
  | "error";

type ShowcaseStatus = "idle" | "working" | "ready" | "error";

type Draft = {
  localId: string;
  file: File;
  previewUrl: string;
  frame: FrameId;
  showcaseFile?: File;
  showcaseUrl?: string;
  showcaseStatus: ShowcaseStatus;
  status: DraftStatus;
  error?: string;
  piece?: Piece;
  fields: CopyFields;
};

function errorFromBody(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }
  return fallback;
}

function fileFromPortrait(base64: string, mediaType: string): File | undefined {
  let extension: "png" | "jpg" | "webp";
  switch (mediaType) {
    case "image/png":
      extension = "png";
      break;
    case "image/jpeg":
      extension = "jpg";
      break;
    case "image/webp":
      extension = "webp";
      break;
    default:
      return undefined;
  }
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], `showcase.${extension}`, { type: mediaType });
  } catch {
    return undefined;
  }
}

export function StudioBoard() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const draftsRef = useRef(drafts);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  useEffect(() => {
    return () => {
      for (const draft of draftsRef.current) {
        URL.revokeObjectURL(draft.previewUrl);
        if (draft.showcaseUrl) {
          URL.revokeObjectURL(draft.showcaseUrl);
        }
      }
    };
  }, []);

  function addFiles(list: FileList | File[]) {
    const images = Array.from(list).filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) {
      setNotice("Drop JPEG, PNG, WebP, or GIF photos.");
      return;
    }
    setNotice(null);
    setDrafts((current) => {
      const next = [
        ...images.map((file) => ({
          localId: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          frame: "earrings" as const,
          showcaseStatus: "idle" as const,
          status: "idle" as const,
          fields: { ...emptyCopy },
        })),
        ...current,
      ];
      draftsRef.current = next;
      return next;
    });
  }

  function updateField(localId: string, key: keyof CopyFields, value: string) {
    setDrafts((current) => {
      const next = current.map((draft) =>
        draft.localId === localId
          ? { ...draft, fields: { ...draft.fields, [key]: value } }
          : draft,
      );
      draftsRef.current = next;
      return next;
    });
  }

  function patchDraft(localId: string, patch: Partial<Draft>) {
    setDrafts((current) => {
      const next = current.map((draft) =>
        draft.localId === localId ? { ...draft, ...patch } : draft,
      );
      draftsRef.current = next;
      return next;
    });
  }

  async function generateDraft(localId: string) {
    const draft = draftsRef.current.find((item) => item.localId === localId);
    if (!draft || draft.status === "generating" || draft.status === "published") {
      return;
    }
    patchDraft(localId, { status: "generating", error: undefined });
    const body = new FormData();
    body.set("image", draft.file);
    const response = await fetch("/api/generate", { method: "POST", body });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      patchDraft(localId, {
        status: "error",
        error: errorFromBody(payload, "Could not write this piece."),
      });
      return;
    }
    const copy = copySchema.safeParse(payload);
    if (!copy.success) {
      patchDraft(localId, {
        status: "error",
        error: "The model returned copy that did not fit the piece.",
      });
      return;
    }
    patchDraft(localId, {
      status: "ready",
      fields: copy.data,
      frame:
        draft.showcaseStatus === "ready"
          ? draft.frame
          : frameForCategory(copy.data.category),
      error: undefined,
    });
  }

  async function showcaseDraft(localId: string) {
    const draft = draftsRef.current.find((item) => item.localId === localId);
    if (
      !draft ||
      draft.showcaseStatus === "working" ||
      draft.status === "published"
    ) {
      return;
    }
    patchDraft(localId, { showcaseStatus: "working", error: undefined });
    const body = new FormData();
    body.set("image", draft.file);
    body.set("frame", draft.frame);
    const response = await fetch("/api/showcase", { method: "POST", body });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      patchDraft(localId, {
        showcaseStatus: "error",
        error: errorFromBody(payload, "Could not place this piece on the model."),
      });
      return;
    }
    const mediaType =
      payload &&
      typeof payload === "object" &&
      "mediaType" in payload &&
      typeof payload.mediaType === "string"
        ? payload.mediaType
        : "";
    const image =
      payload &&
      typeof payload === "object" &&
      "image" in payload &&
      typeof payload.image === "string"
        ? payload.image
        : "";
    const portrait = fileFromPortrait(image, mediaType);
    if (!portrait) {
      patchDraft(localId, {
        showcaseStatus: "error",
        error: "The portrait came back in a format the studio cannot keep.",
      });
      return;
    }
    if (draft.showcaseUrl) {
      URL.revokeObjectURL(draft.showcaseUrl);
    }
    patchDraft(localId, {
      showcaseStatus: "ready",
      showcaseFile: portrait,
      showcaseUrl: URL.createObjectURL(portrait),
      error: undefined,
    });
  }

  async function showcaseAll() {
    const pending = draftsRef.current.filter(
      (draft) =>
        draft.status !== "published" && draft.showcaseStatus !== "working",
    );
    for (const draft of pending) {
      await showcaseDraft(draft.localId);
    }
  }

  async function generateAll() {
    const pending = draftsRef.current.filter(
      (draft) => draft.status !== "published" && draft.status !== "generating",
    );
    for (const draft of pending) {
      await generateDraft(draft.localId);
    }
  }

  async function publishDraft(localId: string) {
    const draft = draftsRef.current.find((item) => item.localId === localId);
    if (!draft || draft.status === "publishing" || draft.status === "published") {
      return;
    }
    const copy = copySchema.safeParse(draft.fields);
    if (!copy.success) {
      patchDraft(localId, {
        status: "error",
        error: "Fill in every field before publishing.",
      });
      return;
    }
    patchDraft(localId, { status: "publishing", error: undefined });
    const body = new FormData();
    body.set("image", draft.showcaseFile ?? draft.file);
    for (const [key] of fields) {
      body.set(key, copy.data[key]);
    }
    const response = await fetch("/api/pieces", { method: "POST", body });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      patchDraft(localId, {
        status: "error",
        error: errorFromBody(payload, "Could not publish this piece."),
      });
      return;
    }
    const piece = payload as Piece;
    patchDraft(localId, { status: "published", piece, error: undefined });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Studio</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">
            Drop the pieces
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            Add several photos at once. Generate writes the ad. Showcase places
            the piece on the model in the frame you pick, then publish uses
            that portrait.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-muted hover:text-foreground"
        >
          Lock studio
        </button>
      </div>

      <div
        className="mt-8 rounded-[2rem] border border-dashed border-gold/50 bg-card px-6 py-12 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        <p className="font-display text-3xl">Photos of the work</p>
        <p className="mt-2 text-sm text-muted">
          Drag them here, or choose a folder&apos;s worth of images.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 rounded-full bg-ink px-5 py-3 text-sm text-card"
        >
          Choose images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </div>

      {notice ? <p className="mt-4 text-sm text-clay">{notice}</p> : null}

      {drafts.length > 0 ? (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void generateAll()}
            className="rounded-full border border-line px-5 py-3 text-sm"
          >
            Generate all
          </button>
          <button
            type="button"
            onClick={() => void showcaseAll()}
            className="rounded-full border border-line px-5 py-3 text-sm"
          >
            Showcase all
          </button>
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        {drafts.map((draft) => (
          <article
            key={draft.localId}
            className="grid gap-6 rounded-[2rem] border border-line bg-card p-4 md:grid-cols-[16rem_1fr]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] bg-background">
              {/* blob: previews are not valid next/image sources */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.showcaseUrl ?? draft.previewUrl}
                alt={
                  draft.showcaseUrl
                    ? draft.fields.altText || "Piece worn on the model"
                    : "Uploaded jewelry photo"
                }
                className="h-full w-full object-cover"
              />
              {draft.showcaseStatus === "working" ? (
                <p className="absolute inset-x-3 bottom-3 rounded-full bg-ink/80 px-3 py-2 text-center text-xs text-card">
                  Placing it on the model…
                </p>
              ) : null}
            </div>
            <div>
              <label className="mb-3 block text-sm">
                Frame
                <select
                  value={draft.frame}
                  disabled={draft.status === "published"}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (isFrameId(value)) {
                      patchDraft(draft.localId, { frame: value });
                    }
                  }}
                  className="mt-1 w-full rounded-2xl border border-line bg-background px-3 py-2"
                >
                  {frameIds.map((id) => (
                    <option key={id} value={id}>
                      {frames[id].label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(([key, label]) => {
                  const long = key === "story" || key === "socialCaption";
                  return (
                    <label
                      key={key}
                      className={`block text-sm ${long ? "sm:col-span-2" : ""}`}
                    >
                      {label}
                      {long ? (
                        <textarea
                          value={draft.fields[key]}
                          rows={3}
                          onChange={(event) =>
                            updateField(draft.localId, key, event.target.value)
                          }
                          className="mt-1 w-full rounded-2xl border border-line bg-background px-3 py-2"
                        />
                      ) : (
                        <input
                          value={draft.fields[key]}
                          onChange={(event) =>
                            updateField(draft.localId, key, event.target.value)
                          }
                          className="mt-1 w-full rounded-2xl border border-line bg-background px-3 py-2"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
              {draft.error ? (
                <p className="mt-3 text-sm text-clay">{draft.error}</p>
              ) : null}
              {draft.status === "published" && draft.piece ? (
                <p className="mt-3 text-sm">
                  On the gallery.{" "}
                  <Link
                    href={`/pieces/${draft.piece.id}`}
                    className="underline decoration-gold underline-offset-4"
                  >
                    Open {draft.piece.name}
                  </Link>
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    draft.status === "generating" || draft.status === "published"
                  }
                  onClick={() => void generateDraft(draft.localId)}
                  className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50"
                >
                  {draft.status === "generating" ? "Writing…" : "Generate"}
                </button>
                <button
                  type="button"
                  disabled={
                    draft.showcaseStatus === "working" ||
                    draft.status === "published"
                  }
                  onClick={() => void showcaseDraft(draft.localId)}
                  className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50"
                >
                  {draft.showcaseStatus === "working"
                    ? "Placing…"
                    : draft.showcaseStatus === "ready"
                      ? "Showcase again"
                      : "Showcase"}
                </button>
                <button
                  type="button"
                  disabled={
                    draft.status === "publishing" || draft.status === "published"
                  }
                  onClick={() => void publishDraft(draft.localId)}
                  className="rounded-full bg-ink px-4 py-2 text-sm text-card disabled:opacity-50"
                >
                  {draft.status === "publishing"
                    ? "Publishing…"
                    : draft.status === "published"
                      ? "Published"
                      : "Publish"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

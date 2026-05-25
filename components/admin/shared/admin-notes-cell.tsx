"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { truncateText } from "@/lib/utils";

export function AdminNotesCell({
  value,
  onSave,
  placeholder = "Admin notes…",
}: {
  value: string | null;
  onSave: (notes: string | null) => Promise<boolean>;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const ok = await onSave(text.trim() || null);
    setSaving(false);
    if (ok) {
      toast.success("Notes saved");
      setEditing(false);
    } else {
      toast.error("Failed to save notes");
    }
  }

  if (editing) {
    return (
      <div className="min-w-[160px] space-y-1" onClick={(e) => e.stopPropagation()}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="text-xs"
          placeholder={placeholder}
        />
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded bg-navy px-2 py-0.5 text-[10px] font-semibold text-white"
            onClick={save}
            disabled={saving}
          >
            {saving ? "…" : "Save"}
          </button>
          <button
            type="button"
            className="rounded px-2 py-0.5 text-[10px] text-muted-foreground"
            onClick={() => {
              setText(value ?? "");
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="max-w-[200px] text-left text-xs text-muted-foreground hover:text-foreground"
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title={value ?? "Add admin notes"}
    >
      {value ? (
        <span className="line-clamp-2">{truncateText(value, 80)}</span>
      ) : (
        <span className="italic opacity-60">+ Add notes</span>
      )}
    </button>
  );
}

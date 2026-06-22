"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";

interface UploadedFile {
  id: string;
  url: string;
  name: string;
  size: number;
}

export function FileUpload({ ticketId, onUpload }: { ticketId: string; onUpload?: (file: UploadedFile) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ticketId", ticketId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur d'upload");
        return;
      }

      const uploaded = data.file as UploadedFile;
      setFiles((prev) => [...prev, uploaded]);
      onUpload?.(uploaded);
    } catch {
      setError("Erreur d'upload");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          onChange={handleUpload}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.zip"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          {isUploading ? "Upload..." : "Joindre un fichier"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

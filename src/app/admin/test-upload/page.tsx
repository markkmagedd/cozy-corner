// src/app/admin/test-upload/page.tsx

"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "test");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">R2 Upload Test</h1>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && <p className="text-blue-500">⏳ Uploading...</p>}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          ❌ Error: {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-green-100 text-green-700 rounded">
            ✅ Upload successful!
          </div>

          <div className="p-4 bg-gray-100 rounded text-sm space-y-2">
            <p><strong>URL:</strong> {result.url}</p>
            <p><strong>Key:</strong> {result.key}</p>
          </div>

          {/* Display the uploaded image */}
          <img
            src={result.url}
            alt="Uploaded test"
            className="max-w-full rounded border"
          />
        </div>
      )}
    </div>
  );
}
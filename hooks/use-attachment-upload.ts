"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Manages UI state for an attachment upload flow and exposes helpers to interact with it.
 *
 * @returns An object containing:
 * - `isOpen` — whether the upload UI is open
 * - `setIsOpen` — setter to open or close the upload UI
 * - `onUploaded` — callback that accepts an uploaded file URL and updates staged state, stops uploading, and closes the UI
 * - `stagedUrl` — the currently staged attachment URL, or `null` if none
 * - `isUploading` — whether an upload is in progress
 * - `clear` — resets the staged URL and uploading state
 */
export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState(false);

  const [stagedUrl, setStagedUrl] = useState<null | string>(null);

  const [isUploading, setIsUploading] = useState(false);

  const onUploaded = useCallback((url: string) => {
    setStagedUrl(url);
    setIsUploading(false);
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setStagedUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      onUploaded,
      stagedUrl,
      isUploading,
      clear,
    }),
    [isOpen, setIsOpen, onUploaded, stagedUrl, isUploading, clear],
  );
}

export type UseAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
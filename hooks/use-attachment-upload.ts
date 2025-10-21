"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Manages state for a simple attachment upload UI.
 *
 * Exposes whether the upload UI is open, the currently staged attachment URL,
 * and whether an upload is in progress, along with handlers to update those values.
 *
 * @returns An object containing:
 * - `isOpen`: whether the upload UI is open
 * - `setOpen`: setter to open or close the UI
 * - `onUploaded`: handler accepting a `url` that stores the staged URL, marks uploading as finished, and closes the UI
 * - `stagedUrl`: the currently staged attachment URL, or `null` if none
 * - `isUploading`: whether an upload operation is in progress
 * - `clear`: resets the staged URL and clears uploading state
 */
export function useAttachmentUpload() {
  const [isOpen, setOpen] = useState(false);

  const [stagedUrl, setStagedUrl] = useState<null | string>(null);

  const [isUploading, setIsUploading] = useState(false);

  const onUploaded = useCallback((url: string) => {
    setStagedUrl(url);
    setIsUploading(false);
    setOpen(false);
  }, []);

  const clear = useCallback(() => {
    setStagedUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setOpen,
      onUploaded,
      stagedUrl,
      isUploading,
      clear
    }),
    [isOpen, setOpen, onUploaded, stagedUrl, isUploading, clear]
  );
}

export type UseAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
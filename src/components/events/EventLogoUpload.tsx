'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, RefreshCw, Loader2 } from 'lucide-react';

interface EventLogoUploadProps {
  eventId: string;
  currentLogoUrl: string | null;
  onLogoChange: (logoUrl: string | null) => void;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024;

export default function EventLogoUpload({ eventId, currentLogoUrl, onLogoChange }: EventLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Use PNG, JPG, GIF, or SVG.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum 5MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/events/${eventId}/logo`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Upload failed');
        return;
      }

      onLogoChange(result.data.logoUrl);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [eventId, onLogoChange]);

  const handleRemove = useCallback(async () => {
    if (!confirm('Remove this logo?')) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}/logo`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Failed to remove logo');
        return;
      }

      onLogoChange(null);
    } catch {
      setError('Failed to remove logo');
    } finally {
      setIsUploading(false);
    }
  }, [eventId, onLogoChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="relative flex-shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentLogoUrl ? (
        <div className="group relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-white">
          <Image
            src={currentLogoUrl}
            alt="Event logo"
            fill
            className="object-contain p-2"
            unoptimized
          />

          {!isUploading && (
            <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-md bg-white/90 hover:bg-white transition-colors"
                title="Replace"
              >
                <RefreshCw size={12} className="text-ink" />
              </button>
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-md bg-white/90 hover:bg-white transition-colors"
                title="Remove"
              >
                <X size={12} className="text-red-600" />
              </button>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-accent" />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={isUploading}
          className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50 hover:bg-surface-muted'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 size={16} className="animate-spin text-ink-tertiary" />
          ) : (
            <>
              <Upload size={14} className="text-ink-tertiary" />
              <span className="text-[9px] font-medium text-ink-tertiary uppercase tracking-wide">Logo</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="absolute -bottom-5 left-0 text-[10px] text-red-600 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}

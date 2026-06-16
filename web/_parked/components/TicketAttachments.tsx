"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import NextImage from "next/image";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// ============================================================
// CALLFOLIO v5.4 - Ticket Attachments Gallery Component
// ============================================================
// Displays uploaded photos for a ticket with lightbox functionality.
// ============================================================

interface Attachment {
  id: string;
  file_url: string;
  storage_path: string;
  created_at: string;
}

interface TicketAttachmentsProps {
  ticketId: string;
  className?: string;
}

// Lightbox Modal Component
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: Attachment[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = images[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* Navigation - Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Main Image */}
      <div
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <NextImage
          src={current.file_url}
          alt={`Anhang ${currentIndex + 1}`}
          width={1200}
          height={900}
          unoptimized
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
        />
        <p className="text-center text-white/60 text-sm mt-4">
          {currentIndex + 1} / {images.length} •{" "}
          {new Date(current.created_at).toLocaleString("de-DE")}
        </p>
      </div>

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
}

export default function TicketAttachments({
  ticketId,
  className = "",
}: TicketAttachmentsProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadAttachments = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn("[Storage] No session for attachments fetch");
        return;
      }

      // Fetch attachments via API to use service role
      const response = await fetch(`/api/admin/tickets/${ticketId}/attachments`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setAttachments(data.attachments || []);
    } catch (err) {
      console.error("[Storage] Failed to load attachments:", err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadAttachments();
  }, [ticketId, loadAttachments]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? attachments.length - 1 : lightboxIndex - 1
    );
  };

  const goToNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === attachments.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  // Don't render anything if no attachments
  if (!loading && attachments.length === 0) {
    return null;
  }

  return (
    <>
      <section className={`${className}`}>
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-6 h-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
            <ImageIcon size={12} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h4 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
            Fotos ({attachments.length})
          </h4>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {attachments.map((attachment, index) => (
              <button
                key={attachment.id}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                <NextImage
                  src={attachment.file_url}
                  alt={`Anhang ${index + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 33vw, 150px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={attachments}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}

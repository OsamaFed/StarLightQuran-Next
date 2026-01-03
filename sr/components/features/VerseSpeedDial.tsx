"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

interface VerseSpeedDialProps {
  verseId: string;
  verseText: string;
  verseNumber: number;
  surahName: string;
}

export default function VerseSpeedDial({
  verseId,
  verseText,
  verseNumber,
  surahName,
}: VerseSpeedDialProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [verseId]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust delay as needed
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // long-press handlers: attach to verse element
  useEffect(() => {
    const id = verseId;
    const el = document.getElementById(id);
    if (!el) return;

    const start = (clientX: number, clientY: number) => {
      if (isScrolling) return; // Don't start if scrolling
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      setIsPressed(true);
      // 350ms long-press
      longPressTimer.current = window.setTimeout(() => {
        const rect = el.getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom });
        setMenuVisible(true);
      }, 350);
    };

    const cancel = () => {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      setIsPressed(false);
    };

    const onMouseDown = (e: MouseEvent) => start(e.clientX, e.clientY);
    const onMouseUp = () => cancel();
    const onMouseLeave = () => cancel();
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches && e.touches[0];
      if (t) start(t.clientX, t.clientY);
    };
    const onTouchEnd = () => cancel();
    const onTouchCancel = () => cancel();
    const onTouchMove = () => cancel();

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchCancel);
    el.addEventListener("touchmove", onTouchMove);

    return () => {
      cancel();
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [verseId]);

  // Apply hover style to verse element when pressed
  useEffect(() => {
    const id = verseId;
    const el = document.getElementById(id);
    if (!el) return;
    
    if (isPressed && !isScrolling) {
      el.style.opacity = "0.8";
      el.style.transform = "scale(0.98)";
      el.style.boxShadow = "0 0 0 3px rgba(100, 100, 255, 0.4) inset";
      el.style.borderRadius = "8px";
      el.style.transition = "all 0.15s ease";
    } else {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
      el.style.boxShadow = "none";
      el.style.borderRadius = "0";
    }
    
    return () => {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
      el.style.boxShadow = "none";
      el.style.borderRadius = "0";
    };
  }, [isPressed, verseId, isScrolling]);

  // click outside to hide menu
  useEffect(() => {
    const handler = (e: Event) => {
      if (!menuVisible) return;
      const target = e.target as Node | null;
      if (menuRef.current && target && menuRef.current.contains(target)) return;
      // Also don't close if clicking on the verse itself
      const verseEl = document.getElementById(verseId);
      if (verseEl && target && verseEl.contains(target)) return;
      setMenuVisible(false);
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuVisible]);

  const handleCopy = () => {
    try {
      const text = `${verseText}\n\n${surahName}:${verseNumber}`;
      navigator.clipboard?.writeText(text).catch(() => {});
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleShare = async () => {
    try {
      const verseElement = document.getElementById(verseId);
      if (verseElement && typeof navigator !== "undefined" && "share" in navigator) {
        try {
          const html2canvas = (await import("html2canvas")).default;
          const canvas = await html2canvas(verseElement, { backgroundColor: null, scale: 2 });
          const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b)));
          if (blob) {
            const file = new File([blob], `${surahName}_${verseNumber}.png`, { type: blob.type });
            if ((navigator as any).canShare && navigator.canShare({ files: [file] })) {
              await (navigator as any).share({ title: `${surahName}:${verseNumber}`, text: verseText, files: [file] });
              return;
            }
          }
        } catch (innerErr) {
          console.warn("dom-to-image-more failed, falling back to text share:", innerErr);
        }
      }
      if (navigator.share) {
        await navigator.share({ title: `${surahName}:${verseNumber}`, text: verseText });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleSavePhoto = () => {
    (async () => {
      try {
        const html2canvas = (await import("html2canvas")).default;
        const verseElement = document.getElementById(verseId);
        if (!verseElement) return;

        // revoke previous object URL if any
        if (lastObjectUrlRef.current) {
          try {
            URL.revokeObjectURL(lastObjectUrlRef.current);
          } catch {}
          lastObjectUrlRef.current = null;
        }

        const canvas = await html2canvas(verseElement, { backgroundColor: null, scale: 2 });
        const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b)));
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        lastObjectUrlRef.current = url;

        try {
          const link = document.createElement("a");
          link.href = url;
          link.download = `${surahName}_${verseNumber}.png`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (err) {
          console.error("Download failed:", err);
        }

        // revoke after a short delay to ensure download started
        setTimeout(() => {
          if (lastObjectUrlRef.current) {
            try {
              URL.revokeObjectURL(lastObjectUrlRef.current);
            } catch {}
            lastObjectUrlRef.current = null;
          }
        }, 1500);
      } catch (err) {
        console.error("Error saving photo:", err);
      }
    })();
  };

  return (
    <>
      {menuVisible && menuPos && (
        <div
          ref={menuRef}
          role="dialog"
          aria-label="verse actions"
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 2000,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            background: "rgba(0,0,0,0.72)",
            padding: 8,
            borderRadius: 12,
            alignItems: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Tooltip title="نسخ">
            <IconButton
              size="small"
              onClick={() => {
                handleCopy();
                setMenuVisible(false);
              }}
              sx={{ color: "white" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="مشاركة">
            <IconButton
              size="small"
              onClick={async () => {
                await handleShare();
                setMenuVisible(false);
              }}
              sx={{ color: "white" }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="حفظ صورة">
            <IconButton
              size="small"
              onClick={() => {
                handleSavePhoto();
                setMenuVisible(false);
              }}
              sx={{ color: "white" }}
            >
              <SaveAltIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
}

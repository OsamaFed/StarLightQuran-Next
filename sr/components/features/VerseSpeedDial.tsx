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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    };
  }, [verseId]);

  // long-press handlers: attach to verse element
  useEffect(() => {
    const id = `verse-${verseId}`;
    const el = document.getElementById(id);
    if (!el) return;

    const start = (clientX: number, clientY: number) => {
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      setIsPressed(true);
      // 350ms long-press
      longPressTimer.current = window.setTimeout(() => {
        setMenuPos({ x: clientX, y: clientY });
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

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      cancel();
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [verseId]);

  // Apply hover style to verse element when pressed
  useEffect(() => {
    const id = `verse-${verseId}`;
    const el = document.getElementById(id);
    if (!el) return;
    
    if (isPressed) {
      el.style.opacity = "0.7";
      el.style.boxShadow = "0 0 0 2px rgba(100, 100, 255, 0.3) inset";
      el.style.borderRadius = "4px";
      el.style.transition = "opacity 0.2s, box-shadow 0.2s";
    } else {
      el.style.opacity = "1";
      el.style.boxShadow = "none";
      el.style.borderRadius = "0";
    }
    
    return () => {
      el.style.opacity = "1";
      el.style.boxShadow = "none";
      el.style.borderRadius = "0";
    };
  }, [isPressed, verseId]);

  // click outside to hide menu
  useEffect(() => {
    const handler = (e: Event) => {
      if (!menuVisible) return;
      const target = e.target as Node | null;
      if (menuRef.current && target && menuRef.current.contains(target)) return;
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
      const verseElement = document.getElementById(`verse-${verseId}`);
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
        const verseElement = document.getElementById(`verse-${verseId}`);
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
            top: Math.min(menuPos.y + 8, window.innerHeight - 64),
            left: Math.min(menuPos.x + 8, window.innerWidth - 160),
            zIndex: 2000,
            display: "flex",
            gap: 8,
            background: "rgba(0,0,0,0.72)",
            padding: 6,
            borderRadius: 10,
            alignItems: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
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

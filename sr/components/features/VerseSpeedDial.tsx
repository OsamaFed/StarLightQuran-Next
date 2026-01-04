"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveIcon from "@mui/icons-material/Save";

interface VerseSpeedDialProps {
  verseId: string;
  verseText: string;
  verseNumber: number;
  surahName: string;
}

async function captureElementAsBlob(el: HTMLElement): Promise<Blob | null> {
  const html2canvas = (await import("html2canvas")).default;
  const clone = el.cloneNode(true) as HTMLElement;
  clone.setAttribute("dir", "rtl");
  clone.style.direction = "rtl";
  const rect = el.getBoundingClientRect();
  clone.style.width = `${rect.width}px`;
  clone.style.boxSizing = "border-box";
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.zIndex = "2147483647";
  container.appendChild(clone);
  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(clone, { backgroundColor: null, scale: 2, useCORS: true });
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b)));
    return blob;
  } finally {
    container.remove();
  }
}

export default function VerseSpeedDial({ verseId, verseText, verseNumber, surahName }: VerseSpeedDialProps) {
  const lastObjectUrlRef = useRef<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(lastObjectUrlRef.current);
        } catch {}
        lastObjectUrlRef.current = null;
      }
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [verseId]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150) as unknown as number;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const id = verseId;
    const el = document.getElementById(id);
    if (!el) return;

    const start = () => {
      if (isScrolling) return;
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      setIsPressed(true);
      longPressTimer.current = window.setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const left = Math.max(8, rect.left);
        const top = Math.max(8, rect.top - 72); // place above verse to avoid overlapping tafseer
        setMenuPos({ left, top });
        setMenuVisible(true);
      }, 350) as unknown as number;
    };

    const cancel = () => {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      setIsPressed(false);
    };

    const onMouseDown = (e: MouseEvent) => start();
    const onMouseUp = () => cancel();
    const onMouseLeave = () => cancel();
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches && e.touches[0];
      if (t) start();
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
  }, [verseId, isScrolling]);

  useEffect(() => {
    const el = document.getElementById(verseId);
    if (!el) return;
    if (isPressed && !isScrolling) {
      el.style.opacity = "0.9";
      el.style.transform = "scale(0.99)";
      el.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.06) inset";
      el.style.borderRadius = "8px";
      el.style.transition = "all 0.12s ease";
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
  }, [isPressed, isScrolling, verseId]);

  useEffect(() => {
    const handler = (e: Event) => {
      if (!menuVisible) return;
      const target = e.target as Node | null;
      if (menuRef.current && target && menuRef.current.contains(target)) return;
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
  }, [menuVisible, verseId]);

  const handleCopy = () => {
    try {
      const text = `${verseText}\n\n${surahName}:${verseNumber}`;
      navigator.clipboard?.writeText(text).catch(() => {});
    } catch (err) {
      console.error("Copy failed:", err);
    }
    setMenuVisible(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    try {
      setIsLoading(true);
      const verseElement = document.getElementById(verseId) as HTMLElement | null;
      if (verseElement && typeof navigator !== "undefined" && "share" in navigator) {
        try {
          const blob = await captureElementAsBlob(verseElement);
          if (blob) {
            const file = new File([blob], `${surahName}_${verseNumber}.png`, { type: blob.type });
            if ((navigator as any).canShare && navigator.canShare({ files: [file] })) {
              await (navigator as any).share({ title: `${surahName}:${verseNumber}`, text: verseText, files: [file] });
              setMenuVisible(false);
              setIsLoading(false);
              return;
            }
          }
        } catch (innerErr) {
          console.warn("share capture failed, falling back to text:", innerErr);
        }
      }
      if ((navigator as any).share) {
        await (navigator as any).share({ title: `${surahName}:${verseNumber}`, text: verseText });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
    setIsLoading(false);
    setMenuVisible(false);
  };

  const handleSavePhoto = async () => {
    try {
      setIsLoading(true);
      const verseElement = document.getElementById(verseId) as HTMLElement | null;
      if (!verseElement) return;
      if (lastObjectUrlRef.current) {
        try {
          URL.revokeObjectURL(lastObjectUrlRef.current);
        } catch {}
        lastObjectUrlRef.current = null;
      }
      const blob = await captureElementAsBlob(verseElement);
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
    setIsLoading(false);
    setMenuVisible(false);
  };

  return (
    <>
      {menuVisible && (
        <div
          ref={menuRef}
          role="dialog"
          aria-label="verse actions"
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 2000,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            padding: 8,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Tooltip title="نسخ">
            <IconButton size="small" onClick={handleCopy} sx={{ color: "white" }}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="مشاركة">
            <IconButton size="small" onClick={handleShare} sx={{ color: "white" }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="حفظ صورة">
            <span>
              <IconButton size="small" onClick={handleSavePhoto} sx={{ color: "white" }} disabled={isLoading}>
                {isLoading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </>
  );
}

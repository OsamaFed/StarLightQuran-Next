"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";

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
    const canvas = await html2canvas(clone, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b))
    );
    return blob;
  } finally {
    container.remove();
  }
}

export default function VerseSpeedDial({
  verseId,
  verseText,
  verseNumber,
  surahName,
}: VerseSpeedDialProps) {
  const lastObjectUrlRef = useRef<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150) as unknown as number;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById(verseId);
    if (!el) return;

    const start = () => {
      if (isScrolling) return;
      if (longPressTimer.current)
        window.clearTimeout(longPressTimer.current);
      setIsPressed(true);
      longPressTimer.current = window.setTimeout(() => {
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

    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", cancel);
    el.addEventListener("mouseleave", cancel);
    el.addEventListener("touchstart", start);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
    el.addEventListener("touchmove", cancel);

    return () => {
      cancel();
      el.removeEventListener("mousedown", start);
      el.removeEventListener("mouseup", cancel);
      el.removeEventListener("mouseleave", cancel);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", cancel);
      el.removeEventListener("touchcancel", cancel);
      el.removeEventListener("touchmove", cancel);
    };
  }, [verseId, isScrolling]);

  const handleCopy = () => {
    const text = `${verseText}\n\n${surahName}:${verseNumber}`;
    navigator.clipboard?.writeText(text).then(() => {
      setIsCopying(true);
      setTimeout(() => {
        setIsCopying(false);
        setMenuVisible(false);
      }, 1000);
    });
  };

  const handleShare = async () => {
    try {
      const verseElement = document.getElementById(verseId);
      if (verseElement && "share" in navigator) {
        await (navigator as any).share({
          title: `${surahName}:${verseNumber}`,
          text: verseText,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setMenuVisible(false);
  };

  const handleSavePhoto = async () => {
    try {
      setIsDownloading(true);
      const verseElement = document.getElementById(verseId);
      if (!verseElement) return;

      const blob = await captureElementAsBlob(verseElement);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      lastObjectUrlRef.current = url;

      const link = document.createElement("a");
      link.href = url;
      link.download = `${surahName}_${verseNumber}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
      setMenuVisible(false);
    }
  };

  return (
    <>
      {menuVisible && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 2000,
            display: "flex",
            gap: 8,
            padding: 8,
            borderRadius: 12,
          }}
        >
          <Tooltip title="نسخ">
            <IconButton onClick={handleCopy} sx={{ color: "white" }}>
              {isCopying ? (
                <CheckIcon sx={{ color: "#4caf50" }} />
              ) : (
                <ContentCopyIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="مشاركة">
            <IconButton onClick={handleShare} sx={{ color: "white" }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="حفظ صورة">
            <IconButton onClick={handleSavePhoto} sx={{ color: "white" }}>
              {isDownloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveAltIcon />
              )}
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
}
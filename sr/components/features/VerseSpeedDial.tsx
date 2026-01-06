"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";
import gsap from "gsap";

interface VerseSpeedDialProps {
  verseId: string;
  verseText: string;
  verseNumber: number;
  surahName: string;
}

// Global state to track the active menu to ensure only one is visible at a time
let activeMenuSetter: ((visible: boolean) => void) | null = null;

async function captureElementAsBlob(
  verseText: string,
  surahName: string,
  verseNumber: number
): Promise<Blob | null> {
  const html2canvas = (await import("html2canvas")).default;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#fdf8f3"; // Cream background like in the image
  container.style.padding = "60px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.fontFamily = "'Amiri', serif";
  container.style.direction = "rtl";
  container.style.boxSizing = "border-box";

  // Surah name top left
  const header = document.createElement("div");
  header.style.width = "100%";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.marginBottom = "40px";
  header.style.fontSize = "24px";
  header.style.color = "#333";

  const surahLabel = document.createElement("div");
  surahLabel.innerText = `سُورَةُ ${surahName}`;
  header.appendChild(surahLabel);

  // Empty placeholder for top right as requested to ignore it
  const placeholder = document.createElement("div");
  header.appendChild(placeholder);

  container.appendChild(header);

  // Verse text in the middle
  const content = document.createElement("div");
  content.style.fontSize = "36px";
  content.style.lineHeight = "1.8";
  content.style.textAlign = "center";
  content.style.color = "#000";
  content.style.marginBottom = "20px";
  content.innerText = verseText;
  container.appendChild(content);

  // Verse number
  const footer = document.createElement("div");
  footer.style.fontSize = "20px";
  footer.style.color = "#666";
  footer.innerText = `(${verseNumber})`;
  container.appendChild(footer);

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: "#fdf8f3",
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
      
      longPressTimer.current = window.setTimeout(() => {
        // If there's an active menu from another verse, hide it
        if (activeMenuSetter && activeMenuSetter !== setMenuVisible) {
          activeMenuSetter(false);
        }
        activeMenuSetter = setMenuVisible;
        setMenuVisible(true);
      }, 350) as unknown as number;
    };

    const cancel = () => {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
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

  useEffect(() => {
    if (menuVisible && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [menuVisible]);

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
      if ("share" in navigator) {
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
      const blob = await captureElementAsBlob(verseText, surahName, verseNumber);
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
            background: "rgba(0,0,0,0.72)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
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

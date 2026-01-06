"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface VerseSpeedDialProps {
  verseId: string;
  verseText: string;
  verseNumber: number;
  surahName: string;
}

async function captureElementAsBlob(el: HTMLElement): Promise<Blob | null> {
  const html2canvas = (await import("html2canvas")).default;
  
  // Create a clean container for capturing
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "600px"; // Standard width for sharing
  container.style.padding = "40px";
  container.style.background = getComputedStyle(document.body).getPropertyValue('--bg-primary') || '#ffffff';
  container.dir = "rtl";

  const clone = el.cloneNode(true) as HTMLElement;
  
  // REMOVE the menu from the clone before capturing
  const menuInClone = clone.querySelector('[data-verse-menu="true"]');
  if (menuInClone) menuInClone.remove();
  
  // Style the clone for the image
  clone.style.width = "100%";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.transform = "none";

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: container.style.background,
      scale: 2,
      useCORS: true,
      logging: false,
    });
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
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
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById(verseId);
    if (!el) return;

    const start = (e: Event) => {
      if (isScrolling) return;
      setIsPressed(true);
      
      if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
      
      longPressTimer.current = window.setTimeout(() => {
        setMenuVisible(true);
        // Play a very light vibration if supported
        if ('vibrate' in navigator) navigator.vibrate(10);
      }, 500) as unknown as number;
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
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
    el.addEventListener("touchmove", () => {
      if (isPressed) cancel();
    }, { passive: true });

    return () => {
      el.removeEventListener("mousedown", start);
      el.removeEventListener("mouseup", cancel);
      el.removeEventListener("mouseleave", cancel);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", cancel);
      el.removeEventListener("touchcancel", cancel);
    };
  }, [verseId, isScrolling, isPressed]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuVisible) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuVisible]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${verseText}\n\n${surahName}:${verseNumber}`;
    navigator.clipboard?.writeText(text).then(() => {
      setIsCopying(true);
      setTimeout(() => {
        setIsCopying(false);
        setMenuVisible(false);
      }, 1000);
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if ("share" in navigator) {
        await (navigator as any).share({
          title: `${surahName}:${verseNumber}`,
          text: `${verseText}\n\n${surahName}:${verseNumber}`,
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error(err);
    }
    setMenuVisible(false);
  };

  const handleSavePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const verseElement = document.getElementById(verseId);
      if (!verseElement) return;

      const blob = await captureElementAsBlob(verseElement);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${surahName}_${verseNumber}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
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
        <Paper
          ref={menuRef}
          data-verse-menu="true"
          elevation={8}
          sx={{
            position: "fixed",
            bottom: { xs: 40, md: 60 },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            gap: 1.5,
            p: 1.5,
            borderRadius: 4,
            bgcolor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            animation: "fadeInUp 0.3s ease-out",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateX(-50%) translateY(20px)" },
              to: { opacity: 1, transform: "translateX(-50%) translateY(0)" }
            }
          }}
        >
          <Tooltip title="نسخ">
            <IconButton onClick={handleCopy} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.05)", '&:hover': { bgcolor: "rgba(255,255,255,0.15)" } }}>
              {isCopying ? <CheckIcon sx={{ color: "#4caf50" }} /> : <ContentCopyIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="مشاركة">
            <IconButton onClick={handleShare} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.05)", '&:hover': { bgcolor: "rgba(255,255,255,0.15)" } }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="حفظ صورة">
            <IconButton onClick={handleSavePhoto} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.05)", '&:hover': { bgcolor: "rgba(255,255,255,0.15)" } }}>
              {isDownloading ? <CircularProgress size={24} color="inherit" /> : <SaveAltIcon />}
            </IconButton>
          </Tooltip>
        </Paper>
      )}
      
      {/* Visual indicator for long press */}
      {isPressed && !menuVisible && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(212, 163, 115, 0.1)",
            borderRadius: "inherit",
            pointerEvents: "none",
            animation: "pulse 0.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.3 },
              "50%": { opacity: 0.6 },
              "100%": { opacity: 0.3 }
            }
          }}
        />
      )}
    </>
  );
}

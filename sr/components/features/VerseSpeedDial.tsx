"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import CheckIcon from "@mui/icons-material/Check";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import gsap from "gsap";
import { useTheme } from "@/hooks/useTheme";

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

  // ensure background matches current theme for exported image
  let exportBg: string | null = null;
  try {
    const theme = document.documentElement.getAttribute("data-theme") || (document.body.classList.contains("darkMode") ? "dark" : "light");
    const computedBg = getComputedStyle(document.documentElement).getPropertyValue("--background") || "";
    // use pure white for light mode exported images
    const bg = theme === "dark" ? (computedBg.trim() || "#0D1B2A") : "#ffffff";
    clone.style.backgroundColor = bg;
    exportBg = bg;
  } catch (e) {}

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.zIndex = "2147483647";
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(clone, {
      backgroundColor: exportBg || undefined,
      scale: 3,
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
  const { isDarkMode } = useTheme();
  const lastObjectUrlRef = useRef<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const originalBgRef = useRef<string | null>(null);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);

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

  // Apply a very simple press/hover feedback on the verse element itself
  useEffect(() => {
    const el = document.getElementById(verseId) as HTMLElement | null;
    if (!el) return;

    if (isPressed) {
      originalBgRef.current = el.style.backgroundColor || "";
      el.style.transition = "background-color 120ms ease";
      el.style.backgroundColor = isDarkMode
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.04)";
    } else {
      // restore previous background
      el.style.backgroundColor = originalBgRef.current || "";
    }

    return () => {
      if (el) el.style.backgroundColor = originalBgRef.current || "";
    };
  }, [isPressed, verseId, isDarkMode]);

  // Detect if a tafsir panel is present/open so the menu can stay above it
  useEffect(() => {
    const checkTafsir = () => {
      const candidate = document.querySelector(
        "#tafsir, .tafsir, [data-tafsir], [data-tafsir-open]"
      ) as HTMLElement | null;
      const open = !!candidate && candidate.offsetHeight > 0 && candidate.offsetParent !== null;
      setIsTafsirOpen(open);
    };

    checkTafsir();
    const mo = new MutationObserver(checkTafsir);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    window.addEventListener("resize", checkTafsir);
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", checkTafsir);
    };
  }, []);

  useEffect(() => {
    if (menuVisible && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [menuVisible]);

  const [isTafsirLoading, setIsTafsirLoading] = useState(false);

  useEffect(() => {
    const onLoaded = (ev: Event) => {
      try {
        const d = (ev as CustomEvent).detail;
        if (d && d.verseId === verseId) setIsTafsirLoading(false);
      } catch (e) {}
    };
    const onClosed = (ev: Event) => {
      try {
        const d = (ev as CustomEvent).detail;
        if (d && d.verseId === verseId) setIsTafsirLoading(false);
      } catch (e) {}
    };
    window.addEventListener("tafsirLoaded", onLoaded as EventListener);
    window.addEventListener("tafsirClosed", onClosed as EventListener);
    return () => {
      window.removeEventListener("tafsirLoaded", onLoaded as EventListener);
      window.removeEventListener("tafsirClosed", onClosed as EventListener);
    };
  }, [verseId]);

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

  const handleOpenTafsir = () => {
    // notify other parts of the app to open tafsir for this verse
    try {
      const ev = new CustomEvent("openTafsir", { detail: { verseId } });
      window.dispatchEvent(ev);
    } catch (e) {}
    setIsTafsirLoading(true);
    setMenuVisible(false);
  };

  // Inform other UI to hide inline tafsir buttons while the speed-dial is visible
  useEffect(() => {
    try {
      const ev = new CustomEvent(menuVisible ? "versespeeddial:hideInlineTafsir" : "versespeeddial:showInlineTafsir");
      window.dispatchEvent(ev);
    } catch (e) {}
  }, [menuVisible]);

  return (
    <>
      {menuVisible && (
        <div
          ref={menuRef}
          data-html2canvas-ignore="true"
          style={{
            position: "absolute",
            bottom: 6,
            left: 6,
            display: "flex",
            gap: 8,
            padding: 8,
            borderRadius: 12,
            zIndex: 50,
            alignItems: 'center',
            background: isDarkMode ? 'rgba(18,22,28,0.6)' : 'rgba(255,255,255,0.92)',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: isDarkMode ? '0 8px 30px rgba(0,0,0,0.45)' : '0 6px 20px rgba(24,24,24,0.06)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            pointerEvents: 'auto',
            minWidth: 140,
          }}
        >
          <Tooltip title="تفسير">
            <IconButton
              onClick={handleOpenTafsir}
              aria-label="تفسير"
              size="small"
              data-tafsir-button
              sx={{
                color: isDarkMode ? "white" : "var(--highlight-color)",
                bgcolor: "transparent",
                boxShadow: isDarkMode ? "0 4px 16px rgba(58,123,213,0.08)" : "var(--shadow-xs)",
                border: "1px solid transparent",
                backdropFilter: "blur(6px)",
                '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }
              }}
            >
              {isTafsirLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <MenuBookIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="نسخ">
            <IconButton
              onClick={handleCopy}
              sx={{
                color: isDarkMode ? "white" : "#0b0b0b",
                bgcolor: "transparent",
                '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }
              }}
            >
              {isCopying ? (
                <CheckIcon sx={{ color: "#4caf50" }} />
              ) : (
                <ContentCopyIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="مشاركة">
            <IconButton
              onClick={handleShare}
              sx={{
                color: isDarkMode ? "white" : "#0b0b0b",
                bgcolor: "transparent",
                '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }
              }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="حفظ صورة">
            <IconButton
              onClick={handleSavePhoto}
              sx={{
                color: isDarkMode ? "white" : "#0b0b0b",
                bgcolor: "transparent",
                '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }
              }}
            >
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
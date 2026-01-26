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
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import gsap from "gsap";
import { useTheme } from "@/hooks/useTheme";

interface VerseSpeedDialProps {
  verseId: string;
  verseText: string;
  verseNumber: number;
  surahName: string;
  surahId: number;
}

// Helper: Close menu and clear global state
const closeMenuAndClear = (verseId: string) => {
  if ((window as any).__currentVerseSpeedDialOpenId === verseId) {
    delete (window as any).__currentVerseSpeedDialOpenId;
  }
};

async function captureElementAsBlob(el: HTMLElement): Promise<Blob | null> {
  const html2canvas = (await import("html2canvas")).default;
  const clone = el.cloneNode(true) as HTMLElement;
  clone.setAttribute("dir", "rtl");
  clone.style.direction = "rtl";
  
  // Hide speed dial buttons in the clone
  const speedDialButtons = clone.querySelectorAll('[data-verse-speedial], [class*="SpeedDial"]');
  speedDialButtons.forEach((btn) => {
    (btn as HTMLElement).style.display = "none";
  });

  const rect = el.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.boxSizing = "border-box";
  clone.style.margin = "0";
  clone.style.padding = clone.style.padding || "20px";
  // Ensure text is readable with proper color
  clone.style.color = "inherit";

  let isDarkMode = false;
  let exportBg: string | null = null;
  let gradientBg: string = "";
  
  try {
    const theme = document.documentElement.getAttribute("data-theme") || (document.body.classList.contains("darkMode") ? "dark" : "light");
    isDarkMode = theme === "dark";
    const computedBg = getComputedStyle(document.documentElement).getPropertyValue("--background") || "";
    
    if (isDarkMode) {
      exportBg = computedBg.trim() || "#0D1B2A";
      gradientBg = "radial-gradient(circle at 20% 30%, rgba(74, 144, 226, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(147, 112, 219, 0.25) 0%, transparent 50%)";
    } else {
      // Improved light mode with better contrast and warm tones
      exportBg = "#FAF6F3";
      gradientBg = "radial-gradient(circle at 20% 30%, rgba(139, 143, 197, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(197, 163, 115, 0.12) 0%, transparent 50%), linear-gradient(135deg, rgba(255, 248, 240, 1) 0%, rgba(250, 245, 240, 1) 100%)";
    }
  } catch (e) {}

  // Create container with improved background
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.zIndex = "2147483647";
  container.style.backgroundColor = exportBg || "#FAF6F3";
  container.style.backgroundImage = gradientBg;
  container.style.backgroundAttachment = "fixed";
  container.style.overflow = "hidden";
  
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: exportBg || undefined,
      scale: 4,
      useCORS: true,
      logging: false,
      allowTaint: true,
      imageTimeout: 5000,
      windowHeight: height,
      windowWidth: width,
    });
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1)
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
  surahId,
}: VerseSpeedDialProps) {
  const { isDarkMode } = useTheme();
  const lastObjectUrlRef = useRef<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTafsirLoading, setIsTafsirLoading] = useState(false);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const startTouchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isLongPressTriggeredRef = useRef(false);

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
      closeMenuAndClear(verseId);
    };
  }, [verseId]);

  // معالج لمنع فتح عدة قائمات في نفس الوقت
  useEffect(() => {
    const handleOtherMenuOpened = (ev: Event) => {
      try {
        const d = (ev as CustomEvent).detail;
        if (d?.verseId !== verseId && menuVisible) {
          setMenuVisible(false);
          closeMenuAndClear(verseId);
        }
      } catch (e) {}
    };
    
    window.addEventListener('versespeeddial:opened', handleOtherMenuOpened as EventListener);
    return () => {
      window.removeEventListener('versespeeddial:opened', handleOtherMenuOpened as EventListener);
    };
  }, [verseId, menuVisible]);

  // Load favorite status on mount
  useEffect(() => {
    const updateFavoriteStatus = () => {
      try {
        const raw = localStorage.getItem("favoriteVerses");
        const favs = raw ? JSON.parse(raw) : [];
        setIsFavorited(favs.some((v: any) => v.id === verseId));
      } catch (e) {}
    };

    updateFavoriteStatus();
    
    const handler = (ev: Event) => {
      try {
        const favs = (ev as CustomEvent).detail?.favorites as any[] | undefined;
        if (Array.isArray(favs)) {
          setIsFavorited(favs.some((v) => v.id === verseId));
        }
      } catch (e) {}
    };

    window.addEventListener("favoriteVerseChanged", handler as EventListener);
    return () => window.removeEventListener("favoriteVerseChanged", handler as EventListener);
  }, [verseId]);


  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {}, 200) as unknown as number;
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

    const start = (e: Event) => {
      if (e instanceof TouchEvent && e.touches.length > 0) {
        const touch = e.touches[0];
        startTouchRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
      } else if (e instanceof MouseEvent) {
        startTouchRef.current = {
          x: e.clientX,
          y: e.clientY,
          time: Date.now(),
        };
      }
      
      if (longPressTimer.current)
        window.clearTimeout(longPressTimer.current);
      
      isLongPressTriggeredRef.current = false;
      setIsPressed(true);
      
      longPressTimer.current = window.setTimeout(() => {
        const elapsed = Date.now() - (startTouchRef.current?.time || 0);
        if (elapsed < 200) return;

        const current = (window as any).__currentVerseSpeedDialOpenId;
        if (current && current !== verseId) return;
        (window as any).__currentVerseSpeedDialOpenId = verseId;
        isLongPressTriggeredRef.current = true;
        setMenuVisible(true);
        try {
          window.dispatchEvent(new CustomEvent('versespeeddial:opened', { detail: { verseId } }));
        } catch (e) {}
      }, 350) as unknown as number;
    };

    const cancel = () => {
      if (longPressTimer.current) {
        window.clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      setIsPressed(false);
      startTouchRef.current = null;
    };

    const handleTouchMove = (e: Event) => {
      if (!startTouchRef.current || isLongPressTriggeredRef.current) return;
      
      if (e instanceof TouchEvent && e.touches.length > 0) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - startTouchRef.current.x);
        const deltaY = Math.abs(touch.clientY - startTouchRef.current.y);
        if (deltaX > 15 || deltaY > 15) {
          cancel();
        }
      }
    };

    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", cancel);
    el.addEventListener("mouseleave", cancel);
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", cancel, { passive: true });
    el.addEventListener("touchcancel", cancel, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      cancel();
      el.removeEventListener("mousedown", start);
      el.removeEventListener("mouseup", cancel);
      el.removeEventListener("mouseleave", cancel);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", cancel);
      el.removeEventListener("touchcancel", cancel);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [verseId]);

  // Apply press/hover feedback on the verse element
  useEffect(() => {
    const el = document.getElementById(verseId) as HTMLElement | null;
    if (!el) return;

    if (isPressed) {
      el.style.transition = "background-color 120ms ease";
      el.style.backgroundColor = isDarkMode
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.04)";
    } else {
      el.style.backgroundColor = "";
    }

    return () => {
      if (el) el.style.backgroundColor = "";
    };
  }, [isPressed, verseId, isDarkMode]);

  // Detect if a tafsir panel is present/open
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
    if (!menuVisible || !menuRef.current) return;
    
    gsap.fromTo(
      menuRef.current,
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );
  }, [menuVisible]);

  const handleCopy = () => {
    const text = `${verseText}\n\n${surahName}:${verseNumber}`;
    navigator.clipboard?.writeText(text).then(() => {
      setIsCopying(true);
      setTimeout(() => {
        setIsCopying(false);
        closeMenuAndClear(verseId);
        setMenuVisible(false);
      }, 1000);
    });
  };

  const handleAddToFavorites = () => {
    try {
      const raw = localStorage.getItem("favoriteVerses");
      let favs = raw ? JSON.parse(raw) : [];
      
      const exists = favs.find((v: any) => v.id === verseId);
      if (exists) {
        favs = favs.filter((v: any) => v.id !== verseId);
      } else {
        favs.push({
          id: verseId,
          verseNumber,
          surahName,
          text: verseText,
          surahId,
        });
      }
      
      localStorage.setItem("favoriteVerses", JSON.stringify(favs));
      setIsFavorited(!exists);
      window.dispatchEvent(new CustomEvent("favoriteVerseChanged", { detail: { favorites: favs } }));
      
      setTimeout(() => {
        closeMenuAndClear(verseId);
        setMenuVisible(false);
      }, 500);
    } catch (e) {
      console.error(e);
    }
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
      closeMenuAndClear(verseId);
      setMenuVisible(false);
    }
  };

  const handleOpenTafsir = () => {
    try {
      const ev = new CustomEvent("openTafsir", { detail: { verseId } });
      window.dispatchEvent(ev);
    } catch (e) {}
    setIsTafsirLoading(true);
    setMenuVisible(false);
  };

  // Inform UI to hide/show inline tafsir buttons
  useEffect(() => {
    try {
      const ev = new CustomEvent(menuVisible ? "versespeeddial:hideInlineTafsir" : "versespeeddial:showInlineTafsir");
      window.dispatchEvent(ev);
    } catch (e) {}
  }, [menuVisible]);

  // Close when clicking outside
  useEffect(() => {
    if (!menuVisible) return;
    
    const handler = (e: Event) => {
      if (isLongPressTriggeredRef.current && e.type === 'touchstart') {
        isLongPressTriggeredRef.current = false;
        return;
      }
      
      const target = e.target as Node | null;
      const menuEl = menuRef.current;
      const verseEl = document.getElementById(verseId);
      
      if ((menuEl?.contains(target || null)) || (verseEl?.contains(target || null))) return;
      
      closeMenuAndClear(verseId);
      setMenuVisible(false);
      try {
        window.dispatchEvent(new CustomEvent('versespeeddial:closed', { detail: { verseId } }));
      } catch (e) {}
    };
    
    const timeoutId = window.setTimeout(() => {
      document.addEventListener('mousedown', handler);
      document.addEventListener('touchstart', handler);
    }, 100);
    
    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuVisible, verseId]);

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

          <Tooltip title={isFavorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}>
            <IconButton
              onClick={handleAddToFavorites}
              sx={{
                color: isFavorited ? "#ffd700" : (isDarkMode ? "white" : "#0b0b0b"),
                bgcolor: "transparent",
                '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }
              }}
            >
              {isFavorited ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
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
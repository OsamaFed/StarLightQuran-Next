"use client";

import { useState, useEffect, useRef } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const speedDialRegistry = new Map<string, () => void>();

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

  useEffect(() => {
    const unregister = () => setOpen(false);
    speedDialRegistry.set(verseId, unregister);

    return () => {
      speedDialRegistry.delete(verseId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [verseId]);

  const handleOpen = () => {
    speedDialRegistry.forEach((closeOther, id) => {
      if (id !== verseId) closeOther();
    });

    setOpen(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 10000);
  };

  const handleClose = () => {
    setOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleAction = (callback: () => void) => {
    callback();
    handleClose();
  };

  const handleCopy = () => {
    const text = `${verseText}\n\n${surahName}:${verseNumber}`;
    navigator.clipboard.writeText(text);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surahName}:${verseNumber}`,
          text: verseText,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleSavePhoto = () => {
    import("html2canvas").then((html2canvas) => {
      const verseElement = document.getElementById(`verse-${verseId}`);
      if (verseElement) {
        html2canvas.default(verseElement, { backgroundColor: null, scale: 2 }).then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL();
          link.download = `${surahName}_${verseNumber}.png`;
          link.click();
        });
      }
    });
  };

  return (
    <SpeedDial
      ariaLabel="Verse actions"
      direction="right"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      icon={<span style={{ fontSize: "1.5rem" }}>💡</span>}
      sx={{
        position: "absolute",
        bottom: 14,
        left: 14,
        color: "inherit",
        direction: "ltr",
        "& .MuiFab-root": {
          backgroundColor: "transparent !important",
          boxShadow: "none",
          "&:hover": { backgroundColor: "transparent" },
        },
        "& .MuiSpeedDial-actions": {
          gap: "2px !important",
          display: "flex !important",
          flexDirection: "row !important",
          marginRight: "120px !important",
          paddingRight: "0 !important",
        },
        "& .MuiSpeedDialAction-fab": {
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
          "&:hover": { backgroundColor: "transparent !important" },
          margin: "0 2px !important",
          padding: "0 !important",
        },
        "& .MuiSpeedDialAction-staticTooltip": {
          right: "auto !important",
        },
        "& .MuiTouchRipple-root": { display: "none !important" },
        "& .MuiSvgIcon-root": { color: "inherit !important" },
      }}
    >
      <SpeedDialAction
        icon={<ContentCopyIcon />}
        tooltipTitle="نسخ"
        onClick={() => handleAction(handleCopy)}
      />
      <SpeedDialAction
        icon={<ShareIcon />}
        tooltipTitle="مشاركة"
        onClick={() => handleAction(handleShare)}
      />
      <SpeedDialAction
        icon={<SaveAltIcon />}
        tooltipTitle="حفظ صورة"
        onClick={() => handleAction(handleSavePhoto)}
      />
    </SpeedDial>
  );
}

"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { useEffect, useRef } from "react";

interface Props {
  visible: boolean;
  pos: { x: number; y: number } | null;
  onClose: () => void;
  onCopy: () => void;
  onShare: () => Promise<void> | void;
  onSave: () => void;
}

export default function SharingOptions({ visible, pos, onClose, onCopy, onShare, onSave }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: Event) => {
      const target = e.target as Node | null;
      if (ref.current && target && ref.current.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [visible, onClose]);

  if (!visible || !pos) return null;

  const top = Math.min(pos.y, window.innerHeight - 64);
  const left = Math.max(pos.x, 8);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="sharing options"
      style={{
        position: "fixed",
        top,
        left,
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
            onCopy();
            onClose();
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
            await onShare();
            onClose();
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
            onSave();
            onClose();
          }}
          sx={{ color: "white" }}
        >
          <SaveAltIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

"use client";

import { useRef, useState, useId } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";
import styles from "./AudioPlayer.module.css";

interface AudioPlayerProps {
  audioPath?: string;
  isDarkMode: boolean;
  size?: "small" | "large";
}

export default function AudioPlayer({
  audioPath,
  isDarkMode,
  size = "large",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const audioId = useId();
  const { currentAudioId, setCurrentAudioId, stopAllAudio, registerAudio } =
    useAudio();

  if (!audioPath) {
    return null;
  }

  // تسجيل المشغل الصوتي عند الإنشاء
  if (!audioId) {
    registerAudio(audioId, audioRef);
  }

  const togglePlay = () => {
    if (audioRef.current) {
      // إذا كان صوت آخر يشتغل، أوقفه
      if (currentAudioId && currentAudioId !== audioId) {
        stopAllAudio();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setShowProgress(true);
        // سجل معرف هذا الصوت كالحالي
        setCurrentAudioId(audioId);
        registerAudio(audioId, audioRef);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
      setCurrentTime(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isSmall = size === "small";

  return (
    <motion.div
      className={`${styles.audioPlayer} ${
        isDarkMode ? styles.darkMode : ""
      } ${isSmall ? styles.small : ""} ${isSmall && !showProgress ? styles.playButtonOnly : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <audio
        ref={audioRef}
        src={audioPath}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className={styles.controls}>
        <button
          className={styles.playButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "الإيقاف" : "التشغيل"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {showProgress && (
          <div className={styles.progressContainer}>
            <input
              type="range"
              min="0"
              max={!isNaN(duration) ? duration : 0}
              value={currentTime}
              onChange={handleProgressChange}
              className={styles.progressBar}
              aria-label="مؤشر التقدم"
            />
          </div>
        )}

        {!isSmall && (
          <span className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useMemo } from "react";
import styles from "./DecorativeElements.module.css";

const STARS = [
  { id: 0, size: 18, top: 8, left: 10 },
  { id: 1, size: 12, top: 15, left: 88 },
  { id: 2, size: 20, top: 28, left: 5 },
  { id: 3, size: 14, top: 45, left: 92 },
  { id: 4, size: 16, top: 60, left: 8 },
  { id: 5, size: 10, top: 75, left: 90 },
  { id: 6, size: 15, top: 85, left: 12 },
];

const LEAVES = [
  { id: 0, isRight: true, top: 50, rotate: -45 },
  { id: 1, isRight: false, top: 50, rotate: 45 },
  { id: 2, isRight: true, top: 200, rotate: -45 },
  { id: 3, isRight: false, top: 200, rotate: 45 },
  { id: 4, isRight: true, top: 350, rotate: -45 },
  { id: 5, isRight: false, top: 350, rotate: 45 },
  { id: 6, isRight: true, top: 500, rotate: -45 },
  { id: 7, isRight: false, top: 500, rotate: 45 },
];

const CLOUDS = [
  { id: 0, top: 12, width: 100, height: 35, delay: 0 },
  { id: 1, top: 30, width: 80, height: 28, delay: 15 },
];

export default function DecorativeElements() {
  const starElements = useMemo(() => 
    STARS.map((star) => (
      <div
        key={star.id}
        className={styles.star}
        style={{
          width: `${star.size}px`,
          height: `${star.size}px`,
          top: `${star.top}%`,
          left: `${star.left}%`,
          animationDelay: `${star.id * 0.3}s`,
        }}
      />
    )), []
  );

  const leafElements = useMemo(() =>
    LEAVES.map((leaf) => (
      <div
        key={leaf.id}
        className={styles.leaf}
        style={{
          right: leaf.isRight ? "15px" : "auto",
          left: leaf.isRight ? "auto" : "15px",
          top: `${leaf.top}px`,
          transform: `rotate(${leaf.rotate}deg)`,
          ["--leaf-rotate" as string]: `${leaf.rotate}deg`,
          animationDelay: `${leaf.id * 0.2}s`,
        }}
      />
    )), []
  );

  const cloudElements = useMemo(() =>
    CLOUDS.map((cloud) => (
      <div
        key={cloud.id}
        className={styles.cloud}
        style={{
          top: `${cloud.top}%`,
          right: "5%",
          width: `${cloud.width}px`,
          height: `${cloud.height}px`,
          animationDelay: `${cloud.delay}s`,
        }}
      />
    )), []
  );

  const purpleCircle = useMemo(() => (
    <div
      className={styles.saturnRing}
      style={{
        animationDelay: '0s',
      }}
    />
  ), []);

  return (
    <div className={styles.decorativeElements}>
      <div className={styles.planet}>
        <div className={`${styles.moonCrater} ${styles.crater1}`} />
        <div className={`${styles.moonCrater} ${styles.crater2}`} />
        <div className={`${styles.moonCrater} ${styles.crater3}`} />
      </div>
      {starElements}
      {leafElements}
      {cloudElements}
    </div>
  );
}

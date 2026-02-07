"use client";

import Link from "next/link";
import styles from "./OptionCard.module.css";

interface OptionCardProps {
  title: string;
  description: string;
  emoji?: string;
  href?: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}

export default function OptionCard({
  title,
  description,
  emoji,
  href,
  disabled = false,
  comingSoon = false,
  onClick,
}: OptionCardProps) {
  const cardClasses = `${styles.card} ${disabled ? styles.disabled : ""}`;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  const cardContent = (
    <>
      {comingSoon && <span className={styles.badge}>قريباً</span>}
      {emoji && <span className={styles.emoji} aria-hidden="true">{emoji}</span>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={cardClasses}
        role="link"
        aria-label={title}
        onClick={handleClick}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={cardClasses}
      role="button"
      aria-label={title}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {cardContent}
    </div>
  );
}

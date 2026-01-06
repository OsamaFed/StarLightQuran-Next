import { useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./OptionCard.module.css";
import gsap from "gsap";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const cardClasses = `${styles.card} ${disabled ? styles.disabled : ""}`;

  useEffect(() => {
    if (!disabled && cardRef.current) {
      const card = cardRef.current;
      
      const onMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "var(--shadow-sm)"
        });
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mouseleave", onMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [disabled]);

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
      {emoji && <span className={styles.emoji}>{emoji}</span>}
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
        onClick={handleClick}
        // Use a div wrapper to hold the ref since Link might be a functional component
      >
        <div ref={cardRef as any} style={{ height: '100%' }}>
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {cardContent}
    </div>
  );
}

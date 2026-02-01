"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import OptionCard from "@/components/layout/OptionCard";
import LightModeToggle from "@/components/ui/LightModeToggle";
import VerseOfTheDay from "@/components/features/VerseOfTheDay";
import styles from "./page.module.css";
import gsap from "gsap";

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const headerRef = useRef(null);
  const verseRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.from(headerRef.current, {
        y: -50,
        autoAlpha: 0,
        duration: 1.2
      })
      .from(".verse-anim", {
        scale: 0.9,
        autoAlpha: 0,
        duration: 1
      }, "-=0.8")
      .from(".option-card-anim", {
        y: 30,
         autoAlpha: 0,
        duration: 0.5,
        stagger: 0.2
      }, "-=0.5");
    });

    return () => ctx.revert();
  }, []);

  const sections = [
    {
      title: "المصحف",
      description: "اقرأ القرآن الكريم كاملاً",
      href: "/mushaf",
      emoji: "📖",
    },
    {
      title: "الأذكار",
      description: "أذكار الصباح والمساء",
      href: "/azkar",
      emoji: "🌅",
    },
    {
      title: "الأدعية",
      description: "أدعية مأثورة من القرآن والسنة",
      href: "/duas",
      emoji: "🤲",
    },
  ];

  return (
    <div
      className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ""}`}
      data-theme={isDarkMode ? "dark" : "light"}
    >

      <div className={styles.toggleWrapper}>
        <LightModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>

      <div className={styles.container}>
        <header className={styles.header} ref={headerRef}>
          <h1 className={styles.title}>StarLight Quran</h1>
          <p className={styles.subtitle}>
            منصتك الأولى للوصول إلى القرآن الكريم، والأذكار اليومية، والأدعية الصحيحة بسهولة
          </p>
        </header>

        <div className={styles.contentWrapper}>
          <div className="verse-anim">
            <VerseOfTheDay isDarkMode={isDarkMode} />
          </div>

          <div className={styles.cardsGrid}>
            {sections.map((section, index) => (
              <div key={index} className="option-card-anim">
                <OptionCard
                  title={section.title}
                  description={section.description}
                  href={section.href}
                  emoji={section.emoji}
                />
              </div>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.socialIcons}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="mailto:contact@example.com"
              className={styles.socialLink}
              aria-label="Email"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
              </svg>
            </a>
          </div>
          <p className={styles.footerText}>
          صُنع بحب لخدمة ‏كتابَ الله،‏وسُنَّةَ نبيِّه
          </p>
        </footer>
      </div>
    </div>
  );
}

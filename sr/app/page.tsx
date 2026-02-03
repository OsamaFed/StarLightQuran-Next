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
      description: "﴿وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ﴾ تلاوة تشفي القلب وتطمئن الروح",
      href: "/mushaf",
      emoji: "📖",
    },
    {
      title: "الأذكار",
      description: "خير الأعمال ذكر الله، به يطمئن القلب ويُحفظ العبد في كل وقت",
      href: "/azkar",
      emoji: "🌅",
    },
    {
      title: "الأدعية",
      description: "قال رسول الله ﷺ:«إنَّ اللهَ حيِيٌّ كريم، يستحيي إذا رفع الرجلُ إليه يديه أن يردَّهما صفرًا خائبتين»",
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
        <LightModeToggle />
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
            <VerseOfTheDay />
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
         href="https://github.com/OsamaFed"
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
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"/>
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"/>
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

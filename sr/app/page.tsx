"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import OptionCard from "@/components/layout/OptionCard";
import LightModeToggle from "@/components/ui/LightModeToggle";
import VerseOfTheDay from "@/components/features/VerseOfTheDay";
import styles from "./page.module.css";
import gsap from "gsap";

export default function Home() {
  const { isDarkMode, mounted } = useTheme();
  const headerRef = useRef(null);
  const verseRef = useRef(null);

  useEffect(() => {
    if (!mounted) return;
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
      className={`${styles.pageWrapper} ${mounted && isDarkMode ? styles.darkMode : ""}`}
      data-theme={mounted && isDarkMode ? "dark" : "light"}
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
            <VerseOfTheDay
              isDarkMode={isDarkMode}
              />
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
              href="https://www.instagram.com/iiqrex/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/starlightquran/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
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

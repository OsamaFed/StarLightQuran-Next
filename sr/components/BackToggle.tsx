"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./BackToggle.module.css";

interface BackToggleProps {
  href: string;
  text?: string;
  className?: string;
}

export default function BackToggle({ href, text, className }: BackToggleProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={href} className={styles.backButton}>
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        {text && <span className={styles.backText}>{text}</span>}
      </Link>
    </motion.div>
  );
}
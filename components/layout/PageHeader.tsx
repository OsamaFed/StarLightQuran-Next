"use client";

import { motion } from "framer-motion";
import BackToggle from "../common/BackToggle";
import LightModeToggle from "../ui/LightModeToggle";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  isDarkMode: boolean;
  onToggle: () => void;
  backLink: string;
  backText?: string;
  showBackButton?: boolean;
  showDarkModeToggle?: boolean;
}

export default function PageHeader({ 
  isDarkMode, 
  onToggle, 
  backLink, 
  backText,
  showBackButton = true,
  showDarkModeToggle = true
}: PageHeaderProps) {
  return (
    <motion.nav
      className={styles.headerNav}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.leftSection}>
        {showBackButton && (
          <BackToggle href={backLink} text={backText} />
        )}
      </div>
      
      <div className={styles.rightSection}>
        {showDarkModeToggle && (
          <LightModeToggle isDarkMode={isDarkMode} onToggle={onToggle} />
        )}
      </div>
    </motion.nav>
  );
}

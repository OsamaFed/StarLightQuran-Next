"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PrayerTimes.module.css";
import dayjs from "dayjs";

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface LocationState {
  status: "idle" | "requesting" | "granted" | "denied" | "error";
  latitude?: number;
  longitude?: number;
  error?: string;
}

interface FetchState {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}

interface PrayerTimesProps {
  isDarkMode: boolean;
}

const prayerNames: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const prayerIcons: Record<string, string> = {
  Fajr: "🌙",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌃",
};

const convertTo12HourFormat = (time24: string): string => {
  const clean = time24.replace(/\s*\([^)]*\)\s*/g, "").trim();
  const [hours, minutes] = clean.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return clean;
  const period = hours >= 12 ? "م" : "ص";
  const hours12 = hours % 12 || 12;
  return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export default function PrayerTimes({ isDarkMode }: PrayerTimesProps) {
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [cityName, setCityName] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const currentDate = useMemo(() => {
    const hijriMonths = ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
    const gregorianMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const weekDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const today = new Date();
    const weekDay = weekDays[today.getDay()];
    const day = today.getDate();
    const month = gregorianMonths[today.getMonth()];
    const year = today.getFullYear();
    return `${weekDay}، ${day} ${month} ${year}`;
  }, []);

  useEffect(() => {
    const savedLocation = localStorage.getItem("prayerTimesLocation");
    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      setLocation({ status: "granted", latitude: parsed.latitude, longitude: parsed.longitude });
      setCityName(parsed.cityName || "");
    } else {
      requestLocation();
    }
  }, []);

  useEffect(() => {
    if (location.status === "granted" && location.latitude && location.longitude) {
      fetchPrayerTimes(location.latitude, location.longitude);
    }
  }, [location]);

  const requestLocation = () => {
    setLocation({ status: "requesting" });
    if (!navigator.geolocation) {
      setLocation({ status: "error", error: "المتصفح لا يدعم تحديد الموقع" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          setCityName(city);
          localStorage.setItem("prayerTimesLocation", JSON.stringify({ latitude, longitude, cityName: city }));
        } catch {}
        setLocation({ status: "granted", latitude, longitude });
      },
      (error) => {
        let msg = "حدث خطأ في تحديد الموقع";
        if (error.code === error.PERMISSION_DENIED) msg = "تم رفض إذن الموقع";
        else if (error.code === error.POSITION_UNAVAILABLE) msg = "الموقع غير متاح";
        else if (error.code === error.TIMEOUT) msg = "انتهت مهلة تحديد الموقع";
        setLocation({ status: "denied", error: msg });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    setFetchState({ status: "loading" });
    try {
      const today = dayjs().format("DD-MM-YYYY");
      const response = await fetch(`https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=4`);
      if (!response.ok) throw new Error("فشل في تحميل مواقيت الصلاة");
      const data = await response.json();
      if (data.code === 200 && data.data?.timings) {
        const t = data.data.timings;
        setPrayerTimes({ Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha });
        setFetchState({ status: "success" });
      } else throw new Error("بيانات غير صالحة من الخادم");
    } catch (error) {
      setFetchState({ status: "error", error: error instanceof Error ? error.message : "حدث خطأ في تحميل مواقيت الصلاة" });
    }
  };

  const getCurrentPrayer = useMemo(() => {
    if (!prayerTimes) return null;
    const now = dayjs();
    const nowMinutes = now.hour() * 60 + now.minute();
    const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    for (let i = prayers.length - 1; i >= 0; i--) {
      const prayer = prayers[i];
      const timeStr = prayerTimes[prayer as keyof PrayerTimesData].replace(/\s*\([^)]*\)\s*/g, "");
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) continue;
      const prayerMinutes = hours * 60 + minutes;
      if (nowMinutes >= prayerMinutes) {
        return prayer;
      }
    }
    return null;
  }, [prayerTimes]);

  const getNextPrayer = useMemo(() => {
    if (!prayerTimes) return null;
    const now = dayjs();
    const nowMinutes = now.hour() * 60 + now.minute();
    const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    for (const prayer of prayers) {
      const timeStr = prayerTimes[prayer as keyof PrayerTimesData].replace(/\s*\([^)]*\)\s*/g, "");
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) continue;
      const prayerMinutes = hours * 60 + minutes;
      if (nowMinutes < prayerMinutes) {
        return { 
          key: prayer, 
          name: prayerNames[prayer], 
          time: convertTo12HourFormat(prayerTimes[prayer as keyof PrayerTimesData]), 
          icon: prayerIcons[prayer] 
        };
      }
    }
    return { 
      key: "Fajr", 
      name: prayerNames.Fajr, 
      time: convertTo12HourFormat(prayerTimes.Fajr), 
      icon: prayerIcons.Fajr,
      isTomorrow: true
    };
  }, [prayerTimes]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (location.status === "idle" || location.status === "requesting") {
    return (
      <motion.div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>جاري تحديد موقعك...</p>
        </div>
      </motion.div>
    );
  }

  if (location.status === "denied" || location.status === "error") {
    return (
      <motion.div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{location.error}</p>
          <button onClick={requestLocation} className={styles.retryButton}>إعادة المحاولة</button>
        </div>
      </motion.div>
    );
  }

  if (fetchState.status === "error") {
    const retryFetch = () => { if (location.latitude && location.longitude) fetchPrayerTimes(location.latitude, location.longitude); };
    return (
      <motion.div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{fetchState.error}</p>
          <button onClick={retryFetch} className={styles.retryButton}>إعادة المحاولة</button>
        </div>
      </motion.div>
    );
  }

  if (fetchState.status === "loading" || fetchState.status === "idle" || !prayerTimes) {
    return (
      <motion.div className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>جاري تحميل مواقيت الصلاة...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`${styles.container} ${isDarkMode ? styles.darkMode : ""} ${isExpanded ? styles.expanded : ""}`} 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <button 
        className={styles.headerButton}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "إغلاق مواقيت الصلاة" : "فتح مواقيت الصلاة"}
      >
        <div className={styles.headerContent}>
          <div className={styles.nextPrayerInfo}>
            {getNextPrayer && (
              <>
                <span className={styles.nextPrayerIcon}>{getNextPrayer.icon}</span>
                <span className={styles.nextPrayerLabel}>
                  {getNextPrayer.isTomorrow ? "صلاة الفجر غداً:" : "الصلاة القادمة:"}
                </span>
                <span className={styles.nextPrayerName}>{getNextPrayer.name}</span>
                <span className={styles.nextPrayerTime}>{getNextPrayer.time}</span>
              </>
            )}
          </div>
          <div className={styles.headerRight}>
            {cityName && <span className={styles.cityName}>{cityName}</span>}
            <motion.span 
              className={styles.dropdownIcon}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.span>
          </div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className={styles.expandedContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={styles.dateDisplay}>
              <span className={styles.dateText}>{currentDate}</span>
            </div>
            <div className={styles.timesGrid}>
              {Object.entries(prayerTimes).map(([prayer, time]) => (
                <div 
                  key={prayer} 
                  className={`${styles.prayerCard} ${getCurrentPrayer === prayer ? styles.currentPrayer : ""} ${getNextPrayer?.key === prayer ? styles.nextPrayerCard : ""}`}
                >
                  <span className={styles.prayerIcon}>{prayerIcons[prayer]}</span>
                  <span className={styles.prayerName}>{prayerNames[prayer]}</span>
                  <span className={styles.prayerTime}>{convertTo12HourFormat(time)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

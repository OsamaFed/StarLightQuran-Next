import styles from './WaqfGuide.module.css';

interface WaqfGuideProps {
  className?: string;
  showTitle?: boolean;
}

const WaqfGuide: React.FC<WaqfGuideProps> = ({ className, showTitle = true }) => {
  return (
    <div className={`${styles.waqfGuide} ${className || ''}`}>
      {showTitle && <h3 className={styles.waqfTitle}>علامات الوقف في القرآن الكريم</h3>}
      <div className={styles.waqfGrid}>
        <div className={styles.waqfItem}>
          <span className={styles.waqfSymbol}>مـ</span>
          <span className={styles.waqfName}>الوقف اللازم</span>
        </div>
        <div className={styles.waqfItem}>
          <span className={styles.waqfSymbol}>لا</span>
          <span className={styles.waqfName}>لا تقف</span>
        </div>
        <div className={styles.waqfItem}>
          <span className={styles.waqfSymbol}>ج</span>
          <span className={styles.waqfName}>جائز الوقف</span>
        </div>
        <div className={styles.waqfItem}>
          <span className={styles.waqfSymbol}>قلى</span>
          <span className={styles.waqfName}>الوقف أولى</span>
        </div>
        <div className={styles.waqfItem}>
          <span className={styles.waqfSymbol}>صلى</span>
          <span className={styles.waqfName}>الوصل أولى</span>
        </div>
        <div className={styles.waqfItem}>
          <span className={styles.waqfSymbol}>ۛ  ۛ</span>
          <span className={styles.waqfName}>تعانق الوقف</span>
        </div>
      </div>
    </div>
  );
};

export default WaqfGuide;

import React from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from "./styles.module.css"

const Loading = () => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <div className={styles.pingSlowCircle} />
        <div className={styles.pingFastCircle} />
        <div className={styles.searchIcon}>
          <Search
            className="w-16 h-16 text-blue-500"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className={styles.textContent}>
        <h3 className={styles.title}>
          {t("budget.loading.loading")}
        </h3>
        <div className={styles.dots}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
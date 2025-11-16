import React from "react";
import type { StatsSummary } from "../../api/types";
import "./StatsCards.css";

const StatsCards: React.FC<{ summary: StatsSummary }> = ({ summary }) => {
  return (
    <div className="stats-cards">
      <div className="stats-card">
        <span className="stats-card__label">Всего проверено</span>
        <span className="stats-card__value">{summary.totalReviewed}</span>
        <span className="stats-card__hint">за весь период</span>
      </div>

      <div className="stats-card">
        <span className="stats-card__label">Сегодня</span>
        <span className="stats-card__value">{summary.totalReviewedToday}</span>
      </div>

      <div className="stats-card">
        <span className="stats-card__label">На этой неделе</span>
        <span className="stats-card__value">
          {summary.totalReviewedThisWeek}
        </span>
      </div>

      <div className="stats-card">
        <span className="stats-card__label">В этом месяце</span>
        <span className="stats-card__value">
          {summary.totalReviewedThisMonth}
        </span>
      </div>

      <div className="stats-card">
        <span className="stats-card__label">Среднее время проверки</span>
        <span className="stats-card__value">
          {summary.averageReviewTime} сек
        </span>
      </div>
    </div>
  );
};

export default StatsCards;

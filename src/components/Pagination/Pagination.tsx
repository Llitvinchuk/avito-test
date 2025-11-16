import React from "react";
import "./Pagination.css";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div className="pagination">
      <span className="pagination__info">
        Всего объявлений: <strong>{total}</strong>
      </span>
      <div className="pagination__controls">
        <button disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          ← Предыдущая
        </button>
        <span>
          Страница {page} из {pageCount}
        </span>
        <button disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Следующая →
        </button>
      </div>
    </div>
  );
};

export default Pagination;

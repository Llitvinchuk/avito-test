import React, { useState } from "react";
import { STATUSES } from "../../utils/constants";

import "./FiltersBar.css";
import { AdStatus } from "../../api/types";

export interface FiltersState {
  statuses: AdStatus[];
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  query: string;
  sortBy: "createdAt" | "price" | "priority";
  sortDir: "asc" | "desc";
}

interface Props {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  onReset: () => void;
  categories: string[];
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
}

const FiltersBar: React.FC<Props> = ({
  value,
  onChange,
  onReset,
  categories,
  selectedCount,
  onBulkApprove,
  onBulkReject,
}) => {
  const [localQuery, setLocalQuery] = useState(value.query);

  const toggleStatus = (status: AdStatus) => {
    const exists = value.statuses.includes(status);
    const statuses = exists
      ? value.statuses.filter((s) => s !== status)
      : [...value.statuses, status];
    onChange({ ...value, statuses });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...value, query: localQuery });
  };

  return (
    <div className="filters">
      <div className="filters__row">
        <form onSubmit={handleSearchSubmit} className="filters__search">
          <input
            type="search"
            placeholder="Поиск по названию… (/)"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </form>

        <div className="filters__group">
          <span className="filters__label">Статус</span>
          <div className="filters__chips">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={
                  "filters__chip" +
                  (value.statuses.includes(s.value)
                    ? " filters__chip--active"
                    : "")
                }
                onClick={() => toggleStatus(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filters__group">
          <span className="filters__label">Категория</span>
          <select
            value={value.category}
            onChange={(e) => onChange({ ...value, category: e.target.value })}
          >
            <option value="">Все</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filters__group">
          <span className="filters__label">Цена</span>
          <div className="filters__price">
            <input
              type="number"
              min={0}
              placeholder="от"
              value={value.minPrice}
              onChange={(e) => onChange({ ...value, minPrice: e.target.value })}
            />
            <input
              type="number"
              min={0}
              placeholder="до"
              value={value.maxPrice}
              onChange={(e) => onChange({ ...value, maxPrice: e.target.value })}
            />
          </div>
        </div>

        <div className="filters__group">
          <span className="filters__label">Сортировка</span>
          <div className="filters__sort">
            <select
              value={value.sortBy}
              onChange={(e) =>
                onChange({
                  ...value,
                  sortBy: e.target.value as FiltersState["sortBy"],
                })
              }
            >
              <option value="createdAt">По дате</option>
              <option value="price">По цене</option>
              <option value="priority">По приоритету</option>
            </select>
            <select
              value={value.sortDir}
              onChange={(e) =>
                onChange({
                  ...value,
                  sortDir: e.target.value as FiltersState["sortDir"],
                })
              }
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>
        </div>

        <button type="button" className="filters__reset" onClick={onReset}>
          Сбросить
        </button>
      </div>

      <div className="filters__row filters__row--bottom">
        <span className="filters__selected">
          Выбрано объявлений: <strong>{selectedCount}</strong>
        </span>
        <div className="filters__bulk">
          <button
            type="button"
            disabled={!selectedCount}
            className="filters__bulk-btn filters__bulk-btn--approve"
            onClick={onBulkApprove}
          >
            Одобрить выбранные
          </button>
          <button
            type="button"
            disabled={!selectedCount}
            className="filters__bulk-btn filters__bulk-btn--reject"
            onClick={onBulkReject}
          >
            Отклонить выбранные
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;

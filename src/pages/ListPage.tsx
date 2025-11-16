import React, { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAdsList, useBulkModeration } from "../api/hooks";
import type { AdStatus } from "../api/types";
import { PAGE_SIZE } from "../utils/constants";
import AdCard from "../components/AdCard/AdCard";
import FiltersBar, {
  type FiltersState,
} from "../components/FiltersBar/FiltersBar";
import Pagination from "../components/Pagination/Pagination";
import Modal from "../components/Modal/Modal";

const defaultFilters: FiltersState = {
  statuses: [],
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  query: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const parseFiltersFromSearch = (
  searchParams: URLSearchParams
): FiltersState => {
  const statuses = searchParams.getAll("status") as AdStatus[];
  return {
    statuses,
    categoryId: searchParams.get("categoryId") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    query: searchParams.get("search") ?? "",
    sortBy:
      (searchParams.get("sortBy") as FiltersState["sortBy"]) || "createdAt",
    sortOrder:
      (searchParams.get("sortOrder") as FiltersState["sortOrder"]) || "desc",
  };
};

const ListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersState>(() =>
    parseFiltersFromSearch(searchParams)
  );
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const bulkModeration = useBulkModeration();

  const page = Number(searchParams.get("page") ?? "1");

  const applyFiltersToUrl = (next: FiltersState) => {
    const nextSearch = new URLSearchParams();
    if (next.query) nextSearch.set("search", next.query);
    if (next.categoryId) nextSearch.set("categoryId", next.categoryId);
    if (next.minPrice) nextSearch.set("minPrice", next.minPrice);
    if (next.maxPrice) nextSearch.set("maxPrice", next.maxPrice);
    next.statuses.forEach((s) => nextSearch.append("status", s));
    nextSearch.set("sortBy", next.sortBy);
    nextSearch.set("sortOrder", next.sortOrder);
    nextSearch.set("page", "1");
    setSearchParams(nextSearch);
    setFilters(next);
    setSelectedIds([]);
  };

  const { data, isLoading, isError, error } = useAdsList({
    page,
    limit: PAGE_SIZE,
    statuses: filters.statuses,
    categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    search: filters.query || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const categories = useMemo(() => {
    if (!data?.items) return [] as { id: number; name: string }[];
    const map = new Map<number, string>();
    data.items.forEach((item) => {
      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, item.category);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  const handleToggleAll = () => {
    if (!data?.items) return;
    const ids = data.items.map((a) => a.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  };

  const handleBulkApprove = () => {
    if (!selectedIds.length) return;
    bulkModeration.mutate({
      ids: selectedIds,
      payload: { kind: "approve" },
    });
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    if (!selectedIds.length) return;
    setRejectModalOpen(true);
  };

  const confirmBulkReject = () => {
    bulkModeration.mutate({
      ids: selectedIds,
      payload: {
        kind: "reject",
        comment: rejectComment || undefined,
      },
    });
    setRejectComment("");
    setRejectModalOpen(false);
    setSelectedIds([]);
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
  };

  return (
    <>
      <FiltersBar
        value={filters}
        onChange={applyFiltersToUrl}
        onReset={() => applyFiltersToUrl(defaultFilters)}
        categories={categories}
        selectedCount={selectedIds.length}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
      />

      {isLoading && <div>Загрузка объявлений…</div>}
      {isError && <div>Ошибка: {error?.message}</div>}

      {!isLoading && data && (
        <>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>
              <input
                type="checkbox"
                onChange={handleToggleAll}
                checked={
                  !!data.items.length &&
                  data.items.every((item) => selectedIds.includes(item.id))
                }
              />{" "}
              Выбрать все на странице
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.items.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                checked={selectedIds.includes(ad.id)}
                onToggle={() =>
                  setSelectedIds((prev) =>
                    prev.includes(ad.id)
                      ? prev.filter((id) => id !== ad.id)
                      : [...prev, ad.id]
                  )
                }
              />
            ))}
          </div>

          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        open={rejectModalOpen}
        title="Отклонить выбранные объявления"
        onClose={() => setRejectModalOpen(false)}
      >
        <p style={{ fontSize: 13, marginTop: 0 }}>
          Укажи причину отклонения (обязательное поле для всех объявлений).
        </p>
        <textarea
          style={{ width: "100%", minHeight: 80 }}
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          <button onClick={() => setRejectModalOpen(false)}>Отмена</button>
          <button
            disabled={!rejectComment}
            onClick={confirmBulkReject}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "6px 10px",
            }}
          >
            Отклонить
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ListPage;

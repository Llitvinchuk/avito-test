import type { AdStatus } from "../api/types";

export const PAGE_SIZE = 10;

export const STATUSES: { value: AdStatus; label: string }[] = [
  { value: "pending", label: "На модерации" },
  { value: "approved", label: "Одобрено" },
  { value: "rejected", label: "Отклонено" },
  { value: "draft", label: "Черновик / на доработке" },
];

export const PRIORITIES = [
  { value: "normal", label: "Обычный" },
  { value: "urgent", label: "Срочный" },
] as const;

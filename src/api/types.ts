export type AdStatus = "pending" | "approved" | "rejected" | "draft";

export type AdPriority = "normal" | "urgent";

export type ModerationAction = "approved" | "rejected" | "requestChanges";

export interface Seller {
  id: number;
  name: string;
  rating: string;
  totalAds: number;
  registeredAt: string;
}

export interface ModerationHistory {
  id: number;
  moderatorId: number;
  moderatorName: string;
  action: ModerationAction;
  reason: string | null;
  comment: string;
  timestamp: string;
}

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  status: AdStatus;
  priority: AdPriority;
  createdAt: string;
  updatedAt: string;
  images: string[];
  seller: Seller;
  characteristics: Record<string, string>;
  moderationHistory: ModerationHistory[];
}

export interface AdItem {
  id: number;
  title: string;
  price: number;
  category: string;
  categoryId: number;
  status: AdStatus;
  priority: AdPriority;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
}

export interface AdDetails extends AdItem {
  description: string;
  images: string[];
  seller: Seller;
  characteristics: Record<string, string>;
  moderationHistory: ModerationHistory[];
}

export interface PaginationApi {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdListFilters {
  statuses: AdStatus[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "createdAt" | "price" | "priority";
  sortOrder?: "asc" | "desc";
}

export type ModerationReason =
  | "Запрещенный товар"
  | "Неверная категория"
  | "Некорректное описание"
  | "Проблемы с фото"
  | "Подозрение на мошенничество"
  | "Другое";

export type ModerationDecisionKind = "approve" | "reject" | "requestChanges";

export interface ModerationDecisionPayload {
  kind: ModerationDecisionKind;
  reason?: ModerationReason;
  comment?: string;
}

export type StatsPeriod = "today" | "week" | "month" | "custom";

export interface StatsSummary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

export interface ActivityData {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface DecisionsData {
  approved: number;
  rejected: number;
  requestChanges: number;
}

export type CategoriesChartData = Record<string, number>;

export interface ModeratorStatsBundle {
  summary: StatsSummary;
  activity: ActivityData[];
  decisions: DecisionsData;
  categories: CategoriesChartData;
}

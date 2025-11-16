import axios from "axios";
import {
  type AdDetails,
  type AdItem,
  type AdListFilters,
  type Advertisement,
  type CategoriesChartData,
  type DecisionsData,
  type ModerationDecisionPayload,
  type Paginated,
  type PaginationApi,
  type StatsPeriod,
  type StatsSummary,
  type ActivityData,
} from "./types";

export const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
});

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

const mapAdvertisementToAdItem = (ad: Advertisement): AdItem => ({
  id: ad.id,
  title: ad.title,
  price: ad.price,
  category: ad.category,
  categoryId: ad.categoryId,
  status: ad.status,
  priority: ad.priority,
  createdAt: ad.createdAt,
  updatedAt: ad.updatedAt,
  thumbnailUrl: ad.images?.[0] ?? PLACEHOLDER_IMAGE,
});

const mapAdvertisementToAdDetails = (ad: Advertisement): AdDetails => ({
  ...mapAdvertisementToAdItem(ad),
  description: ad.description,
  images: ad.images && ad.images.length ? ad.images : [PLACEHOLDER_IMAGE],
  seller: ad.seller,
  characteristics: ad.characteristics,
  moderationHistory: ad.moderationHistory,
});

export interface FetchAdsParams extends AdListFilters {
  page: number;
  limit: number;
}

export const fetchAds = async (
  params: FetchAdsParams
): Promise<Paginated<AdItem>> => {
  const response = await api.get<{
    ads: Advertisement[];
    pagination: PaginationApi;
  }>("/ads", {
    params: {
      page: params.page,
      limit: params.limit,
      status: params.statuses,
      categoryId: params.categoryId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });

  const { ads, pagination } = response.data;

  return {
    items: ads.map(mapAdvertisementToAdItem),
    total: pagination.totalItems,
    page: pagination.currentPage,
    pageSize: pagination.itemsPerPage,
  };
};

export const fetchAdById = async (id: number): Promise<AdDetails> => {
  const response = await api.get<Advertisement>(`/ads/${id}`);
  return mapAdvertisementToAdDetails(response.data);
};

export const sendModerationDecision = async (
  id: number,
  payload: ModerationDecisionPayload
): Promise<AdDetails> => {
  if (payload.kind === "approve") {
    const res = await api.post<{ message: string; ad: Advertisement }>(
      `/ads/${id}/approve`
    );
    return mapAdvertisementToAdDetails(res.data.ad);
  }

  if (payload.kind === "reject") {
    const res = await api.post<{ message: string; ad: Advertisement }>(
      `/ads/${id}/reject`,
      {
        reason: payload.reason,
        comment: payload.comment,
      }
    );
    return mapAdvertisementToAdDetails(res.data.ad);
  }

  const res = await api.post<{ message: string; ad: Advertisement }>(
    `/ads/${id}/request-changes`,
    {
      reason: payload.reason,
      comment: payload.comment,
    }
  );
  return mapAdvertisementToAdDetails(res.data.ad);
};

export const fetchStatsSummary = async (
  period: StatsPeriod,
  startDate?: string,
  endDate?: string
): Promise<StatsSummary> => {
  const res = await api.get<StatsSummary>("/stats/summary", {
    params: { period, startDate, endDate },
  });
  return res.data;
};

export const fetchStatsActivity = async (
  period: StatsPeriod,
  startDate?: string,
  endDate?: string
): Promise<ActivityData[]> => {
  const res = await api.get<ActivityData[]>("/stats/chart/activity", {
    params: { period, startDate, endDate },
  });
  return res.data;
};

export const fetchStatsDecisions = async (
  period: StatsPeriod,
  startDate?: string,
  endDate?: string
): Promise<DecisionsData> => {
  const res = await api.get<DecisionsData>("/stats/chart/decisions", {
    params: { period, startDate, endDate },
  });
  return res.data;
};

export const fetchStatsCategories = async (
  period: StatsPeriod,
  startDate?: string,
  endDate?: string
): Promise<CategoriesChartData> => {
  const res = await api.get<CategoriesChartData>("/stats/chart/categories", {
    params: { period, startDate, endDate },
  });
  return res.data;
};

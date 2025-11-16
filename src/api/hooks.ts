import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdById,
  fetchAds,
  fetchStatsActivity,
  fetchStatsCategories,
  fetchStatsDecisions,
  fetchStatsSummary,
  sendModerationDecision,
  type FetchAdsParams,
} from "./client";
import type {
  AdDetails,
  AdItem,
  ModerationDecisionPayload,
  Paginated,
  StatsPeriod,
  ModeratorStatsBundle,
} from "./types";

export const useAdsList = (params: FetchAdsParams) =>
  useQuery<Paginated<AdItem>, Error>({
    queryKey: ["ads", params],
    queryFn: () => fetchAds(params),
    placeholderData: (prev) => prev,
  });

export const useAdDetails = (id: number | undefined) =>
  useQuery<AdDetails, Error>({
    queryKey: ["ad", id],
    queryFn: () => fetchAdById(id as number),
    enabled: !!id,
  });

export const useModeratorStats = (
  period: StatsPeriod,
  startDate?: string,
  endDate?: string
) =>
  useQuery<ModeratorStatsBundle, Error>({
    queryKey: ["stats", { period, startDate, endDate }],
    queryFn: async () => {
      const [summary, activity, decisions, categories] = await Promise.all([
        fetchStatsSummary(period, startDate, endDate),
        fetchStatsActivity(period, startDate, endDate),
        fetchStatsDecisions(period, startDate, endDate),
        fetchStatsCategories(period, startDate, endDate),
      ]);

      return {
        summary,
        activity,
        decisions,
        categories,
      };
    },
  });

export const useModerationMutation = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ModerationDecisionPayload) =>
      sendModerationDecision(id, payload),
    onSuccess: (data) => {
      qc.setQueryData(["ad", id], data);
      qc.invalidateQueries({ queryKey: ["ads"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};
export const useBulkModeration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ids,
      payload,
    }: {
      ids: number[];
      payload: ModerationDecisionPayload;
    }) => {
      await Promise.all(ids.map((id) => sendModerationDecision(id, payload)));
      return ids;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ads"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

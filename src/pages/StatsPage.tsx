import React, { useState } from "react";
import { useModeratorStats } from "../api/hooks";
import type { StatsPeriod } from "../api/types";
import StatsCards from "../components/StatsCards/StatsCards";

const ranges: { value: StatsPeriod; label: string }[] = [
  { value: "today", label: "Сегодня" },
  { value: "week", label: "Последние 7 дней" },
  { value: "month", label: "Последние 30 дней" },
];

const StatsPage: React.FC = () => {
  const [range, setRange] = useState<StatsPeriod>("week");
  const { data, isLoading, isError, error } = useModeratorStats(range);

  const exportCsv = () => {
    if (!data) return;
    const s = data.summary;
    const rows = [
      ["metric", "value"],
      ["totalReviewed", s.totalReviewed.toString()],
      ["totalReviewedToday", s.totalReviewedToday.toString()],
      ["totalReviewedThisWeek", s.totalReviewedThisWeek.toString()],
      ["totalReviewedThisMonth", s.totalReviewedThisMonth.toString()],
      ["approvedPercentage", s.approvedPercentage.toString()],
      ["rejectedPercentage", s.rejectedPercentage.toString()],
      ["requestChangesPercentage", s.requestChangesPercentage.toString()],
      ["averageReviewTime", s.averageReviewTime.toString()],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                border:
                  range === r.value
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border)",
                background:
                  range === r.value ? "var(--primary-soft)" : "transparent",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button onClick={exportCsv} style={{ fontSize: 13 }}>
          ⬇ Экспорт CSV
        </button>
      </div>

      {isLoading && <div>Загрузка статистики…</div>}
      {isError && <div>Ошибка: {error?.message}</div>}

      {data && (
        <>
          <StatsCards summary={data.summary} />

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Активность по дням</h3>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 6,
                height: 160,
              }}
            >
              {data.activity.map((p) => {
                const total = p.approved + p.rejected + p.requestChanges || 0;
                return (
                  <div
                    key={p.date}
                    style={{ flex: 1, textAlign: "center", fontSize: 11 }}
                  >
                    <div
                      style={{
                        height: `${total * 4}px`,
                        background: "var(--primary)",
                        borderRadius: 4,
                      }}
                    />
                    <div style={{ marginTop: 4 }}>{p.date.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15 }}>
              Распределение решений
            </h3>
            {[
              {
                key: "approved" as const,
                label: "Одобрено",
                color: "#22c55e",
                value: data.decisions.approved,
              },
              {
                key: "rejected" as const,
                label: "Отклонено",
                color: "#ef4444",
                value: data.decisions.rejected,
              },
              {
                key: "requestChanges" as const,
                label: "На доработку",
                color: "#f59e0b",
                value: data.decisions.requestChanges,
              },
            ].map((d) => (
              <div key={d.key} style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12, marginRight: 4 }}>{d.label}</span>
                <div
                  style={{
                    display: "inline-block",
                    width: d.value * 4,
                    height: 8,
                    borderRadius: 999,
                    background: d.color,
                  }}
                />
                <span style={{ fontSize: 12, marginLeft: 4 }}>{d.value}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15 }}>По категориям</h3>
            <table
              style={{
                width: "100%",
                fontSize: 13,
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                {Object.entries(data.categories).map(
                  ([categoryName, count]) => (
                    <tr key={categoryName}>
                      <td style={{ padding: "4px 0" }}>{categoryName}</td>
                      <td style={{ padding: "4px 0", textAlign: "right" }}>
                        {count}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPage;

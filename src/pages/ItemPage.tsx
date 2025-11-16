import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdDetails, useModerationMutation } from "../api/hooks";
import { formatDate, formatPrice } from "../utils/format";
import Tag from "../components/Tag/Tag";
import Modal from "../components/Modal/Modal";
import type { ModerationReason } from "../api/types";

const templates: { key: ModerationReason; label: string }[] = [
  { key: "Запрещенный товар", label: "Запрещённый товар" },
  { key: "Неверная категория", label: "Неверная категория" },
  { key: "Некорректное описание", label: "Некорректное описание" },
  { key: "Проблемы с фото", label: "Проблемы с фото" },
  { key: "Подозрение на мошенничество", label: "Подозрение на мошенничество" },
  { key: "Другое", label: "Другое" },
];

const ItemPage: React.FC = () => {
  const { id: idParam } = useParams();
  const id = idParam ? Number(idParam) : undefined;
  const navigate = useNavigate();
  const { data: ad, isLoading, isError, error } = useAdDetails(id);
  const mutation = useModerationMutation(id ?? 0);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] =
    useState<ModerationReason>("Запрещенный товар");
  const [rejectComment, setRejectComment] = useState("");

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const attrs = useMemo(() => {
    if (!ad?.characteristics) return [];
    return Object.entries(ad.characteristics);
  }, [ad]);

  const handleDecision = (kind: "approve" | "reject" | "requestChanges") => {
    if (!ad || !id) return;

    if (kind === "reject") {
      setRejectModalOpen(true);
      return;
    }

    if (kind === "requestChanges") {
      mutation.mutate({
        kind: "requestChanges",
        reason: "Другое",
        comment: "Вернуть на доработку",
      });
      return;
    }

    mutation.mutate({ kind: "approve" });
  };

  const confirmReject = () => {
    mutation.mutate({
      kind: "reject",
      reason: rejectReason,
      comment: rejectComment || undefined,
    });
    setRejectModalOpen(false);
    setRejectComment("");
  };

  if (isLoading) return <div>Загрузка объявления…</div>;
  if (isError || !ad)
    return <div>Ошибка: {error?.message ?? "Объявление не найдено"}</div>;

  return (
    <>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <button onClick={() => navigate("/list")} style={{ marginRight: 12 }}>
            ← Назад к списку
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <section
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--bg-elevated)",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <Tag color={ad.priority === "urgent" ? "purple" : "gray"}>
              {ad.priority === "urgent" ? "Срочное" : "Обычное"}
            </Tag>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 2,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--border)",
                minHeight: 220,
              }}
            >
              <img
                src={ad.images[activeImageIndex]}
                alt={ad.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {ad.images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    borderRadius: 8,
                    border:
                      idx === activeImageIndex
                        ? "2px solid var(--primary)"
                        : "1px solid var(--border)",
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    height: 60,
                  }}
                >
                  <img
                    src={src}
                    alt={ad.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <h2 style={{ marginTop: 16 }}>{ad.title}</h2>
          <p style={{ fontWeight: 700, fontSize: 18 }}>
            {formatPrice(ad.price)}
          </p>

          <p style={{ fontSize: 14 }}>{ad.description}</p>

          <h3 style={{ marginTop: 16, fontSize: 15 }}>Характеристики</h3>
          <table
            style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}
          >
            <tbody>
              {attrs.map(([key, value]) => (
                <tr key={key}>
                  <td
                    style={{
                      padding: "4px 0",
                      width: 160,
                      color: "var(--text-muted)",
                    }}
                  >
                    {key}
                  </td>
                  <td style={{ padding: "4px 0" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Продавец</h3>
            <p style={{ margin: 0 }}>{ad.seller.name}</p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Рейтинг: {ad.seller.rating} • Объявлений: {ad.seller.totalAds}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              На Авито с {formatDate(ad.seller.registeredAt)}
            </p>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Панель модератора</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "none",
                  background: "#22c55e",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleDecision("approve")}
              >
                ✔ Одобрить (A)
              </button>
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleDecision("reject")}
              >
                ✖ Отклонить (D)
              </button>
              <button
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "none",
                  background: "#f59e0b",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => handleDecision("requestChanges")}
              >
                ↻ Вернуть на доработку
              </button>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: 15 }}>История модерации</h3>
            <ul
              style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}
            >
              {ad.moderationHistory.map((ev) => (
                <li
                  key={ev.id}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{ev.moderatorName}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {formatDate(ev.timestamp)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12 }}>
                    Решение:{" "}
                    {ev.action === "approved"
                      ? "одобрено"
                      : ev.action === "rejected"
                      ? "отклонено"
                      : "запрошены изменения"}
                  </div>
                  {ev.reason && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Причина: {ev.reason}
                    </div>
                  )}
                  {ev.comment && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Комментарий: {ev.comment}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <Modal
        open={rejectModalOpen}
        title="Причина отклонения"
        onClose={() => setRejectModalOpen(false)}
      >
        <p style={{ fontSize: 13, marginTop: 0 }}>
          Выберите шаблон причины или введите свою. Поле комментария
          обязательно.
        </p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}
        >
          {templates.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setRejectReason(t.key)}
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                border:
                  rejectReason === t.key
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border)",
                background:
                  rejectReason === t.key
                    ? "var(--primary-soft)"
                    : "transparent",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
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
            onClick={confirmReject}
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

export default ItemPage;

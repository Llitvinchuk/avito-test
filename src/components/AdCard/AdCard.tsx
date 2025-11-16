import React from "react";
import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "../../utils/format";
import "./AdCard.css";
import Tag from "../Tag/Tag";
import { AdItem } from "../../api/types";

interface Props {
  ad: AdItem;
  checked: boolean;
  onToggle: () => void;
}

const AdCard: React.FC<Props> = ({ ad, checked, onToggle }) => {
  return (
    <article className="ad-card">
      <div className="ad-card__left">
        <label className="ad-card__checkbox">
          <input type="checkbox" checked={checked} onChange={onToggle} />
        </label>
        <div className="ad-card__image-wrapper">
          <img
            src={ad.thumbnailUrl}
            alt={ad.title}
            className="ad-card__image"
          />
        </div>
      </div>

      <div className="ad-card__body">
        <div className="ad-card__header">
          <Link to={`/item/${ad.id}`} className="ad-card__title">
            {ad.title}
          </Link>
          <span className="ad-card__price">{formatPrice(ad.price)}</span>
        </div>

        <div className="ad-card__meta">
          <span>{ad.category}</span>
          <span>Создано: {formatDate(ad.createdAt)}</span>
        </div>

        <div className="ad-card__tags">
          <Tag
            color={
              ad.status === "approved"
                ? "green"
                : ad.status === "rejected"
                ? "red"
                : ad.status === "draft"
                ? "yellow"
                : "gray"
            }
          >
            {ad.status === "approved"
              ? "Одобрено"
              : ad.status === "rejected"
              ? "Отклонено"
              : ad.status === "draft"
              ? "Черновик / на доработке"
              : "На модерации"}
          </Tag>

          <Tag color={ad.priority === "urgent" ? "purple" : "gray"}>
            {ad.priority === "urgent" ? "Срочный" : "Обычный"}
          </Tag>
        </div>
      </div>
    </article>
  );
};

export default AdCard;

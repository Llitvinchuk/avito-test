import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./Layout.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <aside className="layout-sidebar">
        <div className="layout-sidebar__logo" onClick={() => navigate("/list")}>
          <span className="layout-sidebar__logo-dot" />
          <span>Avito Moderation</span>
        </div>

        <nav className="layout-sidebar__nav">
          <NavLink
            to="/list"
            className={({ isActive }) =>
              "layout-sidebar__link" +
              (isActive ? " layout-sidebar__link--active" : "")
            }
          >
            Список объявлений
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              "layout-sidebar__link" +
              (isActive ? " layout-sidebar__link--active" : "")
            }
          >
            Статистика
          </NavLink>
        </nav>

        <div className="layout-sidebar__bottom">
          <button className="layout-sidebar__theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Тёмная тема" : "☀️ Светлая тема"}
          </button>
        </div>
      </aside>

      <main className="layout-main">
        <header className="layout-header">
          <div>
            <h1 className="layout-header__title">
              {location.pathname.startsWith("/stats")
                ? "Статистика модерации"
                : "Список объявлений"}
            </h1>
            <p className="layout-header__subtitle">
              Инструмент модератора для проверки и управления объявлениями
            </p>
          </div>
        </header>
        <section className="layout-content">{children}</section>
      </main>
    </>
  );
};

export default Layout;

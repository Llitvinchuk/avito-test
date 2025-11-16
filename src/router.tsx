import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import ItemPage from "./pages/ItemPage";
import StatsPage from "./pages/StatsPage";

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/list" replace />} />
    <Route path="/list" element={<ListPage />} />
    <Route path="/item/:id" element={<ItemPage />} />
    <Route path="/stats" element={<StatsPage />} />
    <Route
      path="*"
      element={<div style={{ padding: 24 }}>Страница не найдена</div>}
    />
  </Routes>
);

export default AppRouter;

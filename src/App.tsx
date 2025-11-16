import React from "react";
import Layout from "./components/Layout/Layout";
import AppRouter from "./router";

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Layout>
        <AppRouter />
      </Layout>
    </div>
  );
};

export default App;

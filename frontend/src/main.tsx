import React from "react";
import ReactDOM from "react-dom/client";

import "./global.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import { AppContextProvider } from "./contexts2/AppContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
      <AppContextProvider>
          <I18nextProvider i18n={i18n}>
            <AppRoutes />
          </I18nextProvider>
          <Toaster visibleToasts={1} position="top-right" richColors />
        </AppContextProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);

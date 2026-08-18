import React, { useState } from "react";
import { NavPage } from "./types";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useClients } from "./hooks/useClients";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientsPage } from "./pages/ClientsPage";
import { NewClientPage } from "./pages/NewClientPage";
import { ApiKeysPage } from "./pages/ApiKeysPage";
import { DEFAULT_PAGE_TITLES } from "./config/constants";

const CRMMain: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<NavPage>("dashboard");
  const {
    clients,
    isLoading,
    error,
    fetchClients,
    updateStatus,
    deleteClient,
  } = useClients(true);

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  return (
    <div id="crm-app-container" className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={logout}
        clientsCount={clients.length}
      />

      {/* Main Content Area */}
      <div id="crm-main-viewport" className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          user={user}
          pageTitle={DEFAULT_PAGE_TITLES[currentPage] || "Painel CRM"}
          onLogout={logout}
        />

        <main id="crm-page-content" className="flex-1 overflow-y-auto pb-12">
          {currentPage === "dashboard" && (
            <DashboardPage
              user={user}
              clients={clients}
              isLoading={isLoading}
              onNavigate={(page) => setCurrentPage(page)}
              onToggleStatus={updateStatus}
              onDeleteClient={deleteClient}
            />
          )}

          {currentPage === "clients" && (
            <ClientsPage
              clients={clients}
              isLoading={isLoading}
              errorMessage={error}
              onRefresh={fetchClients}
              onNavigate={(page) => setCurrentPage(page)}
              onToggleStatus={updateStatus}
              onDeleteClient={deleteClient}
            />
          )}

          {currentPage === "new-client" && (
            <NewClientPage
              onClientCreated={fetchClients}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === "api-keys" && <ApiKeysPage />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CRMMain />
    </AuthProvider>
  );
};

export default App;

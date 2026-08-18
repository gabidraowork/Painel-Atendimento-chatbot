import { useState, useCallback, useEffect } from "react";
import { Client, CreateClientPayload } from "../types";
import { ClientsService } from "../services/clients.service";
import { useAuth } from "../context/AuthContext";

export function useClients(autoFetch: boolean = true) {
  const { isAuthenticated } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await ClientsService.getClients();
      setClients(data);
    } catch (err: any) {
      console.error("Erro ao buscar clientes:", err);
      setError(err?.message || "Não foi possível carregar a lista de clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (autoFetch && isAuthenticated) {
      fetchClients();
    }
  }, [autoFetch, isAuthenticated, fetchClients]);

  const createClient = useCallback(
    async (payload: CreateClientPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ClientsService.createClient(payload);
        // Insere o cliente recém criado no topo
        setClients((prev) => [response.newClient, ...prev.filter((c) => c.phone !== response.newClient.phone)]);
        return response.newClient;
      } catch (err: any) {
        setError(err?.message || "Erro ao cadastrar novo cliente.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (phone: string, answered: boolean) => {
      setError(null);
      // Atualização otimista na interface
      setClients((prev) =>
        prev.map((client) =>
          client.phone === phone ? { ...client, answered } : client
        )
      );

      try {
        const response = await ClientsService.updateStatus(phone, answered);
        // Sincroniza com retorno do backend
        setClients((prev) =>
          prev.map((client) =>
            client.phone === phone ? { ...client, ...response.client } : client
          )
        );
        return response.client;
      } catch (err: any) {
        // Reverte estado em caso de erro e notifica
        await fetchClients();
        setError(err?.message || "Erro ao atualizar status do cliente.");
        throw err;
      }
    },
    [fetchClients]
  );

  const deleteClient = useCallback(
    async (phone: string) => {
      setError(null);
      try {
        await ClientsService.deleteClient(phone);
        setClients((prev) => prev.filter((c) => c.phone !== phone));
      } catch (err: any) {
        setError(err?.message || "Erro ao excluir cliente.");
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateStatus,
    deleteClient,
    clearError,
  };
}

export default useClients;

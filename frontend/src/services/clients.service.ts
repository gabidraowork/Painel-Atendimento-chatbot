import { httpClient } from "./httpClient";
import { API_ENDPOINTS } from "../config/constants";
import {
  Client,
  CreateClientPayload,
  CreateClientResponse,
  GetClientsResponse,
  UpdateStatusResponse,
  DeleteClientResponse,
} from "../types";

export class ClientsService {
  /**
   * Obtém a lista de clientes associados ao atendente ou todos os clientes caso seja ADMIN.
   * Endpoint: GET /clients
   */
  static async getClients(): Promise<Client[]> {
    const response = await httpClient<GetClientsResponse>(API_ENDPOINTS.CLIENTS, {
      method: "GET",
    });

    return response.clients || [];
  }

  /**
   * Registra um novo cliente no sistema.
   * Endpoint: POST /clients
   * @param payload { name, phone }
   */
  static async createClient(payload: CreateClientPayload): Promise<CreateClientResponse> {
    const trimmedPayload: CreateClientPayload = {
      name: payload.name.trim(),
      phone: payload.phone.trim(),
    };

    return await httpClient<CreateClientResponse>(API_ENDPOINTS.CLIENTS, {
      method: "POST",
      body: JSON.stringify(trimmedPayload),
    });
  }

  /**
   * Atualiza o status de atendimento (respondido/pendente) de um cliente.
   * Endpoint: PATCH /clients/answered
   * @param phone Telefone do cliente
   * @param answered Booleano indicando se foi atendido
   */
  static async updateStatus(phone: string, answered: boolean): Promise<UpdateStatusResponse> {
    return await httpClient<UpdateStatusResponse>(API_ENDPOINTS.CLIENTS_ANSWERED, {
      method: "PATCH",
      body: JSON.stringify({
        phone: phone.trim(),
        answered,
      }),
    });
  }

  /**
   * Remove um cliente do sistema pelo telefone.
   * Endpoint: DELETE /clients
   * @param phone Telefone do cliente
   */
  static async deleteClient(phone: string): Promise<DeleteClientResponse> {
    return await httpClient<DeleteClientResponse>(API_ENDPOINTS.CLIENTS, {
      method: "DELETE",
      body: JSON.stringify({
        phone: phone.trim(),
      }),
    });
  }
}

export default ClientsService;

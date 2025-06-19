import { TokenManager } from "@/lib/auth";
import {
  ApiError,
  BulkDeleteRequest,
  CreateTodoRequest,
  TodoFilters,
  TodoResponse,
  TodosResponse,
  UpdateTodoRequest,
} from "@/types/todo";

const API_BASE_URL = "http://localhost:8080/api/todos";

class TodosAPI {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = TokenManager.getToken();

    if (!token) {
      throw {
        message: "Authentication required",
        status: 401,
      } as ApiError;
    }

    console.log("Sending request to:", url);
    console.log("Request options:", options);

    try {
      const response = await fetch(url, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      console.log("Response status:", response.status);

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // For 204 No Content responses
        if (response.status === 204) {
          return {
            status: "success",
            message: "Operation completed successfully",
          } as unknown as T;
        }

        const text = await response.text();
        console.log("Non-JSON response:", text);
        return {
          status: "success",
          message: text || "Request completed successfully",
        } as unknown as T;
      }

      console.log("Response data:", data);

      if (!response.ok) {
        throw {
          message: data.message || `HTTP Error ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error: any) {
      console.error("Request error:", error);

      if (error instanceof TypeError) {
        throw {
          message: "Network error. Please check your connection.",
          status: 0,
        } as ApiError;
      }

      throw error;
    }
  }

  static async getTodos(filters?: TodoFilters): Promise<TodosResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return this.makeRequest<TodosResponse>(endpoint);
  }

  static async getTodo(id: number): Promise<TodoResponse> {
    return this.makeRequest<TodoResponse>(`/${id}`);
  }

  static async createTodo(data: CreateTodoRequest): Promise<TodoResponse> {
    return this.makeRequest<TodoResponse>("", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateTodo(
    id: number,
    data: UpdateTodoRequest
  ): Promise<TodoResponse> {
    return this.makeRequest<TodoResponse>(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteTodo(id: number): Promise<void> {
    await this.makeRequest<void>(`/${id}`, {
      method: "DELETE",
    });
  }

  static async bulkDeleteTodos(data: BulkDeleteRequest): Promise<void> {
    await this.makeRequest<void>("/bulk-delete", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  }
}

export default TodosAPI;

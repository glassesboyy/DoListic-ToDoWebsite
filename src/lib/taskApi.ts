import {
  ApiResponse,
  BulkDeleteRequest,
  CreateTaskRequest,
  Task,
  TaskFilters,
  TaskResponse,
  TasksResponse,
  UpdateTaskRequest,
} from "@/types/task";
import ApiClient from "./api";

class TaskAPI {
  private static buildQueryString(filters: TaskFilters): string {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.title) params.append("title", filters.title);
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.order) params.append("order", filters.order);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return params.toString();
  }

  static async getTasks(filters: TaskFilters = {}): Promise<Task[]> {
    const queryString = this.buildQueryString(filters);
    const endpoint = queryString ? `/todos?${queryString}` : "/todos";
    const response = await ApiClient.get<TasksResponse>(endpoint);
    return response.data;
  }

  static async getTask(id: number): Promise<Task> {
    const response = await ApiClient.get<TaskResponse>(`/todos/${id}`);
    return response.data;
  }

  static async getTaskById(id: number): Promise<Task> {
    const response = await ApiClient.get<TaskResponse>(`/todos/${id}`);
    return response.data;
  }

  static async createTask(data: CreateTaskRequest): Promise<ApiResponse> {
    return ApiClient.post<ApiResponse>("/todos", data);
  }

  static async updateTask(
    id: number,
    data: UpdateTaskRequest
  ): Promise<ApiResponse> {
    return ApiClient.put<ApiResponse>(`/todos/${id}`, data);
  }

  static async deleteTask(id: number): Promise<ApiResponse> {
    return ApiClient.delete<ApiResponse>(`/todos/${id}`);
  }

  static async bulkDeleteTasks(data: BulkDeleteRequest): Promise<ApiResponse> {
    return ApiClient.delete<ApiResponse>("/todos/bulk-delete", data);
  }
}

export default TaskAPI;

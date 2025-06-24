import {
  PermanentDeleteRequest,
  RestoreRequest,
  TrashApiResponse,
  TrashResponse,
  TrashTask,
} from "@/types/trash";
import ApiClient from "./api";

class TrashAPI {
  static async getTrashedTasks(): Promise<TrashTask[]> {
    const response = await ApiClient.get<TrashResponse>("/todos/trash");
    return response.data;
  }

  static async restoreTask(id: number): Promise<TrashApiResponse> {
    return ApiClient.put<TrashApiResponse>(`/todos/trash/restore/${id}`, {});
  }

  static async permanentDeleteTask(id: number): Promise<TrashApiResponse> {
    return ApiClient.delete<TrashApiResponse>(
      `/todos/trash/permanent-delete/${id}`
    );
  }

  static async bulkRestoreTasks(
    data: RestoreRequest
  ): Promise<TrashApiResponse> {
    return ApiClient.put<TrashApiResponse>("/todos/trash/bulk-restore", data);
  }

  static async bulkPermanentDeleteTasks(
    data: PermanentDeleteRequest
  ): Promise<TrashApiResponse> {
    return ApiClient.delete<TrashApiResponse>(
      "/todos/trash/bulk-permanent-delete",
      data
    );
  }
}

export default TrashAPI;

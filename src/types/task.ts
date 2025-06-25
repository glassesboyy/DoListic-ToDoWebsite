export type TaskStatus = "not_started" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  start_date: string;
  end_date: string;
  is_d1_notified: boolean;
  is_less_than_1hr_notified: boolean;
  is_overdue_notified: boolean;
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

export type AttachmentType = "image" | "file" | "link";

export interface Attachment {
  id: number;
  todo_id?: number; // optional for frontend
  file_name: string;
  url: string;
  mime_type: string;
  type: AttachmentType;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  start_date?: string;
  end_date?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  start_date?: string;
  end_date?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  title?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedTasksResponse {
  status: string;
  message: string;
  data: Task[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface TasksResponse extends PaginatedTasksResponse {}

export interface TaskResponse {
  status: string;
  message: string;
  data: Task;
}

export interface BulkDeleteRequest {
  ids: number[];
}

export interface ApiResponse {
  status: string;
  message: string;
  data?: any;
}

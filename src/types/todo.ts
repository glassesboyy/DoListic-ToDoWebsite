export type TodoStatus = "not_started" | "in_progress" | "completed";

export interface Todo {
  id: number;
  title: string;
  user_id: number;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  description: string;
  status: TodoStatus;
  start_date: string;
  end_date: string;
  is_d1_notified: boolean;
  is_less_than_1hr_notified: boolean;
  is_overdue_notified: boolean;
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: number;
  todo_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface UpdateTodoRequest {
  title: string;
  description: string;
  status: TodoStatus;
  start_date: string;
  end_date: string;
}

export interface TodoFilters {
  status?: TodoStatus;
  title?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface BulkDeleteRequest {
  ids: number[];
}

export interface TodosResponse {
  status: string;
  message: string;
  data: {
    todos: Todo[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface TodoResponse {
  status: string;
  message: string;
  data: Todo;
}

export interface ApiError {
  message: string;
  status: number;
}

import { Task } from "./task";

export interface TrashTask extends Task {
  deleted_at: string;
}

export interface TrashResponse {
  status: string;
  message: string;
  data: TrashTask[];
}

export interface RestoreRequest {
  ids: number[];
}

export interface PermanentDeleteRequest {
  ids: number[];
}

export interface TrashApiResponse {
  status: string;
  message: string;
  data?: any;
}

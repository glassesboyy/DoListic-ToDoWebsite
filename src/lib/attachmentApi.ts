import { Attachment } from "@/types/task";
import ApiClient from "./api";

export interface UploadAttachmentResponse {
  status: string;
  message: string;
  data: Attachment;
}

export interface AttachmentLinkRequest {
  url: string;
  type: "link";
}

export const AttachmentAPI = {
  async list(todoId: number): Promise<Attachment[]> {
    // Attachments are included in the todo detail, so this is optional
    // If you have a dedicated endpoint, use it here
    throw new Error("Not implemented: use task detail for attachments list");
  },

  async uploadFile(todoId: number, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append("file", file);

    // Jangan set header Content-Type, biarkan ApiClient yang handle
    const response = await ApiClient.post<UploadAttachmentResponse>(
      `/todos/${todoId}/attachment`,
      formData
    );
    return response.data;
  },

  async uploadLink(todoId: number, url: string): Promise<Attachment> {
    const response = await ApiClient.post<UploadAttachmentResponse>(
      `/todos/${todoId}/attachment`,
      {
        url,
        type: "link",
      }
    );
    return response.data;
  },

  async download(todoId: number, attachmentId: number): Promise<string> {
    // Returns the download URL
    return `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/todos/${todoId}/attachment/${attachmentId}/download`;
  },

  async delete(todoId: number, attachmentId: number): Promise<void> {
    await ApiClient.delete(`/todos/${todoId}/attachment/${attachmentId}`);
  },
};

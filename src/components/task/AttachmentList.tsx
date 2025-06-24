import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AttachmentAPI } from "@/lib/attachmentApi";
import { Attachment } from "@/types/task";
import { useState } from "react";

interface Props {
  todoId: number;
  attachments: Attachment[];
  onChange?: () => void; // callback to refresh parent
}

export default function AttachmentList({
  todoId,
  attachments,
  onChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    setUploadError(null);
    try {
      await AttachmentAPI.uploadFile(todoId, e.target.files[0]);
      onChange?.();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleLinkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    setLinkLoading(true);
    setUploadError(null);
    try {
      await AttachmentAPI.uploadLink(todoId, linkUrl);
      setLinkUrl("");
      onChange?.();
    } catch (err: any) {
      setUploadError(err.message || "Failed to add link");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (!confirm("Delete this attachment?")) return;
    try {
      await AttachmentAPI.delete(todoId, attachmentId);
      onChange?.();
    } catch (err: any) {
      alert(err.message || "Failed to delete attachment");
    }
  };

  const getDownloadUrl = (attachment: Attachment) =>
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/todos/${todoId}/attachment/${attachment.id}/download`;

  return (
    <div>
      <h3 className="font-semibold mb-2">Attachments</h3>
      {uploadError && (
        <Alert
          type="error"
          message={uploadError}
          onClose={() => setUploadError(null)}
        />
      )}
      <div className="flex items-center space-x-2 mb-2">
        <label className="block">
          <span className="sr-only">Upload file</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </label>
        <form onSubmit={handleLinkUpload} className="flex space-x-2">
          <Input
            type="url"
            placeholder="Paste link (URL)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            disabled={linkLoading}
            className="w-48"
          />
          <Button type="submit" size="sm" disabled={linkLoading || !linkUrl}>
            Add Link
          </Button>
        </form>
      </div>
      <ul className="divide-y divide-border-light">
        {attachments.length === 0 && (
          <li className="text-text-secondary text-sm py-2">No attachments.</li>
        )}
        {attachments.map((att) => (
          <li key={att.id} className="flex items-center justify-between py-2">
            <div>
              {att.type === "link" ? (
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {att.url}
                </a>
              ) : (
                <a
                  href={getDownloadUrl(att)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {att.file_name || att.url}
                </a>
              )}
              <span className="ml-2 text-xs text-text-secondary">
                [{att.type}]
              </span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(att.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

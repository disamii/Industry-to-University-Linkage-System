import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Eye,
  File,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type AttachmentViewProps = {
  attachment: string | null;
};

const AttachmentView = ({ attachment }: AttachmentViewProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!attachment) return null;

  // Helper to get file info
  const fileName = attachment.split("/").pop() || "attachment";
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

  // Map icons to file types for better UX
  const getFileIcon = () => {
    if (
      ["jpg", "jpeg", "png", "gif", "svg", "webp", "avif"].includes(
        fileExtension,
      )
    )
      return <ImageIcon className="mr-2 size-4 text-primary" />;

    if (fileExtension === "pdf")
      return <FileText className="mr-2 size-4 text-destructive" />;

    return <File className="mr-2 size-4 text-gray-500" />;
  };

  const handleDownload = async (fileUrl: string): Promise<void> => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = () => {
    window.open(attachment, "_blank", "noopener,noreferrer");
  };

  if (!attachment) return null;

  return (
    <div>
      <Separator />
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-base">Attachment</p>
          <span className="bg-muted/50 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
            {fileExtension || "File"}
          </span>
        </div>

        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center min-w-0">
            {getFileIcon()}
            <p className="font-medium text-sm truncate capitalize">
              {fileName}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={handleView}
            >
              <Eye className="mr-1 size-3.5" />
              View
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={isDownloading}
              onClick={() => handleDownload(attachment)}
            >
              {isDownloading ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Download className="mr-1 size-3.5" />
              )}
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentView;

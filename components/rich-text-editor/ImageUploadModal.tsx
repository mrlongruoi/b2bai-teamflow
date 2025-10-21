import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ImageUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploaded: (url: string) => void;
}

export function ImageUploadModal({ open, onOpenChange, onUploaded }: ImageUploadModalProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tải lên hình ảnh</DialogTitle>
                </DialogHeader>

                <UploadDropzone
                    className="ut-uploading:opacity-90 ut-ready:bg-card ut-ready:border-border ut-ready:text-foreground ut-uploading:bg-muted ut-uploading:border-border ut-uploading:text-fore-muted-ground ut-label:text-sm ut-label:text-muted-foreground ut-allowd-content:text-xs ut-allowed-content:text-muted-foreground ut-button:bg-primary rounded-lg border"
                    appearance={{
                        container: "bg-card",
                        label: "text-muted-foreground",
                        allowedContent: "text-xs text-muted-foreground",
                        button: "bg-primary text-primary-foreground hover:bg-primary/50",
                        uploadIcon: "text-muted-foreground",
                    }}
                    endpoint={"imageUploader"}
                    onClientUploadComplete={(res) => {
                        const url = res[0].ufsUrl;

                        toast.success("Hình ảnh tải lên thành công");

                        onUploaded(url);
                    }}
                    onUploadError={(error) => {
                        toast.error(error.message);
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
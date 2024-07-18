export interface FileUploadProps {
    selectedFile: File | null;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileUpload: () => void;
    loading: boolean;
}

export interface ExtractedTextProps {
    ocrText: string;
    handleCopyToClipboard: () => void;
}

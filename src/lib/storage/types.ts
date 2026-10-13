export interface UploadResult {
  success: boolean;
  url: string;
  key?: string;
  error?: string;
}

export interface IStorageService {
  name: string;
  uploadFile(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    folder?: string
  ): Promise<UploadResult>;
  getPublicUrl(fileKeyOrUrl: string): string;
  deleteFile(fileKeyOrUrl: string): Promise<boolean>;
}

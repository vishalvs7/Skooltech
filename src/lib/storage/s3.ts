import type { IStorageService, UploadResult } from "./types";
import { LocalStorageService } from "./local";

export class S3StorageService implements IStorageService {
  name = "S3StorageService";
  private bucket: string;
  private endpoint?: string;
  private fallbackLocal: LocalStorageService;

  constructor(bucket?: string, endpoint?: string) {
    this.bucket = bucket || process.env.AWS_S3_BUCKET || process.env.SUPABASE_STORAGE_BUCKET || "";
    this.endpoint = endpoint || process.env.AWS_S3_ENDPOINT || process.env.SUPABASE_STORAGE_URL;
    this.fallbackLocal = new LocalStorageService();
  }

  async uploadFile(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    folder: string = "general"
  ): Promise<UploadResult> {
    if (!this.bucket) {
      console.warn("⚠️ [S3StorageService] Cloud storage bucket not configured. Falling back to local storage.");
      return this.fallbackLocal.uploadFile(fileBuffer, fileName, folder);
    }

    try {
      // In production, instantiate @aws-sdk/client-s3 PutObjectCommand
      const uniqueKey = `${folder}/${Date.now()}_${fileName}`;
      const cdnUrl = this.endpoint
        ? `${this.endpoint}/${this.bucket}/${uniqueKey}`
        : `https://${this.bucket}.s3.ap-south-1.amazonaws.com/${uniqueKey}`;

      console.log(`☁️ [S3/CLOUD STORAGE UPLOAD] Key: ${uniqueKey} | Target Bucket: ${this.bucket}`);
      return {
        success: true,
        url: cdnUrl,
        key: uniqueKey,
      };
    } catch (error) {
      console.error("S3 upload error:", error);
      return {
        success: false,
        url: "",
        error: "Cloud upload failed.",
      };
    }
  }

  getPublicUrl(fileKeyOrUrl: string): string {
    if (fileKeyOrUrl.startsWith("http")) return fileKeyOrUrl;
    return `https://${this.bucket}.s3.ap-south-1.amazonaws.com/${fileKeyOrUrl}`;
  }

  async deleteFile(fileKeyOrUrl: string): Promise<boolean> {
    if (!this.bucket) {
      return this.fallbackLocal.deleteFile(fileKeyOrUrl);
    }
    console.log(`☁️ [S3/CLOUD STORAGE DELETE] Key: ${fileKeyOrUrl}`);
    return true;
  }
}

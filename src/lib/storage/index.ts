import { LocalStorageService } from "./local";
import { S3StorageService } from "./s3";
import type { IStorageService } from "./types";

export * from "./types";
export * from "./local";
export * from "./s3";

let storageServiceInstance: IStorageService | null = null;

/**
 * Storage Service Factory
 * Uses S3StorageService if AWS_S3_BUCKET or SUPABASE_STORAGE_BUCKET is configured,
 * otherwise defaults cleanly to LocalStorageService in public/uploads/.
 */
export function getStorageService(): IStorageService {
  if (storageServiceInstance) {
    return storageServiceInstance;
  }

  if (process.env.AWS_S3_BUCKET || process.env.SUPABASE_STORAGE_BUCKET) {
    storageServiceInstance = new S3StorageService();
  } else {
    storageServiceInstance = new LocalStorageService();
  }

  return storageServiceInstance;
}

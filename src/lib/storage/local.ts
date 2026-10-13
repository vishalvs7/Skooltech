import fs from "fs/promises";
import path from "path";
import type { IStorageService, UploadResult } from "./types";

export class LocalStorageService implements IStorageService {
  name = "LocalStorageService";
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
  }

  async uploadFile(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    folder: string = "general"
  ): Promise<UploadResult> {
    try {
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueName = `${Date.now()}_${sanitizedName}`;
      const targetDir = path.join(this.uploadDir, folder);

      await fs.mkdir(targetDir, { recursive: true });

      const filePath = path.join(targetDir, uniqueName);
      await fs.writeFile(filePath, fileBuffer);

      const publicUrl = `/uploads/${folder}/${uniqueName}`;
      console.log(`💾 [LOCAL STORAGE SAVED] Saved to: ${publicUrl}`);

      return {
        success: true,
        url: publicUrl,
        key: `${folder}/${uniqueName}`,
      };
    } catch (error) {
      console.error("Local storage write error:", error);
      return {
        success: false,
        url: "",
        error: "Failed to write file to local disk.",
      };
    }
  }

  getPublicUrl(fileKeyOrUrl: string): string {
    if (fileKeyOrUrl.startsWith("/")) return fileKeyOrUrl;
    return `/uploads/${fileKeyOrUrl}`;
  }

  async deleteFile(fileKeyOrUrl: string): Promise<boolean> {
    try {
      const cleanPath = fileKeyOrUrl.replace(/^\/uploads\//, "");
      const fullPath = path.join(this.uploadDir, cleanPath);
      await fs.unlink(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

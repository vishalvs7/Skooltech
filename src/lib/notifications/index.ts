import { MockNotificationService } from "./mock";
import { BrevoNotificationService } from "./brevo";
import type { INotificationService } from "./types";

export * from "./types";
export * from "./mock";
export * from "./brevo";

let notificationServiceInstance: INotificationService | null = null;

/**
 * Returns the configured notification service.
 * Automatically chooses BrevoNotificationService if BREVO_API_KEY is present,
 * or gracefully defaults to MockNotificationService for zero-dependency development.
 */
export function getNotificationService(): INotificationService {
  if (notificationServiceInstance) {
    return notificationServiceInstance;
  }

  if (process.env.BREVO_API_KEY) {
    notificationServiceInstance = new BrevoNotificationService();
  } else {
    notificationServiceInstance = new MockNotificationService();
  }

  return notificationServiceInstance;
}

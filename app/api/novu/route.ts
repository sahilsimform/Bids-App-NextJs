import { serve } from "@novu/framework/next";
import {
  sendNotificationInApp,
  sendOwnerNotificationInApp,
} from "../../novu/workflows";

export const { GET, POST, OPTIONS } = serve({
  workflows: [sendNotificationInApp, sendOwnerNotificationInApp],
});

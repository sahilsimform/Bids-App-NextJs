import { workflow } from "@novu/framework";
import { inAppPayloadSchema } from "./schemas";

export const sendNotificationInApp = workflow(
  "send-notification-inapp",
  async ({ step, payload }) => {
    await step.inApp("send-inApp", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        // primaryAction: {
        //   label: "Test",
        //   redirect: {
        //     url: "http://localhost:4000/",
        //     target: "_blank",
        //   },
        // },
      };
    });
  },
  {
    payloadSchema: inAppPayloadSchema,
  }
);

export const sendOwnerNotificationInApp = workflow(
  "send-owner-notification-inapp",
  async ({ step, payload }) => {
    await step.inApp("send-inApp", async () => {
      return {
        subject: payload.subject,
        body: payload.body,
        // primaryAction: {
        //   label: "Test",
        //   redirect: {
        //     url: "http://localhost:4000/",
        //     target: "_blank",
        //   },
        // },
      };
    });
  },
  {
    payloadSchema: inAppPayloadSchema,
  }
);

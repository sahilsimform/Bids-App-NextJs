"use client";

import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

export const Novu = ({ user }: { user: string }) => {
  const ApplicationIdentifier = process.env
    .NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER as string;

  return (
    <NovuProvider
      applicationIdentifier={ApplicationIdentifier}
      subscriberId={user}
    >
      <PopoverNotificationCenter colorScheme="dark">
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

"use client";

// external lib
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function NextProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProgressBar
        height="4px"
        color="#FDF11E"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  );
}

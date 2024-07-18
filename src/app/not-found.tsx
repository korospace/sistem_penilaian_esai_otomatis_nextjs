"use client";

// nextjs
import { Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
// component
import PageComponent from "@/lib/components/page/PageComponent";

export default function NotFoundPage() {
  // -- Hook --
  const router = useRouter();

  return (
    <PageComponent metaTitle="Not Found">
      <div className="h-screen flex flex-col items-center justify-center text-budiluhur-700 bg-budiluhur-300">
        <h1 className="mb-4 text-7xl font-extrabold">404</h1>
        <p className="mb-4 text-3xl font-bold">{"Something's missing."}</p>
        <p className="mb-6 text-lg font-light">
          {"Sorry, we can't find that page."}
        </p>
        <Button
          radius="sm"
          color="primary"
          className="text-sm px-10 py-2.5"
          onClick={() => router.push("/")}
        >
          Back
        </Button>
      </div>
    </PageComponent>
  );
}

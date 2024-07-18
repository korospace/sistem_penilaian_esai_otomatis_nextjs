"use client";

// react
import { useState } from "react";
// nextjs
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next-nprogress-bar";
import toast from "react-hot-toast";
// components
import PageComponent from "@/lib/components/page/PageComponent";

export default function LogoutPage() {
  // -- Hook --
  const router = useRouter();

  // -- Use State --
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // -- Function --
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      toast.success("Logout success!");
      router.push("/login");
    } catch (error) {
      toast.error("An error occurred while logging out.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageComponent metaTitle="Logout">
      <main className="min-h-screen flex justify-center items-center bg-budiluhur-300">
        <div className="flex flex-col items-center gap-8 text-budiluhur-700">
          <Icon icon="octicon:question-24" className="text-9xl" />
          <span className="text-4xl text-center">
            Anda yakin ingin <br /> keluar?
          </span>
          <div className="w-full flex gap-2">
            <Button
              radius="sm"
              color="danger"
              className="flex-1"
              isLoading={isLoading}
              onClick={handleLogout}
            >
              Iya
            </Button>
            <Button
              radius="sm"
              color="primary"
              className="flex-1"
              onClick={() => router.back()}
            >
              Tidak
            </Button>
          </div>
        </div>
      </main>
    </PageComponent>
  );
}

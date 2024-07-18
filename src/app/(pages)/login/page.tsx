"use client";

// react
import { useState } from "react";
// nextjs
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";
// external lib
import { useRouter } from "next-nprogress-bar";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
// assets
import BudiluhurJpg from "@/assets/images/budiluhur.jpg";
// services
import { HttpLogin } from "@/lib/services/functions/frontend/loginFunc";
// components
import PageComponent from "@/lib/components/page/PageComponent";
import BrandTitileComponent from "@/lib/components/page/BrandTitileComponent";

export default function LoginPage({ searchParams }: any) {
  // -- Variable --
  const callbackUrl =
    searchParams.callbackUrl &&
    searchParams.callbackUrl !== process.env.NEXT_PUBLIC_APP_URL
      ? searchParams.callbackUrl
      : "/dashboard";

  // -- Hook --
  const route = useRouter();

  // -- Use State --
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
  const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);

  // -- Function --
  const hadleSubmit = async (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username == "") setUsernameInvalid(true);
    if (password == "") setPasswordInvalid(true);
    if (username == "" || password == "") return;

    setIsLoading(true);
    const res = await HttpLogin(e.target, callbackUrl);
    setIsLoading(false);

    if (res.status == true) {
      toast.success("login success!");
      route.push(callbackUrl);
      e.target.reset();
    } else {
      if (res.message === "invalid username or password") {
        setUsernameInvalid(true);
        setPasswordInvalid(true);
      }
      toast.error(res.message);
    }
  };

  return (
    <PageComponent metaTitle="Login">
      <main className="w-screen h-screen p-10 flex justify-center items-center bg-budiluhur-500">
        <Card className="w-screen max-w-64 bg-budiluhur-300">
          <form onSubmit={hadleSubmit}>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <div className="w-20 p-2 bg-white rounded-full">
                <Image className="w-full" src={BudiluhurJpg.src} />
              </div>
              <BrandTitileComponent />
            </CardHeader>

            <Divider />

            <CardBody className="pb-8">
              <Input
                label="Username"
                name="username"
                type="text"
                size="md"
                radius="sm"
                color={usernameInvalid ? "danger" : "default"}
                variant="bordered"
                isInvalid={usernameInvalid}
                labelPlacement="outside"
                className="mb-4 rounded-lg bg-budiluhur-50"
                onKeyUp={() => setUsernameInvalid(false)}
              />
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                size="md"
                radius="sm"
                color={passwordInvalid ? "danger" : "default"}
                variant="bordered"
                isInvalid={passwordInvalid}
                labelPlacement="outside"
                className="rounded-lg bg-budiluhur-50"
                onKeyUp={() => setPasswordInvalid(false)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icon
                        icon="mdi:eye"
                        className="text-2xl text-default-400 pointer-events-none"
                      />
                    ) : (
                      <Icon
                        icon="mdi:eye-off"
                        className="text-2xl text-default-400 pointer-events-none"
                      />
                    )}
                  </button>
                }
              />
            </CardBody>

            <Divider />

            <CardFooter>
              <Button
                type="submit"
                isLoading={isLoading}
                radius="sm"
                className="w-full bg-budiluhur-700 text-white"
                onClick={() => {
                  setUsernameInvalid(false);
                  setPasswordInvalid(false);
                }}
              >
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </PageComponent>
  );
}

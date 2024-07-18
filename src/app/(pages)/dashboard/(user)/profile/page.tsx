"use client";

// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// components
import BreadcrumbComponent from "@/lib/components/page/BreadcrumbsComponent";
import PageComponent from "@/lib/components/page/PageComponent";
// types
import {
  BreadcrumbItemType,
  InvalidFieldType,
} from "@/lib/types/ComponentTypes";
import { UserType } from "@/lib/types/ResultTypes";
// services
import {
  HttpGetProfile,
  HttpUpdateProfile,
} from "@/lib/services/functions/frontend/profileFunc";

export default function SettingPage() {
  // -- breadcrumbs items --
  const breadcrumItems: BreadcrumbItemType[] = [
    {
      title: "Home",
      icon: "ic:baseline-home",
      href: "/dashboard",
    },
    {
      title: "Setting",
      icon: "fe:arrow-right",
      href: "/dashboard/setting",
    },
  ];

  // -- use state --
  const [profile, setProfile] = useState<UserType>();
  const [loadingGeneralInfo, setLoadingGeneralInfo] = useState<boolean>(false);
  const [usernameInvalid, setUsernameInvalid] = useState<InvalidFieldType>();
  const [fullnameInvalid, setFullnameInvalid] = useState<InvalidFieldType>();
  const [loadingSecurity, setLoadingSecurity] = useState<boolean>(false);
  const [passwordInvalid, setPasswordInvalid] = useState<InvalidFieldType>();
  const [repPasswordInvalid, setRepPasswordInvalid] =
    useState<InvalidFieldType>();

  // -- use effect --
  useEffect(() => {
    fetchProfile();
  }, []);

  // -- functions --
  const fetchProfile = async () => {
    const res = await HttpGetProfile();

    if (res.status == false) {
      toast.error(res.message);
    } else {
      setProfile(res.data);
    }
  };

  const handleGeneralInformation = async (e: any) => {
    e.preventDefault();

    // reset error
    setUsernameInvalid({ invalid: false, message: "" });
    setFullnameInvalid({ invalid: false, message: "" });

    // value
    const username = e.target.username.value;
    const fullName = e.target.full_name.value;

    // validation empty
    if (username == "")
      setUsernameInvalid({ invalid: true, message: "username cant be empty" });
    if (fullName == "")
      setFullnameInvalid({ invalid: true, message: "full nama cant be empty" });
    if (username == "" || fullName == "") return;

    // HTTP
    setLoadingGeneralInfo(true);
    const res = await HttpUpdateProfile({
      username: username,
      full_name: fullName,
    });
    setLoadingGeneralInfo(false);

    // response
    if (res.status == true) {
      toast.success("general information update successfully!");
      fetchProfile();
    } else {
      if (res.message === "validation failed") {
        if (res.data.username) {
          setUsernameInvalid({
            invalid: true,
            message: res.data.username,
          });
        }
        if (res.data.full_name) {
          setFullnameInvalid({
            invalid: true,
            message: res.data.full_name,
          });
        }
      } else {
        toast.error(res.message);
      }
    }
  };

  const handleSecurity = async (e: any) => {
    e.preventDefault();

    // reset error
    setPasswordInvalid({ invalid: false, message: "" });
    setRepPasswordInvalid({ invalid: false, message: "" });

    // value
    const password = e.target.password.value;
    const repPassword = e.target.repeat_password.value;

    // validation
    if (password == "") {
      setPasswordInvalid({ invalid: true, message: "password cant be empty" });
      return;
    }
    if (repPassword !== password) {
      setRepPasswordInvalid({
        invalid: true,
        message: "wrong repetation password",
      });
      return;
    }

    // HTTP
    setLoadingSecurity(true);
    const res = await HttpUpdateProfile({
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      password: password,
    });
    setLoadingSecurity(false);

    // response
    if (res.status == true) {
      toast.success("security update successfully!");
      e.target.reset();
    } else {
      if (res.message === "validation failed") {
        if (res.data.password) {
          setPasswordInvalid({
            invalid: true,
            message: res.data.password,
          });
        }
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <PageComponent metaTitle="Setting">
      <main className="py-5 px-4">
        <BreadcrumbComponent breadcrumItems={breadcrumItems} />

        <div className="my-4">
          <Divider className="bg-budiluhur-700 opacity-50" />
        </div>

        {/* General Information */}
        <div className="mb-10 p-3 bg-budiluhur-500 rounded-md shadow">
          <h1 className="text-3xl font-extrabold text-budiluhur-700">
            General Information
          </h1>

          <div className="my-4">
            <Divider className="bg-budiluhur-700 opacity-50" />
          </div>

          <form onSubmit={handleGeneralInformation} autoComplete="off">
            {/* Username */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
                Username
              </label>
              <input
                type="text"
                name="username"
                defaultValue={profile?.username ?? ""}
                placeholder="Input your username"
                className={`w-full max-w-lg p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                  usernameInvalid?.invalid
                    ? "bg-red-100 border-red-600 text-red-700"
                    : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
                }`}
                onChange={() =>
                  setUsernameInvalid({ invalid: false, message: "" })
                }
              />
              {usernameInvalid?.invalid && (
                <p className="mt-2 text-sm text-red-600">
                  {usernameInvalid.message}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                defaultValue={profile?.full_name}
                placeholder="Input your full name"
                className={`w-full max-w-lg p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                  fullnameInvalid?.invalid
                    ? "bg-red-100 border-red-600 text-red-700"
                    : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
                }`}
                onChange={() =>
                  setFullnameInvalid({ invalid: false, message: "" })
                }
              />
              {fullnameInvalid?.invalid && (
                <p className="mt-2 text-sm text-red-600">
                  {fullnameInvalid.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center py-2.5 px-5 mt-8 text-sm font-medium text-budiluhur-400 focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-600 hover:text-budiluhur-300 focus:bg-budiluhur-600 focus:text-budiluhur-300"
            >
              <Icon
                icon="eos-icons:loading"
                className={`mr-2 ${loadingGeneralInfo ? "" : "hidden"}`}
              />
              Save
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="p-3 bg-budiluhur-500 rounded-md shadow">
          <h1 className="text-3xl font-extrabold text-budiluhur-700">
            Security
          </h1>

          <div className="my-4">
            <Divider className="bg-budiluhur-700 opacity-50" />
          </div>

          <form onSubmit={handleSecurity} autoComplete="off">
            {/* New Password */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
                New Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Input your new password"
                className={`w-full max-w-lg p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                  passwordInvalid?.invalid
                    ? "bg-red-100 border-red-600 text-red-700"
                    : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
                }`}
                onChange={() =>
                  setPasswordInvalid({ invalid: false, message: "" })
                }
              />
              {passwordInvalid?.invalid && (
                <p className="mt-2 text-sm text-red-600">
                  {passwordInvalid.message}
                </p>
              )}
            </div>

            {/* Repeat New Password */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
                Repeat New Password
              </label>
              <input
                type="password"
                name="repeat_password"
                placeholder="Repeat your new password"
                className={`w-full max-w-lg p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                  repPasswordInvalid?.invalid
                    ? "bg-red-100 border-red-600 text-red-700"
                    : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
                }`}
                onChange={() =>
                  setRepPasswordInvalid({ invalid: false, message: "" })
                }
              />
              {repPasswordInvalid?.invalid && (
                <p className="mt-2 text-sm text-red-600">
                  {repPasswordInvalid.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center py-2.5 px-5 mt-8 text-sm font-medium text-budiluhur-400 focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-600 hover:text-budiluhur-300 focus:bg-budiluhur-600 focus:text-budiluhur-300"
            >
              <Icon
                icon="eos-icons:loading"
                className={`mr-2 ${loadingSecurity ? "" : "hidden"}`}
              />
              Save
            </button>
          </form>
        </div>
      </main>
    </PageComponent>
  );
}

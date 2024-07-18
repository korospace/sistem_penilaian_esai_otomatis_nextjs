// react
import { useEffect, useRef, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// type
import { InvalidFieldType } from "@/lib/types/ComponentTypes";
import { UserType } from "@/lib/types/ResultTypes";
import { UserInputType } from "@/lib/types/InputTypes";
// services
import { HttpSaveUser } from "@/lib/services/functions/frontend/userFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  dtUser?: UserType;
  apiPath: string;
  showForm: boolean;
  onCancle: () => void;
  afterSubmit: () => void;
};

export default function UserFormComponent({
  dtUser,
  apiPath,
  showForm,
  onCancle,
  afterSubmit,
}: Props) {
  // -- Use Ref --
  const dropdownRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [usernameInvalid, setUsernameInvalid] = useState<InvalidFieldType>();
  const [fullnameInvalid, setFullnameInvalid] = useState<InvalidFieldType>();
  const [passwordInvalid, setPasswordInvalid] = useState<InvalidFieldType>();

  // -- function --
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // reset error
    setUsernameInvalid({ invalid: false, message: "" });
    setFullnameInvalid({ invalid: false, message: "" });
    setPasswordInvalid({ invalid: false, message: "" });

    // value
    const username = e.target.username.value;
    const fullName = e.target.full_name.value;
    const password = e.target.password.value;

    // validation empty
    if (username == "")
      setUsernameInvalid({ invalid: true, message: "username cant be empty" });
    if (fullName == "")
      setFullnameInvalid({ invalid: true, message: "full name cant be empty" });
    if (password == "" && dtUser === undefined)
      setPasswordInvalid({ invalid: true, message: "password cant be empty" });
    if (
      username == "" ||
      fullName == "" ||
      (password == "" && dtUser === undefined)
    )
      return;

    // build payload
    const httpMethod: string = dtUser === undefined ? "POST" : "PUT";
    const httpPayload: UserInputType =
      password === ""
        ? {
            id_user: dtUser?.id_user,
            username: username,
            full_name: fullName,
          }
        : {
            id_user: dtUser?.id_user,
            username: username,
            full_name: fullName,
            password: password,
          };

    // HTTP
    setLoadingForm(true);
    const res = await HttpSaveUser(apiPath, httpMethod, httpPayload);
    setLoadingForm(false);

    // response
    if (res.status == true) {
      toast.success("data saved successfully!");
      afterSubmit();

      if (dtUser) {
        onCancle();
      } else {
        e.target.reset();
      }
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
    <div
      ref={dropdownRef}
      className={`w-full ${
        showForm
          ? "px-6 py-6 overflow-visible"
          : "h-0 px-0 py-0 overflow-hidden"
      } transition-all`}
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 shadow-md rounded bg-budiluhur-400 "
      >
        <div className="flex gap-3">
          {/* Username */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={dtUser?.username ?? ""}
              placeholder="Input username"
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
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={dtUser?.full_name}
              placeholder="Input full name"
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

          {/* Password */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              {dtUser ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              placeholder={dtUser ? "Input new password" : "Input password"}
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
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="flex items-center mr-2 py-2 px-4 text-xs font-medium text-budiluhur-700 hover:text-budiluhur-400 focus:text-budiluhur-400 border-2 border-budiluhur-700 hover:bg-budiluhur-700 focus:bg-budiluhur-700 focus:outline-none rounded-md"
            onClick={onCancle}
          >
            Cancle
          </button>

          <button
            type="submit"
            className="flex items-center py-2 px-4 text-xs font-medium text-budiluhur-400 focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-600 hover:text-budiluhur-300 focus:bg-budiluhur-600 focus:text-budiluhur-300"
          >
            <Icon
              icon="eos-icons:loading"
              className={`mr-2 ${loadingForm ? "" : "hidden"}`}
            />
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

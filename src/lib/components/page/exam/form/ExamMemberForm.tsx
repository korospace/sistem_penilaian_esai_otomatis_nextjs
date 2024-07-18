// react
import { useRef, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// types
import { ExamMemberType, ExamType, UserType } from "@/lib/types/ResultTypes";
import { InvalidFieldType } from "@/lib/types/ComponentTypes";
// components
import AutoCompleteComponent from "../../AutoCompleteComponent";
import { ExamMemberInputType } from "@/lib/types/InputTypes";
import { HttpSaveExamMember } from "@/lib/services/functions/frontend/examMemberFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  apiPath: string;
  dtGeneralInfo: ExamType | undefined;
  dtMember?: ExamMemberType;
  showForm: boolean;
  onCancle: () => void;
  afterSubmit: () => void;
};

export default function ExamMemberForm({
  apiPath,
  dtGeneralInfo,
  dtMember,
  showForm,
  onCancle,
  afterSubmit,
}: Props) {
  // -- Use Ref --
  const dropdownRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [acValue, setAcValue] = useState<string>("");
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [idUserInvalid, setIdUsertInvalid] = useState<InvalidFieldType>();
  const [idUser, setIdUser] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  // -- Functions --
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // reset error
    setIdUsertInvalid({ invalid: false, message: "" });

    // validation empty
    if (idUser == "")
      setIdUsertInvalid({ invalid: true, message: "student cant be empty" });
    if (idUser == "") return;

    // build payload
    const httpMethod: string = "POST";
    const httpPayload: ExamMemberInputType = {
      id_exam: dtGeneralInfo?.id_exam ?? 0,
      id_user: parseInt(idUser),
    };

    // HTTP
    setLoadingForm(true);
    const res = await HttpSaveExamMember(
      apiPath + "/create",
      httpMethod,
      httpPayload
    );
    setLoadingForm(false);

    // response
    if (res.status == true) {
      toast.success("data saved successfully!");
      setFullName("");
      afterSubmit();
      setAcValue("");
      setIdUser("");
    } else {
      if (res.message === "validation failed") {
        if (res.data.id_user) {
          setIdUsertInvalid({
            invalid: true,
            message: res.data.id_user,
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
        className="p-6 shadow-md rounded bg-budiluhur-500"
      >
        <div className="flex gap-3">
          {/* Student */}
          <div className="mb-5 flex-1">
            <AutoCompleteComponent
              value={acValue}
              label="Student"
              tag="ac_student"
              invalid={idUserInvalid}
              apiPath="api/autocomplete/student"
              placeholder="Search username / full name"
              onClear={() => {
                setFullName("");
                setIdUser("");
              }}
              onSelect={(opt) => {
                const splitValue = opt.value.split(" - ");
                setIdUsertInvalid({ invalid: false });
                setFullName(splitValue[1]);
                setAcValue(opt.value);
                setIdUser(opt.key);
              }}
            />
          </div>

          {/* Full Name */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80 leading-none">
              Full Name
            </label>
            <input
              disabled
              type="text"
              value={fullName}
              placeholder="Full Name"
              className={`w-full p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border bg-budiluhur-400 border-budiluhur-600 text-budiluhur-700 cursor-not-allowed
              `}
            />
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

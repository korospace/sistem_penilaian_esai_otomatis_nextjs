// react
import { useRef, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
// type
import { InvalidFieldType } from "@/lib/types/ComponentTypes";
import { CourseType } from "@/lib/types/ResultTypes";
import { CourseInputType } from "@/lib/types/InputTypes";
// services
import { HttpSaveCourse } from "@/lib/services/functions/frontend/courseFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  dtCourse?: CourseType;
  apiPath: string;
  showForm: boolean;
  onCancle: () => void;
  afterSubmit: () => void;
};

export default function CourseFormComponent({
  dtCourse,
  apiPath,
  showForm,
  onCancle,
  afterSubmit,
}: Props) {
  // -- Use Ref --
  const dropdownRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [nameInvalid, setNameInvalid] = useState<InvalidFieldType>();
  const [descriptionInvalid, setDescriptionInvalid] =
    useState<InvalidFieldType>();

  // -- function --
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // reset error
    setNameInvalid({ invalid: false, message: "" });
    setDescriptionInvalid({ invalid: false, message: "" });

    // value
    const name = e.target.name.value;
    const description = e.target.description.value;

    // validation empty
    if (name == "")
      setNameInvalid({ invalid: true, message: "name cant be empty" });
    if (description == "")
      setDescriptionInvalid({
        invalid: true,
        message: "description cant be empty",
      });
    if (name == "" || description == "") return;

    // build payload
    const httpMethod: string = dtCourse === undefined ? "POST" : "PUT";
    const httpPayload: CourseInputType = {
      id_course: dtCourse?.id_course,
      name: name,
      description: description,
    };

    // HTTP
    setLoadingForm(true);
    const res = await HttpSaveCourse(apiPath, httpMethod, httpPayload);
    setLoadingForm(false);

    // response
    if (res.status == true) {
      toast.success("data saved successfully!");
      afterSubmit();

      if (dtCourse) {
        onCancle();
      } else {
        e.target.reset();
      }
    } else {
      if (res.message === "validation failed") {
        if (res.data.name) {
          setNameInvalid({
            invalid: true,
            message: res.data.name,
          });
        }
        if (res.data.description) {
          setDescriptionInvalid({
            invalid: true,
            message: res.data.description,
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
          {/* Course Name */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              Course Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={dtCourse?.name ?? ""}
              placeholder="Input course name"
              className={`w-full max-w-lg p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                nameInvalid?.invalid
                  ? "bg-red-100 border-red-600 text-red-700"
                  : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
              }`}
              onChange={() => setNameInvalid({ invalid: false, message: "" })}
            />
            {nameInvalid?.invalid && (
              <p className="mt-2 text-sm text-red-600">{nameInvalid.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-5 flex-1">
            <label className="block mb-2 text-sm font-medium text-budiluhur-700/80">
              Description
            </label>
            <input
              type="text"
              name="description"
              defaultValue={dtCourse?.description}
              placeholder="Input description"
              className={`w-full max-w-lg p-2.5 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
                descriptionInvalid?.invalid
                  ? "bg-red-100 border-red-600 text-red-700"
                  : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
              }`}
              onChange={() =>
                setDescriptionInvalid({ invalid: false, message: "" })
              }
            />
            {descriptionInvalid?.invalid && (
              <p className="mt-2 text-sm text-red-600">
                {descriptionInvalid.message}
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

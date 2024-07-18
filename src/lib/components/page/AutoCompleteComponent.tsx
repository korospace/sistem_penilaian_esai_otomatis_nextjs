// react
import { useEffect, useRef, useState } from "react";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
// types
import { InvalidFieldType, SelectOptionType } from "@/lib/types/ComponentTypes";
import { HttpGetAutocomplete } from "@/lib/services/functions/frontend/autoCompleteFunc";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  apiPath: string;
  value: string;
  tag: string;
  label: string;
  placeholder: string;
  invalid?: InvalidFieldType;
  onSelect: (opt: SelectOptionType) => void;
  onClear?: () => void;
};

export default function AutoCompleteComponent({
  apiPath,
  value,
  tag,
  label,
  placeholder,
  invalid,
  onSelect,
  onClear,
}: Props) {
  // -- Ref --
  const outerDivRef = useRef<HTMLDivElement>(null);

  // -- Use State --
  const [acValue, setAcValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [acList, setAcList] = useState<SelectOptionType[]>([]);
  const [showOpt, setShowOpt] = useState<boolean>(false);

  // -- Use Effect --
  useEffect(() => {
    setAcValue(value);
  }, [value]);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (outerDivRef.current && !outerDivRef.current.contains(event.target)) {
        setShowOpt(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // -- Function --
  const handleOnKeyup = (e: any) => {
    const keyword = e.target.value;

    setShowOpt(false);
    setAcValue(keyword);

    if (keyword === "") {
      onClear ? onClear() : "";
    } else {
      const debouncedFunction = debounce(async () => {
        setLoading(true);
        const res = await HttpGetAutocomplete(
          apiPath + "?keyword=" + keyword,
          tag
        );
        setLoading(false);

        if (res.status === true) {
          setAcList(res.data);
          if (res.data.length > 0) {
            setShowOpt(true);
          } else {
            setShowOpt(false);
          }
        } else {
          toast.error(res.message);
        }
      }, 500);

      debouncedFunction();
    }
  };

  const handleOnSelect = (opt: SelectOptionType) => {
    onSelect(opt);
    setShowOpt(false);
    setAcValue(opt.value);
  };

  return (
    <>
      <label className="block mb-2 text-sm font-medium text-budiluhur-700/80 leading-none">
        {label}
      </label>
      <div ref={outerDivRef} className="relative">
        <input
          type="text"
          value={acValue}
          placeholder={placeholder}
          onChange={handleOnKeyup}
          className={`w-full p-2.5 pr-8 block placeholder-budiluhur-700/50 text-md outline-none rounded-md border ${
            invalid?.invalid
              ? "bg-red-300 border-red-600 text-red-700"
              : "bg-budiluhur-300 border-budiluhur-600 text-budiluhur-700"
          }`}
        />
        <Icon
          icon="eos-icons:loading"
          className={`absolute right-3 top-4 ${loading ? "" : "hidden"}`}
        />
        <Icon
          icon="la:search"
          className={`absolute right-3 top-4 ${loading ? "hidden" : ""}`}
        />
        {showOpt && (
          <div className="absolute translate-y-1 w-full p-2.5 rounded bg-budiluhur-300 border border-budiluhur-700 shadow">
            {acList.map((row, index) => (
              <div
                key={index}
                onClick={() => handleOnSelect(row)}
                className={`px-2.5 py-1.5 cursor-pointer hover:bg-budiluhur-400 rounded-t ${
                  index == acList.length - 1
                    ? ""
                    : "mb-2.5 border-b border-budiluhur-700/50"
                }`}
              >
                {row.value}
              </div>
            ))}
          </div>
        )}
      </div>
      {invalid?.invalid && (
        <p className="mt-2 text-sm text-red-600">{invalid.message}</p>
      )}
    </>
  );
}

// external lib
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  title: string;
  message: string;
  showModal: boolean;
  isLoading: boolean;
  onCancle: () => void;
  onSubmit: () => void;
};

export default function DialogComponent({
  title,
  message,
  showModal,
  isLoading,
  onCancle,
  onSubmit,
}: Props) {
  return (
    <div
      className={`w-full h-full fixed top-0 right-0 left-0 flex justify-center items-center bg-black/60 transition-opacity duration-700 ${
        showModal ? "z-50 opacity-100" : "-z-50 opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-lg p-4 bg-budiluhur-100 rounded-lg shadow transition-all duration-500 ${
          showModal ? "scale-100" : "scale-75"
        }`}
      >
        {/* body */}
        <div className="mb-12 text-budiluhur-700">
          <h3 className="mb-3 text-2xl font-bold">{title}</h3>
          <div
            className="font-light"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>

        {/* footer */}
        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-center text-budiluhur-700 bg-budiluhur-100 hover:bg-budiluhur-200 border-2 border-budiluhur-700 outline-none rounded-lg"
            onClick={onCancle}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-budiluhur-700 hover:bg-budiluhur-800 border-2 border-budiluhur-700 outline-none rounded-lg"
            onClick={onSubmit}
          >
            <Icon
              icon="eos-icons:loading"
              className={`mr-2 ${isLoading ? "" : "hidden"}`}
            />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

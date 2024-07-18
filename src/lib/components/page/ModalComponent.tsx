// external lib
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  title: string;
  showModal: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function ModalComponent({
  title,
  showModal,
  children,
  onClose,
}: Props) {
  return (
    <div
      className={`w-full h-full fixed top-0 right-0 left-0 flex justify-center items-center p-5 bg-black/60 transition-opacity duration-700 overflow-hidden ${
        showModal ? "z-50 opacity-100" : "-z-50 opacity-0"
      }`}
    >
      <div
        className={`w-max w-max-full max-h-full flex flex-col bg-budiluhur-100 rounded-lg shadow transition-all duration-500 ${
          showModal ? "scale-100" : "scale-75"
        }`}
      >
        {/* title */}
        <div className="flex items-center justify-between p-4 border-b border-budiluhur-700/40">
          <h3 className="text-xl font-semibold text-budiluhur-700">{title}</h3>
          <button
            type="button"
            className="flex justify-center items-center w-8 h-8 ms-auto text-budiluhur-700/80 bg-transparent hover:bg-budiluhur-200 hover:text-budiluhur-700 rounded-full"
            onClick={onClose}
          >
            <Icon icon="iconamoon:close" className="text-2xl" />
          </button>
        </div>

        {/* body */}
        <div className="p-4 text-budiluhur-700 flex-1 overflow-auto">
          {children}
        </div>

        {/* footer */}
        <div className="flex justify-end items-center p-4 border-t border-budiluhur-700/40">
          <button
            type="button"
            className="py-2 px-4 text-sm font-medium text-center text-budiluhur-700 bg-budiluhur-100 hover:bg-budiluhur-200 border-2 border-budiluhur-700 outline-none rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

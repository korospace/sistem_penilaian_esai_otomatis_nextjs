// external lib
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  message: string;
  showLoading: boolean;
};

export default function LoadingComponent({ message, showLoading }: Props) {
  return (
    <div
      className={`w-full h-full fixed top-0 right-0 left-0 flex justify-center items-center bg-black/60 transition-opacity duration-700 ${
        showLoading ? "z-50 opacity-100" : "-z-50 opacity-0"
      }`}
    >
      <div
        className={`w-40 py-6 px-4 flex flex-col items-center bg-budiluhur-100 rounded-lg shadow transition-all duration-500 ${
          showLoading ? "scale-100" : "scale-75"
        }`}
      >
        <Icon icon="eos-icons:loading" className="text-4xl" />
        <div
          className="mt-4 text-budiluhur-700 text-xs font-light text-center"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
}

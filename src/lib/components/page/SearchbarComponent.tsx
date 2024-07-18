// external lib
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  className?: string;
  placeholder: string;
  showBtnAdd?: boolean;
  searchOnEnter: (keyword: string) => void;
  btnOnClick: () => void;
  handleButtonExport?: () => void
};

export default function SearchbarComponent({
  className,
  placeholder,
  showBtnAdd,
  searchOnEnter,
  btnOnClick,
  handleButtonExport
}: Props) {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    searchOnEnter(e.target.keyword.value);
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex-1 max-w-lg mr-5 text-budiluhur-700"
      >
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Icon icon="la:search" className="text-2xl" />
        </div>
        <input
          type="text"
          name="keyword"
          placeholder={placeholder}
          className="w-full block ps-11 p-3 bg-budiluhur-300 border border-budiluhur-600 focus:border focus:border-budiluhur-700 placeholder-budiluhur-700/50 text-sm rounded-md outline-none"
        />
      </form>

      <div className="flex gap-1">
        {
          handleButtonExport && (
            <button
              type="button"
              className="flex items-center py-3 px-5 text-sm font-medium focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
              onClick={handleButtonExport}
            >
              <Icon icon="fluent:arrow-download-16-filled" className="mr-2" />
              Download
            </button>
          )
        }

        {showBtnAdd === undefined ||
          (showBtnAdd === true && (
            <button
              type="button"
              className="flex items-center py-3 px-5 text-sm font-medium focus:outline-none bg-budiluhur-700 rounded-md hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
              onClick={btnOnClick}
            >
              <Icon icon="ic:baseline-plus" className="mr-2" />
              Add new
            </button>
          ))}
      </div>
    </div>
  );
}

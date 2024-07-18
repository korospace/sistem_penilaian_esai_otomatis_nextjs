// component
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  page: number;
  totalRow: number;
  totalPage: number;
  prev: () => void;
  next: () => void;
};

export default function PaginationComponent({
  page,
  totalRow,
  totalPage,
  prev,
  next,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-budiluhur-700">
        Showing <span className="font-semibold text-budiluhur-800">{page}</span>{" "}
        to <span className="font-semibold text-budiluhur-800">{totalPage}</span>{" "}
        of <span className="font-semibold text-budiluhur-800">{totalRow}</span>{" "}
        Entries
      </span>
      <div className="flex mt-5">
        <button
          disabled={page == 1}
          onClick={prev}
          className="flex items-center py-1 px-3 text-xs font-medium focus:outline-none bg-budiluhur-700 rounded-l-md hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80"
        >
          <Icon icon="basil:arrow-left-outline" className="text-2xl mr-1" />
          Prev
        </button>
        <button
          disabled={page == totalPage}
          onClick={next}
          className="flex items-center py-1 px-3 text-xs font-medium focus:outline-none bg-budiluhur-700 rounded-r-md hover:bg-budiluhur-700/80 focus:bg-budiluhur-700/80 hover:text-budiluhur-300 text-budiluhur-400 focus:text-budiluhur-400/80 border-0 border-s border-budiluhur-800/60"
        >
          Next
          <Icon
            icon="basil:arrow-left-outline"
            className="text-2xl ml-1 rotate-180"
          />
        </button>
      </div>
    </div>
  );
}

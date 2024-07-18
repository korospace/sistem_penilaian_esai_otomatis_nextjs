// nextjs
import Link from "next/link";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";
// types
import { BreadcrumbItemType } from "@/lib/types/ComponentTypes";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  breadcrumItems: BreadcrumbItemType[];
};

export default function BreadcrumbComponent({ breadcrumItems }: Props) {
  return (
    <nav className="flex px-5 py-3 bg-budiluhur-500 rounded-md shadow">
      <ol className="inline-flex items-center gap-x-2.5">
        {breadcrumItems.map((item, index) => {
          return (
            <li
              key={index}
              className="inline-flex items-center text-budiluhur-700 hover:text-budiluhur-600"
            >
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium"
              >
                <Icon icon={item.icon} className="me-2.5 text-lg" />
                {item.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

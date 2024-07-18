// nextjs
import Link from "next/link";
// external lib
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  href: string;
  icon?: string;
  title: string;
};

export default function SidebarLinkComponent({ href, icon, title }: Props) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center mb-4 p-2 text-budiluhur-400 hover:text-budiluhur-300 bg-budiluhur-600 hover:bg-budiluhur-500 rounded cursor-pointer"
      >
        <Icon
          icon={icon ?? ""}
          className="text-2xl"
          style={{ marginRight: 12 }}
        />
        <span className="">{title}</span>
      </Link>
    </li>
  );
}

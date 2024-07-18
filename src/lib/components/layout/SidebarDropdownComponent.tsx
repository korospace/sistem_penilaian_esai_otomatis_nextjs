import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DropdownChildTypes } from "@/lib/types/ComponentTypes";
import SidebarLinkComponent from "./SidebarLinkComponent";

type Props = {
  icon: string;
  title: string;
  dropdownChild: DropdownChildTypes[];
};

export default function SidebarDropdownComponent({
  icon,
  title,
  dropdownChild,
}: Props) {
  // -- ref --
  const dropdownRef = useRef<HTMLUListElement>(null);

  // -- Use State --
  const [showChild, setShowChild] = useState<boolean>(false);
  const [childHeight, setChildHeight] = useState<number>(0);

  // -- Use Effect --
  useEffect(() => {
    if (showChild && dropdownRef.current) {
      setChildHeight(dropdownRef.current.scrollHeight);
    } else {
      setChildHeight(0);
    }
  }, [showChild]);

  return (
    <>
      <div
        onClick={() => {
          setShowChild(!showChild);
        }}
        className="flex items-center justify-between mb-4 p-2 text-budiluhur-400 hover:text-budiluhur-300 bg-budiluhur-600 hover:bg-budiluhur-500 rounded-sm cursor-pointer"
      >
        <div className="flex items-center">
          <Icon icon={icon} className="text-2xl" />
          <span style={{ marginLeft: 12 }}>{title}</span>
        </div>
        <Icon icon="ep:arrow-down-bold" className="text-lg" />
      </div>
      <ul
        ref={dropdownRef}
        style={{ maxHeight: `${childHeight}px` }}
        className="pl-8 overflow-hidden transition-max-height duration-300"
      >
        {dropdownChild.map((child: DropdownChildTypes, index: number) => (
          <SidebarLinkComponent
            href={child.href}
            title={child.title}
            key={index}
          />
        ))}
      </ul>
    </>
  );
}

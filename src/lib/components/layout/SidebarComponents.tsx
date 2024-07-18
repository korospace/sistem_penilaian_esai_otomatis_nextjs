// react
import { useEffect, useState } from "react";
// nextjs
import { Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
// types
import { SidebarType } from "@/lib/types/ComponentTypes";
import { SessionType } from "@/lib/types/ResultTypes";
// services
import { GetSidebarList } from "@/lib/services/functions/frontend/sidebarFunc";
// component
import SidebarLinkComponent from "./SidebarLinkComponent";
import SidebarDropdownComponent from "./SidebarDropdownComponent";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  showSidebar?: boolean;
};

export default function SidebarComponent({ showSidebar }: Props) {
  // session
  const { data: session, status }: { data: any; status: string } = useSession();

  // -- Use State --
  const [sidebarList, setSidebarList] = useState<SidebarType[]>([]);
  const [dataSession, setDataSession] = useState<SessionType>();

  // -- Use Effect --
  useEffect(() => {
    const list = GetSidebarList();
    setSidebarList(list);
  }, [session]);
  useEffect(() => {
    setDataSession(session);
  }, [session]);

  // -- Function --
  const RoleCheck = (role: number[]): boolean => {
    // return true;
    if (dataSession) {
      return role.includes(dataSession.user.id_user_role);
    } else {
      return false;
    }
  };

  return (
    <aside
      className={`${
        showSidebar ? "w-64" : "w-0 md:w-64"
      } h-full max-h-full bg-budiluhur-700 transition-all overflow-hidden`}
    >
      <ul
        className={`${
          showSidebar ? "opacity-100" : "opacity-0 md:opacity-100"
        } flex flex-col px-3 font-medium transition-all`}
      >
        {sidebarList.map((row: SidebarType, index: number) => {
          if (row.divider === false && RoleCheck(row.role)) {
            if (row.dropdown) {
              return (
                <SidebarDropdownComponent
                  icon={row.icon}
                  title={row.title}
                  dropdownChild={row.dropdownChild ?? []}
                  key={index}
                />
              );
            }

            return (
              <SidebarLinkComponent
                href={row.href!}
                icon={row.icon}
                title={row.title}
                key={index}
              />
            );
          }
        })}
        <div className="mb-4">
          <Divider className="bg-budiluhur-600" />
        </div>
        {sidebarList.map((row: SidebarType, index: number) => {
          if (row.divider === true && RoleCheck(row.role)) {
            return (
              <SidebarLinkComponent
                href={row.href!}
                icon={row.icon}
                title={row.title}
                key={index}
              />
            );
          }
        })}
      </ul>
    </aside>
  );
}

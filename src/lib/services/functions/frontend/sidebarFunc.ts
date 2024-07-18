// types
import { SidebarType } from "@/lib/types/ComponentTypes";

export const GetSidebarList = (): SidebarType[] => {
  return [
    {
      icon: "mage:dashboard-bar-notification",
      title: "Home",
      href: "/dashboard",
      role: [1, 2, 3],
      divider: false,
      dropdown: false,
    },
    {
      icon: "heroicons-solid:user-group",
      title: "User",
      href: "",
      role: [1],
      divider: false,
      dropdown: true,
      dropdownChild: [
        {
          title: "Admin",
          href: "/dashboard/admin",
          role: [1],
        },
        {
          title: "Teacher",
          href: "/dashboard/teacher",
          role: [1],
        },
        {
          title: "Student",
          href: "/dashboard/student",
          role: [1],
        },
      ],
    },
    {
      icon: "healthicons:i-exam-multiple-choice",
      title: "Courses",
      href: "/dashboard/course",
      role: [1],
      divider: false,
      dropdown: false,
    },
    {
      icon: "ph:exam-fill",
      title: "Exam",
      href: "/dashboard/exam",
      role: [1, 2, 3],
      divider: false,
      dropdown: false,
    },
    {
      icon: "tabler:settings-2",
      title: "Profile",
      href: "/dashboard/profile",
      role: [1, 2, 3],
      divider: false,
      dropdown: false,
    },
    {
      icon: "clarity:logout-line",
      title: "Logout",
      href: "/logout",
      role: [1, 2, 3],
      divider: true,
      dropdown: false,
    },
  ];
};

export type DropdownChildTypes = {
  title: string;
  href: string;
  role: number[];
};

export type SidebarType = {
  icon: string;
  title: string;
  href: string;
  role: number[];
  dropdown: boolean;
  divider: boolean;
  dropdownChild?: DropdownChildTypes[];
};

export type BreadcrumbItemType = {
  title: string;
  icon: string;
  href: string;
};

export type InvalidFieldType = {
  invalid: boolean;
  message?: string;
};

export type SelectOptionType = {
  key: string;
  value: string;
};

export type TabBarItemType = {
  key: string;
  icon?: string;
  title: string;
  selected: boolean;
  disable: boolean;
};

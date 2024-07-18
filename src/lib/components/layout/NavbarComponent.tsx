// nextjs
import { Image } from "@nextui-org/react";
// assets
import BudiluhurJpg from "@/assets/images/budiluhur.jpg";
// external lib
import { Icon } from "@iconify/react";
import styled from "styled-components";
import BrandTitileComponent from "../page/BrandTitileComponent";
// component

/**
 * Styled Components
 * -----------------------------------
 */
export const BurgerWraper = styled.span`
  border: 0.6px solid #005473;
`;

/**
 * Props
 * -----------------------------------
 */
type Props = {
  burgerOnClick?: () => void;
};

export default function NavbarComponent({ burgerOnClick }: Props) {
  return (
    <nav className="w-full bg-budiluhur-600 shadow">
      <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Brand */}
        <a href="" className="flex items-center gap-4">
          <div className="p-1 rounded-full bg-white">
            <Image
              src={BudiluhurJpg.src}
              alt="budiluhur logo"
              className="w-5 sm:w-9 rounded-full"
            />
          </div>
          <BrandTitileComponent />
        </a>

        {/* Burger */}
        <BurgerWraper
          onClick={burgerOnClick ? burgerOnClick : () => {}}
          className="w-fit block md:hidden py-0.5 px-1 rounded-sm bg-budiluhur-500 hover:bg-budiluhur-400 transition-all cursor-pointer custom-css"
        >
          <Icon
            icon="iconamoon:menu-burger-horizontal-bold"
            className="text-2xl text-budiluhur-600 hover:text-budiluhur-500 transition-all"
          />
        </BurgerWraper>
      </div>
    </nav>
  );
}

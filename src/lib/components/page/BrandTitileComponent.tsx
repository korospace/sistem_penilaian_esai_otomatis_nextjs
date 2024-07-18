// external lib
import styled from "styled-components";

/**
 * Styled Components
 * -----------------------------------
 */
export const BrandTitle = styled.span`
  text-shadow: -0.6px -0.6px 0 #005473, 0.6px -0.6px 0 #005473,
    -0.6px 0.6px 0 #005473, 0.6px 0.6px 0 #005473;
`;

/**
 * Props
 * -----------------------------------
 */
type Props = {
  classStyle?: string;
};

export default function BrandTitileComponent({ classStyle }: Props) {
  return (
    <BrandTitle
      className={`text-xl sm:text-2xl font-semibold text-budiluhur-100 text-center ${
        classStyle ?? ""
      }`}
    >
      Sistem Penilaian Essay
    </BrandTitle>
  );
}

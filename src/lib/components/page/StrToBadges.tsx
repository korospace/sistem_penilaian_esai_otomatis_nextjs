/**
 * Props
 * -----------------------------------
 */
type Props = {
  str: string;
  delimiter: string;
};

export default function StrToBadges({ str, delimiter }: Props) {
  return (
    <>
      {str.split(delimiter).map((value, index) => (
        <span
          key={index}
          className={`min-w-max inline-flex items-center rounded mr-1 px-2 py-1 text-xs font-medium ring-1 ring-inset bg-budiluhur-200`}
        >
          {value}
        </span>
      ))}
    </>
  );
}

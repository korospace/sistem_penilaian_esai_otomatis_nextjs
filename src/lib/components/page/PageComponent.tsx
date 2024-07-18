// react
import { useEffect } from "react";

/**
 * Props
 * -----------------------------------
 */
type Props = {
  metaTitle: string;
  children: React.ReactNode;
};

export default function PageComponent({ metaTitle, children }: Props) {
  useEffect(() => {
    document.title = metaTitle + " | " + process.env.NEXT_PUBLIC_APP_NAME;
  }, [metaTitle]);

  return <>{children}</>;
}

import { useEffect } from "react";

const BlockRefresh = () => {
  useEffect(() => {
    const blockRefresh = (event: any) => {
      event.preventDefault();
      event.returnValue = ""; // For Chrome
    };

    // Add the event listener when component mounts
    window.addEventListener("beforeunload", blockRefresh);

    // Remove the event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", blockRefresh);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BlockRefresh;

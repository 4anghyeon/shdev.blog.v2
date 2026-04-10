import { useEffect, useState } from "react";

type OSType = "mac" | "window";
interface UserAgent {
  os: OSType;
  isMobileDevice: boolean;
}

export const useUserAgent = (): UserAgent => {
  const [os, setOs] = useState<OSType>("mac");
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent;

      // OS 체크
      if (userAgent.indexOf("Win") !== -1) {
        setOs("window");
      } else if (userAgent.indexOf("Mac") !== -1) {
        setOs("mac");
      }

      // 모바일 체크
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobileDevice(mobileRegex.test(userAgent));
    }
  }, []);

  return { os, isMobileDevice };
};

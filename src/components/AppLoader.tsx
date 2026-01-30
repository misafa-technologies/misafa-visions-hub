import { useState, useEffect, ReactNode } from "react";
import { SpiralLoader } from "./SpiralLoader";

interface AppLoaderProps {
  children: ReactNode;
}

export const AppLoader = ({ children }: AppLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SpiralLoader fullScreen />;
  }

  return <>{children}</>;
};

import { SpiralLoader } from "./SpiralLoader";

interface PageLoaderProps {
  fullScreen?: boolean;
}

export const PageLoader = ({ fullScreen = false }: PageLoaderProps) => {
  return <SpiralLoader fullScreen={fullScreen} />;
};

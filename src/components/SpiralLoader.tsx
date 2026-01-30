import { motion } from "framer-motion";

interface SpiralLoaderProps {
  fullScreen?: boolean;
}

export const SpiralLoader = ({ fullScreen = true }: SpiralLoaderProps) => {
  const spiralDots = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div 
      className={`flex items-center justify-center bg-background ${
        fullScreen ? 'fixed inset-0 z-[100]' : 'w-full h-64'
      }`}
    >
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: 120,
            height: 120,
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Spiral container */}
        <motion.div
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {spiralDots.map((index) => {
            const angle = (index / 12) * 360;
            const radius = 30 + (index * 1.5);
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const size = 8 + (index * 0.5);
            const delay = index * 0.1;
            
            return (
              <motion.div
                key={index}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: '50%',
                  top: '50%',
                  x: x - size / 2,
                  y: y - size / 2,
                  background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
                  boxShadow: '0 0 10px hsl(var(--primary) / 0.5)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.div>
        
        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--primary)))',
            boxShadow: '0 0 20px hsl(var(--primary) / 0.8)',
          }}
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Loading text */}
        <motion.p
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-medium text-primary whitespace-nowrap"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

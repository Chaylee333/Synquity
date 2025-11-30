interface SynquityLogoProps {
  className?: string;
  height?: number;
}

export function SynquityLogo({ className = '', height = 32 }: SynquityLogoProps) {
  // Calculate width based on aspect ratio (approximately 4:1 for the text logo)
  const width = height * 4.5;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 180 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="synquityGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#4B3B8C" />
          <stop offset="35%" stopColor="#7B4B8C" />
          <stop offset="65%" stopColor="#A65B7C" />
          <stop offset="100%" stopColor="#C96B6B" />
        </linearGradient>
      </defs>
      <text 
        x="0" 
        y="32" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="36" 
        fontWeight="700"
        fill="url(#synquityGradient)"
        letterSpacing="-0.5"
      >
        Synquity
      </text>
    </svg>
  );
}


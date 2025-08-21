interface LevitationLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function LevitationLogo({ size = 'md', className = '' }: LevitationLogoProps) {
  const sizeClasses = {
    xs: 'w-6 h-6',   // 24px - very small
    sm: 'w-8 h-8',   // 32px - small  
    md: 'w-10 h-10', // 40px - medium (default, bigger than before)
    lg: 'w-12 h-12', // 48px - large
    xl: 'w-16 h-16'  // 64px - extra large
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Hexagon background */}
        <path
          d="M16 2L26.392 8V24L16 30L5.608 24V8L16 2Z"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="0.9"
        />
        
        
      </svg>
    </div>
  );
}

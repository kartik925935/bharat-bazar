import { cn } from '@/lib/utils/cn';

export function Spinner({
  className,
  size = 'md',
  ...props
}: { size?: 'sm' | 'md' | 'lg' } & React.HTMLAttributes<HTMLDivElement>) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-[2px]',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-[4px]',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-[#E5E4DE] border-t-[#FF7A00]',
        sizeClasses[size],
        className
      )}
      style={{ borderStyle: 'solid' }}
      {...props}
    />
  );
}
export default Spinner;

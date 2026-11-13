interface PondoMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<NonNullable<PondoMarkProps['size']>, string> = {
  sm: 'w-8 h-8 rounded-lg text-lg',
  md: 'w-10 h-10 rounded-xl text-[1.35rem]',
  lg: 'w-14 h-14 rounded-2xl text-4xl',
  xl: 'w-20 h-20 rounded-[1.4rem] text-6xl',
};

/**
 * PONDO brand mark — terracotta rounded square with the lowercase "p" glyph.
 */
export default function PondoMark({ size = 'md' }: PondoMarkProps) {
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center ring-1 ring-inset ring-black/10 shrink-0`}
    >
      <span className="font-black leading-none text-canvas-deep select-none -mt-1">
        p
      </span>
    </div>
  );
}

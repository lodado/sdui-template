/**
 * Motion class fragments — composed inside each *-variants.ts.
 * Change duration/easing values only in @lodado/sdui-design-files motion.css tokens.
 *
 * Tailwind arbitrary values turn `_` into a space, so
 * `animate-[sdui-pop-in_var(--motion-duration-medium)_var(--motion-ease-out)]`
 * compiles to `animation: sdui-pop-in var(--motion-duration-medium) var(--motion-ease-out)`.
 */
export const MOTION = {
  /** floating surface enter/exit — requires Radix data-state */
  surface: [
    'data-[state=open]:animate-[sdui-pop-in_var(--motion-duration-medium)_var(--motion-ease-out)]',
    'data-[state=closed]:animate-[sdui-pop-out_var(--motion-duration-fast)_var(--motion-ease-in)]',
  ].join(' '),
  /** overlay (blanket) fade */
  overlay: [
    'data-[state=open]:animate-[sdui-fade-in_var(--motion-duration-slow)_var(--motion-ease-out)]',
    'data-[state=closed]:animate-[sdui-fade-out_var(--motion-duration-medium)_var(--motion-ease-in)]',
  ].join(' '),
  /** hover/active color transition */
  colors: 'transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-in-out)]',
  /** press feedback — color transition + active scale */
  pressable: [
    'transition-[color,background-color,border-color,box-shadow,transform]',
    'duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)]',
    'active:scale-[0.97]',
  ].join(' '),
} as const

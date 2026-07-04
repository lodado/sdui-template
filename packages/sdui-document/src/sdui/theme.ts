export type CalloutColorTokens = {
  background: string
  border: string
  icon: string
}

export type BlockMapperTheme = {
  fontStack: string
  radius: string
  root: {
    background: string
    textColor: string
    maxWidth: string
  }
  heading: {
    level1: string
    level2: string
    level3: string
    wrapper: string
  }
  paragraph: string
  checklist: {
    wrapper: string
    checkOn: string
    checkOff: string
    checkColor: string
    textOn: string
    textOff: string
  }
  divider: string
  callout: {
    base: string
    toneColors: Record<string, CalloutColorTokens>
    defaultTone: string
  }
  link: string
  image: {
    wrapper: string
    labelClassName: string
    captionClassName: string
  }
  file: {
    wrapper: string
    iconClassName: string
    titleClassName: string
    sizeClassName: string
  }
}

export const outlineTheme: BlockMapperTheme = {
  fontStack: "font-[-apple-system,BlinkMacSystemFont,Inter,'Segoe_UI',Roboto,Oxygen,sans-serif]",
  radius: 'rounded-[6px]',
  root: {
    background: '#FFFFFF',
    textColor: '#111319',
    maxWidth: '760px',
  },
  heading: {
    level1: 'block text-[28px] font-semibold leading-[1.2] text-[#111319]',
    level2: 'block text-[22px] font-semibold leading-[1.25] text-[#111319]',
    level3: 'block text-[18px] font-semibold leading-[1.3] text-[#111319]',
    wrapper: 'py-1',
  },
  paragraph: 'block text-[16px] leading-[1.6] text-[#111319]',
  checklist: {
    wrapper: 'flex items-start gap-2 py-1 text-[16px] leading-[1.6]',
    checkOn: '☑',
    checkOff: '☐',
    checkColor: 'mt-[1px] select-none text-[16px] leading-[1.6] text-[#66778F]',
    textOn: 'leading-[1.6] text-[#66778F] line-through',
    textOff: 'leading-[1.6] text-[#111319]',
  },
  divider: 'my-3 h-px bg-[#DAE1E9]',
  callout: {
    base: 'flex gap-3',
    toneColors: {
      tip: { background: 'bg-[#f5be31]/10', border: 'border-[#f5be31]', icon: 'text-[#f5be31]' },
      warning: { background: 'bg-[#d73a49]/10', border: 'border-[#d73a49]', icon: 'text-[#d73a49]' },
      success: { background: 'bg-[#3ad984]/10', border: 'border-[#3ad984]', icon: 'text-[#3ad984]' },
      info: { background: 'bg-[#3633FF]/10', border: 'border-[#3633FF]', icon: 'text-[#3633FF]' },
    },
    defaultTone: 'info',
  },
  link: 'use-hover-preview cursor-pointer text-[#0366d6] hover:underline',
  image: {
    wrapper: 'p-3',
    labelClassName: 'block text-[14px] leading-[1.5] text-[#394351]',
    captionClassName: 'caption block pt-1 text-[13px] leading-[1.4] text-[#66778F]',
  },
  file: {
    wrapper: 'flex items-center gap-3 px-3 py-2 text-[#111319]',
    iconClassName: 'text-[#66778F]',
    titleClassName: 'leading-[1.5]',
    sizeClassName: 'text-[13px] leading-[1.5] text-[#66778F]',
  },
}

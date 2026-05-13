const theme = {
  colors: {
    primary: {
      DEFAULT: '#0F6E56',
      light: '#1D9E75',
      dark: '#0A5040',
      darker: '#162E24',
    },
    background: {
      page: ['#4A5A56', '#6A7A76', '#5A6A62'],
      shell: ['#E8EDEB', '#ECF0EE', '#F2F5F3', '#EAF2EE'],
    },
    surface: {
      card: 'rgba(255, 255, 255, 0.82)',
      dark: '#162E24',
      muted: '#F0F0EC',
      subtle: '#F5F5F0',
    },
    ink: {
      DEFAULT: '#1A1A1A',
      dark: '#111111',
      mid: '#2D2D2D',
      blend: '#1D2D28',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#555555',
      muted: '#888888',
      light: '#AAAAAA',
      lighter: '#BBBBBB',
    },
    neutral: {
      warm: '#D8D8D0',
      cool: '#C8C8C0',
      pale: '#E5E5DC',
      bone: '#B8B8B0',
    },
    status: {
      success: '#1D9E75',
      warning: '#F5C518',
      danger: '#E53E3E',
      info: '#3B82F6',
    },
  },
  fonts: {
    family: "'Poppins', sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  radius: {
    shell: '28px',
    card: '18px',
    tile: '12px',
    pill: '50px',
    icon: '7px',
  },
  shadows: {
    shell: '0 2px 0 rgba(255,255,255,0.8) inset, 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)',
    card: '0 2px 0 rgba(255,255,255,0.95) inset, 0 4px 16px rgba(0,0,0,0.07)',
    cardDark: '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.25)',
    pillGlass: '0 1px 0 rgba(255,255,255,0.8) inset',
  },
  transitions: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
  },
  zIndex: {
    shell: 0,
    content: 2,
    nav: 10,
    overlay: 20,
    modal: 30,
    toast: 40,
  },
};

export default theme;

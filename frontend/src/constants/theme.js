const theme = {
  colors: {
    primary: "#4A90E2",
    secondary: "#F0F4F8", // Warna input field background
    background: "#F8F9FC", // Warna background utama yang bersih
    card: "#FFFFFF",
    text: "#1A202C",
    textMuted: "#718096",
    border: "#E2E8F0",
    
    // Status
    success: "#38A169", // Hijau
    warning: "#D69E2E", // Kuning/Emas
    danger: "#E53E3E",  // Merah
    info: "#3182CE",    // Biru
    white: "#FFFFFF",
    divider: "#EDF2F7",
  },
  // Tambahan Gradients untuk tampilan modern
  gradients: {
    primary: ['#4A90E2', '#357ABD'], // Biru Header
    cool: ['#667EEA', '#764BA2'],    // Ungu-Biru Keren
    warm: ['#F6AD55', '#ED8936'],    // Oranye (Medium)
    danger: ['#FC8181', '#F56565'],  // Merah (High)
    success: ['#68D391', '#48BB78'], // Hijau (Low/Done)
    secondary: ['#63B3ED', '#4299E1'], // Aksen
  },
  sizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    display: 24,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  radius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    full: 999,
  },
  shadow: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: "#4A90E2",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    }
  },
  text: {
    header: { fontSize: 24, fontWeight: "700", color: "#1A202C" },
    subtitle: { fontSize: 14, color: "#718096" },
  }
};

export default theme;
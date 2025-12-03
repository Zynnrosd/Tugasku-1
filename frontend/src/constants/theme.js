const colors = {
  // Warna Primer (Ungu)
  primary: "#7C3AED", // Ungu utama
  primaryLight: "#EDE7FF", // Ungu sangat muda
  primaryDark: "#5D3FBF",
  secondary: "#A78BFA", // Ungu sekunder
  
  // Warna Status (Sesuai psikologi warna)
  success: "#10B981", // Hijau (Selesai)
  danger: "#EF4444", // Merah (Terlambat/Mendesak)
  warning: "#F59E0B", // Kuning/Jingga (Menengah/Peringatan)
  info: "#5C6BC0", // Biru Kebiruan (Proses/In Progress)

  // Warna Netral & Teks
  background: "#F8F9FC", // Background terang
  card: "#FFFFFF", // Kartu putih
  text: "#1F2937", // Teks gelap
  textMuted: "#6B7280", // Teks abu-abu
  border: '#E5E7EB', // Warna border
  white: "#FFFFFF",
};

const gradients = {
  primary: ["#C4B5FD", "#8B6FD9"],
  softPurple: ["#F3E8FF", "#D9C4FF"],
  deepPurple: ["#A78BFA", "#7C3AED"],
  warm: ["#FDE68A", "#F59E0B"],
  success: ["#A7F3D0", "#34D399"],
  danger: ["#FECACA", "#F87171"],
  cool: ["#A78BFA", "#8B6FD9"],
};

// Skema bayangan (Shadows) untuk tampilan modern
const shadow = {
  small: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};

const theme = {
  colors,
  gradients,
  shadow,
  radius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
  },
};

export default theme;
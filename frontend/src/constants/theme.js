const theme = {
  colors: {
    primary: '#3B82F6',      // Biru Modern (Tailwind Blue-500)
    primaryDark: '#1D4ED8',  // Biru Gelap untuk tombol tekan
    secondary: '#F8FAFC',    // Background Abu-abu sangat muda (Slate-50)
    card: '#FFFFFF',         // Putih bersih
    text: '#1E293B',         // Teks Utama (Slate-800)
    subtext: '#64748B',      // Teks Sekunder (Slate-500)
    border: '#E2E8F0',       // Garis Batas Halus (Slate-200)
    danger: '#EF4444',       // Merah (Red-500)
    success: '#10B981',      // Hijau (Emerald-500)
    warning: '#F59E0B',      // Kuning (Amber-500)
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  text: {
    header: { fontSize: 22, fontWeight: '700', color: '#1E293B', letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
    title: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
    body: { fontSize: 14, color: '#64748B', lineHeight: 20 },
    label: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  },
  radius: {
    s: 8,
    m: 12,
    l: 16, // Standar modern radius
    xl: 24,
  },
  shadow: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
};

export default theme;
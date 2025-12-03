import api from "./api";

const profileService = {
  
  getProfile: async () => {
    try {
      const response = await api.get("/profiles");
      return response.data; 
    } catch (error) {
      console.error("ProfileService: Gagal mengambil profil:", error);
      throw new Error("Gagal terhubung ke server saat mengambil profil.");
    }
  },

  saveProfile: async (data) => {
    try {
      const response = await api.post("/profiles", data);
      return response.data;
    } catch (error) {
      console.error("ProfileService: Gagal menyimpan profil:", error);
      throw new Error("Gagal menyimpan data profil. Cek koneksi server.");
    }
  },

  // FITUR: SIMULASI Upload Avatar
  uploadAvatar: async (localUri, userId) => {
    console.log(`Simulating upload for user ${userId} from URI: ${localUri}`);
    
    const fileName = localUri.split('/').pop() || 'avatar.jpg';
    
    // Simulasikan URL publik yang unik
    const simulatedPublicUrl = `https://mysupabase.com/storage/avatars/${userId}/${fileName}?t=${new Date().getTime()}`;
    
    // Simulasikan waktu upload
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    return simulatedPublicUrl;
  }
};

export default profileService;
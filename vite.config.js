import { defineConfig } from 'vite';
export default defineConfig({
    root: 'src', // Vite'nin proje kök dizini olarak 'src' klasörünü kullanmasını sağlar
    server: {
        open: true, // tarayıcı başlat
        port: 5173, // port ayarla
        cors: true, // dış bağlantıları kontrol et
    },
    build: {
        outDir: '../dist', // Çıktıyı proje kökünde 'dist' klasörüne alır
        emptyOutDir: true,
    },
    define: {
        global: {},
    },
});
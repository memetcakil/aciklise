const sharp = require('sharp');

async function processImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            // Yeni boyutlara yeniden boyutlandır (kullanıcı zaten kırpmış olacak)
            .resize(394, 512, {
                fit: 'fill'
            })
            // DPI ayarı ve JPEG çıktısı
            .jpeg({
                quality: 100,
                density: 400   // 400 DPI
            })
            .toFile(outputPath);

        console.log('Görüntü başarıyla işlendi');
    } catch (error) {
        console.error('Görüntü işlenirken hata oluştu:', error);
        throw error;
    }
}

// Fonksiyonu dışa aktarın
module.exports = {
    processImage
}; 
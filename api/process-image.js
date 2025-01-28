const sharp = require('sharp');
const { join } = require('path');
const fs = require('fs').promises;

async function processImage(buffer) {
    try {
        return await sharp(buffer)
            .resize(394, 512, {
                fit: 'fill'
            })
            .jpeg({
                quality: 100,
                density: 400
            })
            .toBuffer();
    } catch (error) {
        console.error('Görüntü işlenirken hata oluştu:', error);
        throw error;
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Multipart form-data'dan buffer'ı al
        const chunks = [];
        for await (const chunk of req.body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Görüntüyü işle
        const processedBuffer = await processImage(buffer);

        // Response headers
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'attachment; filename=processed.jpg');
        
        // İşlenmiş görüntüyü gönder
        res.send(processedBuffer);

    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ error: 'Görüntü işlenirken bir hata oluştu' });
    }
}; 
const sharp = require('sharp');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Raw body'yi al
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        if (!buffer || buffer.length === 0) {
            return res.status(400).json({ 
                error: 'Geçersiz görüntü verisi',
                details: 'Görüntü verisi bulunamadı' 
            });
        }

        // Görüntüyü işle
        const processedBuffer = await sharp(buffer, {
            failOnError: false // Hatalı görüntüleri tolere et
        })
        .resize(394, 512, {
            fit: 'fill',
            withoutEnlargement: false
        })
        .jpeg({
            quality: 100,
            chromaSubsampling: '4:4:4',
            force: true // JPEG çıktısını zorla
        })
        .toBuffer();

        // Response headers
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Disposition', 'attachment; filename=processed.jpg');
        
        // İşlenmiş görüntüyü gönder
        return res.status(200).send(processedBuffer);

    } catch (error) {
        console.error('Hata detayı:', error);
        return res.status(500).json({ 
            error: 'Görüntü işlenirken bir hata oluştu',
            details: error.message 
        });
    }
}; 
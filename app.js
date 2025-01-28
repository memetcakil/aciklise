const express = require('express');
const multer = require('multer');
const { processImage } = require('./image-processor');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Gerekli klasörleri oluştur
['uploads', 'processed'].forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
});

// HTML dosyasını sunmak için statik middleware ekleyin
app.use(express.static('.'));

app.post('/process-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Lütfen bir görüntü yükleyin' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join('processed', `${Date.now()}.jpg`);

    try {
        await processImage(inputPath, outputPath);
        res.download(outputPath);
    } catch (error) {
        res.status(500).json({ error: 'Görüntü işlenirken bir hata oluştu' });
    }
});

app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
}); 
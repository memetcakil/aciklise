const { processImage } = require('./image-processor');

// Kullanım örneği
processImage('input.jpg', 'output.jpg')
    .then(() => console.log('İşlem tamamlandı'))
    .catch(err => console.error('Hata:', err)); 
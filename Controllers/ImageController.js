// import sharp from 'sharp'
const sharp = require('sharp')


const getQualityFromTargetSize = (targetSizeKB) => {
    
    if (targetSizeKB < 50) return 30;    
    if (targetSizeKB < 150) return 60;
    if (targetSizeKB < 500) return 85;   
    if (targetSizeKB >= 500) return 98;  
    return 80; 
}

const resizeImage = async (req,res) =>{
  
    const { width: widthStr, height: heightStr, size: sizeStr } = req.body

    if (!req.file) {
        return res.status(400).send("Image file missing from upload.");
    }
    
    const imageBuffer = req.file.buffer;

    const originalFormat = req.file.mimetype.split('/')[1] || 'jpeg';

   
    const width = parseInt(widthStr);
    const height = parseInt(heightStr);
    const targetSizeKB = parseInt(sizeStr); 

    if (!width || !height) {
        return res.status(400).send("Width and Height are missing or invalid.");
    }

    try {
        let pipeline = sharp(imageBuffer);
        

        pipeline = pipeline.resize(width, height);

      
        if (targetSizeKB && targetSizeKB > 0) {
            const quality = getQualityFromTargetSize(targetSizeKB);
            
            if (originalFormat === 'jpeg' || originalFormat === 'jpg') {
                pipeline = pipeline.jpeg({ quality: quality, progressive: true });
            } else if (originalFormat === 'png') {
     
                const compressionLevel = Math.min(9, Math.floor((100 - quality) / 10)); 
                pipeline = pipeline.png({ compressionLevel: compressionLevel });
            } else {
                pipeline = pipeline.toFormat(originalFormat, { quality: quality });
            }
        }
        

        const resizedBuffer = await pipeline.toBuffer()
        res.set('Content-Type', req.file.mimetype); 
  
        res.set('Content-Disposition', `attachment; filename="resized_${Date.now()}.${originalFormat}"`);
        res.send(resizedBuffer);

    } catch (error) {
        console.error("Image processing error:", error.message);
        res.status(500).send("Error processing image.");
    }
}

module.exports= resizeImage
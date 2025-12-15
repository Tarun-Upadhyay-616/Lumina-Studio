import express from 'express'
import sharp from 'sharp'
import fs from 'fs/promises'
import { ImageArifact } from '../Models/ImageArtifact.js'
import path from 'path' 
import { fileURLToPath } from 'url' 
import { dirname } from 'path'     

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
const saveImage = async (buffer, filename) => {
    const filePath = path.join(UPLOAD_DIR, filename)
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    await fs.writeFile(filePath, buffer)
    return `/uploads/${filename}` 
}

export const resizeImage =  async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        const { resizeType, width, height, targetSizeKB } = req.body
        const originalFileBuffer = req.file.buffer
        const originalFilename = req.file.originalname
        const originalExt = path.extname(originalFilename).toLowerCase()

        const originalMetadata = await sharp(originalFileBuffer).metadata()
        const originalWidth = originalMetadata.width
        const originalHeight = originalMetadata.height

        let resizedFileBuffer = originalFileBuffer
        let resizedFilename = `resized-${Date.now()}${originalExt}`
        let resizedSize = originalFileBuffer.length / 1024 // KB
        let resizeParams = {}
        const targetKB = parseInt(targetSizeKB)

        if (resizeType === 'dimension') {
            const targetWidth = parseInt(width);
            const targetHeight = parseInt(height);

            if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
                return res.status(400).json({ message: 'Invalid width or height for dimension resize.' });
            }

            // Sharp will resize to fit within the box while maintaining aspect ratio
            resizedFileBuffer = await sharp(originalFileBuffer)
                .resize(targetWidth, targetHeight, { fit: 'fill' }) 
                .toBuffer();

            resizedSize = resizedFileBuffer.length / 1024; // KB
            resizeParams = { width: targetWidth, height: targetHeight };

        }
        else if (resizeType === 'size') {
            if (isNaN(targetKB) || targetKB <= 0) {
                return res.status(400).json({ message: 'Invalid target size for size resize.' })
            }

            let currentBuffer = originalFileBuffer
            let currentSize = originalFileBuffer.length / 1024
            let finalQuality = 90
            let finalWidth = originalWidth
            let finalHeight = originalHeight
            let sharpPipeline = sharp(originalFileBuffer)

            if (targetKB < currentSize) {
                console.log('Target is smaller: Applying compression (quality reduction).')

                let quality = 90
                let maxIterations = 10
                
                if (['.jpg', '.jpeg', '.webp'].includes(originalExt)) {
                    for (let i = 0; i < maxIterations; i++) {
                        if (currentSize <= targetKB) break
    
                        quality -= 10
                        if (quality < 10) quality = 10 
    
                        sharpPipeline = sharp(originalFileBuffer)
                        if (originalExt === '.jpeg' || originalExt === '.jpg') {
                            currentBuffer = await sharpPipeline.jpeg({ quality: quality, progressive: true }).toBuffer()
                        } else if (originalExt === '.webp') {
                            currentBuffer = await sharpPipeline.webp({ quality: quality }).toBuffer()
                        }
                        
                        currentSize = currentBuffer.length / 1024
                        finalQuality = quality

                        if (quality === 10 && currentSize > targetKB) {
                            console.log("Warning: Max compression reached, target size not met.")
                            break
                        }
                    }
                } else {
                     // For lossless formats (PNG/GIF), we cannot reduce size via quality
                     console.log("Warning: Size reduction limited for lossless format (PNG/GIF).")
                     currentBuffer = await sharp(originalFileBuffer).toBuffer()
                }

            // --- SCENARIO 2: Target Size is LARGER than Original (Stretching/Upscaling) ---
            } else if (targetKB > currentSize) {
                console.log('Target is larger: Applying stretching (upscaling dimensions).')
                
                // We will iteratively increase dimensions by a small factor until the size is met
                let scaleFactor = 1.05 // Increase by 5% per iteration
                let maxIterations = 10 // Cap to prevent excessive stretching

                for (let i = 0 ;i < maxIterations ;i++) {
                    if (currentSize >= targetKB) break

                    finalWidth = Math.round(finalWidth * scaleFactor)
                    finalHeight = Math.round(finalHeight * scaleFactor)

                    sharpPipeline = sharp(originalFileBuffer).resize(finalWidth, finalHeight, { fit: 'contain' })
                    
                    // Re-compress at high quality to get the new, larger file size
                    if (originalExt === '.jpeg' || originalExt === '.jpg') {
                        currentBuffer = await sharpPipeline.jpeg({ quality: 90 }).toBuffer()
                    } else if (originalExt === '.webp') {
                        currentBuffer = await sharpPipeline.webp({ quality: 90 }).toBuffer()
                    } else { // PNG/GIF
                        currentBuffer = await sharpPipeline.toBuffer()
                    }

                    currentSize = currentBuffer.length / 1024

                    if (i === maxIterations - 1 && currentSize < targetKB) {
                         console.log("Warning: Max stretch reached, target size not met.")
                    }
                }
            } else {
                // Target KB is equal to current size
                 console.log('Target size is equal to original size. No action taken.')
            }

            // Final Assignment after processing
            resizedFileBuffer = currentBuffer
            resizedSize = currentSize
            resizeParams = { 
                targetSizeKB: targetKB, 
                finalQuality: finalQuality, 
                finalDimensions: { width: finalWidth, height: finalHeight }
            }

        } else {
            return res.status(400).json({ message: 'Invalid resize type specified.' })
        }
    


        const originalURL = await saveImage(originalFileBuffer, originalFilename)
        const resizedURL = await saveImage(resizedFileBuffer, resizedFilename)

        const newImage = new ImageArifact({
            originalName: originalFilename,
            originalSizeKB: originalFileBuffer.length / 1024,
            originalURL: originalURL,
            
            resizedName: resizedFilename,
            resizedSizeKB: resizedSize,
            resizedURL: resizedURL,

            resizeType: resizeType,
            resizeParams: resizeParams
        })
        await newImage.save()

        res.status(200).json({ 
            message: 'Image resized and data saved successfully.',
            data: newImage
        })

    } catch (error) {
        console.error('Error during file processing:', error)
        res.status(500).send('Internal Server Error.')
    }
}

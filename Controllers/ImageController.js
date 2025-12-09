import sharp from 'sharp'


export const resizeImage = async (req,res) =>{
    const {width,height ,size} = req.body
    const sizeInKb = size * 1024
    const image = req.file.buffer
    if(!width || !height){
        return res.status(400).send("Width and Height are missing")
    }
    try {
        const processedImage = await sharp(image).resize(width,height)
        console.log(processedImage)
        const fullyProcessedImage = sharp(processedImage).resize(sizeInKb)

        return {fullyProcessedImage}
    } catch (error) {
        console.log(error.message)
    }

}
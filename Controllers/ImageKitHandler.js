const { ImageKit } = require("@imagekit/nodejs")
const dotenv = require("dotenv")
dotenv.config()
const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT 
})


const ImageKitHandler = (req, res)=>{
    const { token, expire, signature } = client.helper.getAuthenticationParameters();
    res.send({
        token,
        expire,
        signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY, 
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT 
    })
}

module.exports = ImageKitHandler
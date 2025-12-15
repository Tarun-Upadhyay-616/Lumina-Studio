import {mongoose , Schema} from "mongoose"

const imageArtifactSchema = new Schema({
    originalName: {
        type: String,
        required: true
    },
    originalSizeKB: { 
        type: Number, 
        required: true 
    },
    originalURL: { 
        type: String, 
        required: true 
    },

    resizedName: { 
        type: String,
        required: true 
    },
    resizedSizeKB: { 
        type: Number, 
        required: true 
    },
    resizedURL: { 
        type: String, 
        required: true 
    },
    resizeType: { 
        type: String, 
        enum: ['dimension', 'size'], 
        required: true 
    },
    resizeParams: {
        width: { type: Number },
        height: { type: Number },
        targetSizeKB: { type: Number }
    },
    uploadedAt: { type: Date, default: Date.now }
});

export const ImageArifact = mongoose.model('ImageArtifact', imageArtifactSchema);

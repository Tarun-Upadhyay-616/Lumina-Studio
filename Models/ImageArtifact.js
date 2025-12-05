import mongoose from "mongoose"
const { Schema } = mongoose;

const imageArtifactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    originalUrl: {
        type: String,
        required: true
        // URL from Cloudinary/Firebase Storage/etc.
    },
    editedUrl: {
        type: String,
        required: true
        // URL of the final edited image
    },
    prompt: {
        type: String,
        default: ''
    },
    editType: {
        type: String,
        required: true,
        enum: [
            'BG_REMOVE', 'COLORIZE', 'OBJECT_REMOVE', 'UPSCALE',
            'STYLE_TRANSFER', 'GENERATIVE_FILL', 'CAPTIONING'
        ]
    },
    creditCost: {
        type: Number,
        required: true,
        default: 1 
    },
    isPrivate: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true
});

export const ImageArifact = mongoose.model('ImageArtifact', imageArtifactSchema);

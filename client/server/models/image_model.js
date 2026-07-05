import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'myuser',
        required: true
    },
    imageKey: {
        type: String,
        required: true
    },
    food_name: {
        type: String,
        required: true,
        trim: true,
    },
    estimated_weight_g: {
        type: Number,
        required: true,
        min: 0,
    },
    calories: {
        type: Number,
        required: true,
        min: 0,
    },
    protein_g: {
        type: Number,
        required: true,
        min: 0,
    },
    carbohydrates_g: {
        type: Number,
        required: true,
        min: 0,
    },
    fat_g: {
        type: Number,
        required: true,
        min: 0,
    },
    fiber_g: {
        type: Number,
        required: true,
        min: 0,
    },
    sugar_g: {
        type: Number,
        required: true,
        min: 0,
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
}, { timestamps: true })

const ImageModel = mongoose.model("imageProtein", imageSchema);

export default ImageModel;
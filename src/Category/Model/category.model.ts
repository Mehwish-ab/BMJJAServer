import * as mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true, // Ensures each category name is unique
    },
    subcategories: {
        type: [String], // Array of strings for subcategories
        default: [],    // Default to an empty array if no subcategories are provided
    },
});

// Create an interface that matches the new schema
export interface CategoryInterface extends mongoose.Document {
    category: string;
    subcategories: string[];
}

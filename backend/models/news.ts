import mongoose, { Document } from 'mongoose';

/**
 * @typedef News
 * @property {string} author.required - Author of the news
 * @property {string} url.required - URL of the news
 */

interface NewsDocument extends Document {
    author: string;
    url: string;
}

const uri: string = "mongodb://localhost:27017/communityFactChecker"

try {
    mongoose.connect(uri);
} catch (error) {
    console.log(error);
}

const newsSchema = new mongoose.Schema<NewsDocument>({
    author: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
});

const NewsModel = mongoose.model<NewsDocument>("News", newsSchema);
export {NewsDocument, newsSchema, NewsModel};
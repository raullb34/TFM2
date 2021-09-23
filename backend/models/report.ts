import mongoose, { Document } from 'mongoose';
import {UserDocument} from './user';
import {NewsDocument} from './news';

/**
 * @typedef Report
 * @property {string} authorId.required - Author ID of the news
 * @property {string} newsId.required - News ID
 * @property {string} date - Date of the report
 * @property {string} tags.required - Tags identifier of the news
 * @property {string} shared - Was the news shared? 
 * @property {string} fake.required - It's a fake for user
 */

interface ReportDocument extends Document {
    authorId: mongoose.Schema.Types.ObjectId;
    newsId: mongoose.Schema.Types.ObjectId;
    date: Date;
    tags: Array<String>;
    shared: string;
    fake: boolean
}

const uri: string = "mongodb://localhost:27017/communityFactChecker"

try {
    mongoose.connect(uri);
} catch (error) {
    console.log(error);
}

const reportSchema = new mongoose.Schema<ReportDocument>({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    date:{
        type: Date,
    },
    tags:{
        type: [],
        required: true
    },
    shared: {
        type: String,
        enum: ['SHARED', 'NOT SHARED', 'SHARED WITH REPORT'],
        default: 'NOT SHARED',
    },
    fake:{
        type: Boolean,
        required: true
    }
});

reportSchema.pre('save',function(next) {
    var self = this;
    self.date = new Date();
    next();
});

const ReportModel = mongoose.model<ReportDocument>("Report", reportSchema);

export {ReportDocument, reportSchema, ReportModel};
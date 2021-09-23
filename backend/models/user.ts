import mongoose, { ConnectOptions, Document } from 'mongoose';
import {ReportDocument} from './report';

/**
 * @typedef User
 * @property {string} name.required - username
 * @property {string} password.required - password
 * @property {string} reports - Array of reports
 */

interface UserDocument extends Document {
    name: string;
    password: string;
    reports: ReportDocument[];
}

const uri: string = "mongodb://localhost:27017/communityFactChecker"

try {
    mongoose.connect(uri);
} catch (error) {
    console.log(error);
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    reports: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"Report",
    }
});;
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export { UserDocument, userSchema, UserModel};

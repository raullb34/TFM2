import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel, UserDocument } from '../models/user';
import { ReportModel, ReportDocument } from '../models/report';


const getReport = async (id: string): Promise<ReportDocument> => {
    var report = await ReportModel.findById(id).exec();
    return report ? Promise.resolve(report) : Promise.reject();
}

const getReportByUser = async (userId: string): Promise<ReportDocument[]> => {
    var report = await ReportModel.find({authorId: userId as unknown as mongoose.Schema.Types.ObjectId}).exec();
    return report ? Promise.resolve(report) : Promise.reject();
}

const getAllReports = async (): Promise<ReportDocument[]> => {
    var report = await ReportModel.find({}).exec();
    return report ? Promise.resolve(report) : Promise.reject();
}

const postReport = async (authorId: mongoose.Schema.Types.ObjectId, newsId: mongoose.Schema.Types.ObjectId, tags: Array<string>, fake: Boolean): Promise<ReportDocument> => {
    try {
        if (authorId != undefined && newsId != undefined) {
            var createdReport = new ReportModel({ authorId: authorId, newsId: newsId, tags: tags, fake: fake });
            if (createdReport) {
                return createdReport.save().then((result) => {
                    return result ? Promise.resolve(result) : Promise.reject(result);
                })
                    .catch((err) => {
                        return Promise.reject(err);
                    })
            }
            else {
                return Promise.reject(createdReport);
            }
        }
        else {
            return Promise.reject();
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const patchReport = async (authorId: mongoose.Schema.Types.ObjectId, newsId: mongoose.Schema.Types.ObjectId, tags: Array<String>, shared: string): Promise<ReportDocument> => {
    try {
        if (authorId != undefined && newsId != undefined) {
            ReportModel.findOneAndUpdate({ newsId: newsId }, { tags: tags, shared: shared }, { new: true }, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                    return Promise.reject(err);
                }
                return Promise.resolve(doc);
            });
        }
        return Promise.reject();
    } catch (err) {
        return Promise.reject(err);
    }
}

const deleteReport = async (id: string): Promise<any> => {
    var user = await ReportModel.deleteOne({ _id: id }).exec();
    return user ? Promise.resolve(user) : Promise.reject(user);
}

export { getReport, getReportByUser, getAllReports, postReport, patchReport, deleteReport }

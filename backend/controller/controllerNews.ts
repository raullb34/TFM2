import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel, UserDocument } from '../models/user';
import { NewsModel, NewsDocument } from '../models/news';


const getNews =  async (id: string) : Promise<NewsDocument> => {
    var news = await NewsModel.findById(id).exec();
    return news ? Promise.resolve(news) : Promise.reject();
}

const getNewsInfo =  async (author: string) : Promise<NewsDocument[]> => {
    var news = await NewsModel.find({author: author}).exec();
    return news ? Promise.resolve(news) : Promise.reject();
}

const getNewsByUrl =  async (url: string) : Promise<NewsDocument[]> => {
    var news = await NewsModel.find({url: url}).exec();
    return news ? Promise.resolve(news) : Promise.reject();
}

const postNews = async (author: string, url: string) : Promise<NewsDocument> => {
    try {
        if(author != undefined && url != undefined){
            var createdNews = new NewsModel({author: author, url: url});
            console.log(createdNews)
            if(createdNews){
                return createdNews.save().then((result) => {
                    console.log(result);
                    return result ? Promise.resolve(result) : Promise.reject(result);
                })
                .catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                })
            }
            else{
                return Promise.reject(createdNews);
            }
        }
        else{
            return Promise.reject();
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const deleteNews =  async (id: string) : Promise<any> => {
    var user = await NewsModel.deleteOne({_id:id}).exec();
    return user ? Promise.resolve(user) : Promise.reject(user);
}

export {getNews, getNewsInfo, getNewsByUrl, postNews, deleteNews}

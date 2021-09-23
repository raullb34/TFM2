import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel, UserDocument } from '../models/user';


const saltRounds = 10;

const loginUser = async (username : string, passwd : string, callback : (param: any) => void) => {
    var user = await UserModel.findOne({name: username}).exec();
    if(!user) callback(undefined);
    else {
        var passwdIsValid = bcrypt.compareSync(passwd, user.password);
        passwdIsValid ? callback(user) : callback(undefined)
    }
}

const getUser =  async (id: string) : Promise<UserDocument> => {
    var user = await UserModel.findById(id).exec();
    return user ? Promise.resolve(user) : Promise.reject();
}

const postUser = async (name: string, password: string) : Promise<UserDocument> => {
    try {
        if(name != undefined && password != undefined){
            return bcrypt.hash(password, saltRounds).then((hash) =>{
                password = hash;
                var creratedUser = new UserModel({name: name, password: password});
                if(creratedUser){
                    return creratedUser.save().then((result) => {
                        return result ? Promise.resolve(result) : Promise.reject(result);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    })
                }
                else{
                    return Promise.reject(creratedUser);
                }
            })
        }
        else{
            return Promise.reject();
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const deleteUser =  async (id: string) : Promise<any> => {
    var user = await UserModel.deleteOne({_id:id}).exec();
    return user ? Promise.resolve(user) : Promise.reject(user);
}

export {loginUser, getUser, postUser, deleteUser}

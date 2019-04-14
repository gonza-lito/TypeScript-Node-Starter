import { createUseCase } from "../fwk/UseCase";
import { UserModel } from "../models/User";
import { Model } from "mongoose";
import { userInfo } from "os";
import User from "../models/User";

type tUserCreateContext = { userModel: Model<UserModel>, email: string, password: string, createdUser?: UserModel, userExists?: boolean };

export const createUser = createUseCase<tUserCreateContext>()
    .with((usrCreateContext) => {
        return {
            ...usrCreateContext, createdUser: new usrCreateContext.userModel({
                email: usrCreateContext.email,
                password: usrCreateContext.password,
            })
        };
    });



export const checkUserExits = createUseCase<tUserCreateContext>()
    .with(async (usrCreateContext) => {
        const userExists = await usrCreateContext.userModel.findOne({ email: usrCreateContext.email });
        return {
            ...usrCreateContext,
            userExists: !!userExists
        };
    });


export const checkUserExitsAndCreateUser = createUser.with(checkUserExits).with((ctx) => {
    if (ctx.userExists) {
        throw new Error("user.create.user-already-exits");
    }
    return ctx;
}).with(async (ctx) => {
    await ctx.createdUser.save();
    return ctx;
});
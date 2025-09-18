import * as z from "zod";

export const signupSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string().min(4).max(18)
})

export const signinSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

export const itemSchema = z.object({
    name : z.string(),
    initialPrice : z.string(),
    photo : z.string(),
    description : z.string(),
    targetTime : z.string()
})
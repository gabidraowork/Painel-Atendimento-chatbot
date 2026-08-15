import app from "../app.js"
import rateLimit from "express-rate-limit";

const minuteLimit = 15;
export const globalLimiter = rateLimit({
    windowMs: 15* 60 * 1000,
    max: 100,
    message: `Too many requests from his IP, please try again after ${minuteLimit} minutes`,
});


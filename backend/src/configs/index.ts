import dotenv from 'dotenv';

dotenv.config();

export const configs = {
    mongodb_url: process.env.MONGODB_URL!,
    port: process.env.PORT || 3000,
    jwt_secret: process.env.JWT_SECRET
}
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';

import { configs } from './configs/index.js';

const app = express();

app.use(express.json());
app.use(routes);

mongoose.connect(configs.mongodb_url).then(() => {
    console.log('Database connected!');
    
    app.listen(configs.port, () => {
        console.log(`Server is running in http://localhost:${configs.port}`);
    });
}).catch(
    (error) => console.error(`an error occurred while connecting to the database: ${error}`)
);
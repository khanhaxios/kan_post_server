import express from 'express';
import * as mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import {postRouter} from "./controllers/post.controller.js";
import keyRouter from "./controllers/key.controller.js";
import accountRouter from "./controllers/account.controller.js";

const mongoUri = "mongodb+srv://dangkdev:shJm5NEqONoHFaVO@cluster0.y40ogdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// reg router
app.use('/posts', postRouter);
app.use('/keys', keyRouter)
app.use('/accounts', accountRouter);

// handle all error

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8888;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('connect db success')
        app.listen(port, () => {
            console.log('Server is running on port ' + port);
        })
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// exports.api = functions.https.onRequest(app);
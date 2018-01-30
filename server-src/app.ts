import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as path from 'path';
import * as config from 'config';
import * as swaggerUI from 'swagger-ui-express';
import {Application} from 'express';
import {Mongoose} from 'mongoose';
import {MongoError} from 'mongodb';
import {winstonLogger, setupLogging} from './middleware/common/winstonLogger';

class App {
    public app: Application;
    private environmentHost: string = process.env.NODE_ENV || 'Development';

    constructor() {
        this.app = express();
        setupLogging(this.app);
        this.configure();

        // Call Routes: TODO
    }

    configure(): void {
        // Connect to MongoDB
        (mongoose as Mongoose).Promise = global.Promise;

        mongoose
            .connect(process.env.MONGO_URI || config.get('mongo.mongo_uri'))
            .then(App.onMongoConnection)
            .catch(App.onMongoConnectionError);

        // CORS MW
        this.app.use(cors());
        this.app.options('*', cors());

        // Morgan MW
        this.app.use(logger('dev'));

        // BodyParser MW
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false,
            limit: '5mb',
            parameterLimit: 5000
        }));

        // Passport MW: TODO
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // SwaggerUI: TODO
    }

    private static onMongoConnection() {
        winstonLogger.info(
            `-------------
       Connected to Database
      `
        );
    }

    private static onMongoConnectionError(error: MongoError) {
        winstonLogger.error(
            `-------------
       Error on connection to database: ${error}
      `
        );
    }
}

export default new App().app;

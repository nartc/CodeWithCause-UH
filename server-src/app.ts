import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {Application, Request, Response} from 'express';
import * as mongoose from 'mongoose';
import {Connection, Mongoose} from 'mongoose';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as swaggerUI from 'swagger-ui-express';
import {get} from 'config';
import {MongoError} from 'mongodb';
import {setupLogging, winstonLogger} from './middleware/common/winstonLogger';

import {APIDocsRouter} from './middleware/common/Swagger';
import './controllers/UserController';
import './controllers/EntryController';
import './controllers/FarmController';
import './controllers/CropController';
import './controllers/HarvesterController';
import './controllers/OrganizationController';
import './controllers/HarvestController';
import './controllers/ReportingController';
import {RegisterRoutes} from './routes';
import {authenticateUser} from './middleware/security/passport';

class App {
    public mongooseConnection: Connection;
    public app: Application;
    private apiDocsRoutes: APIDocsRouter = new APIDocsRouter();
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

        mongoose.connect(process.env.MONGO_URI || get('mongo.mongo_uri'))
            .then(() => {
                this.mongooseConnection = mongoose.connection;
                App.onMongoConnection();
            })
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

        // Passport MW
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        authenticateUser(passport);

        // SwaggerUI
        this.app.use('/', this.apiDocsRoutes.getRouter());
        this.app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(null, {
            explorer: true,
            swaggerUrl: this.environmentHost === 'Development'
                ? `http://${get('express.host')}:${get('express.port')}/api/docs/swagger.json`
                : `https://${get('express.host')}/api/docs/swagger.json`
        }));

        // Test Index
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Code with a Cause started');
        });

        // Load Routes
        RegisterRoutes(this.app);
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

export default new App();

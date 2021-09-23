import router from './router/';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import config from "./config.json"

const app = express();
const expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'API para verificador de información basado en gamificación e IA',
            title: 'Backend server',
            version: '1.0.0',
        },
        host: `localhost:${config.port}`,
        basePath: config.baseRoute,
        produces: [
            "application/json"
        ],
        schemes: ['http'],
    },
    basedir: __dirname, //app absolute path
    files: ['./models/*.ts', './router/index.ts'] //Path to the API handle folder
};
expressSwagger(options);
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors());
app.use(config.baseRoute, router);
app.use('/static-news', express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static'));
// parse application/x-www-form-urlencoded


let server = http.createServer(app);
server.listen(config.port);

console.log(`API running at port ${config.port}`);
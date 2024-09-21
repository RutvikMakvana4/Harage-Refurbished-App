import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { superAdminUrl, apiBaseUrl } from "./constants/configConstants";

const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yml'));
const routes = express.Router();

if (process.env.ENV !== "production") {
    routes.use('/api/documentation', (req, res, next) => {
        swaggerDocument.servers = [
            {
                url: apiBaseUrl(),
                description: "API base url"
            }, {
                url: superAdminUrl(),
                description: "Super admin url"
            }
        ]
        req.swaggerDoc = swaggerDocument
        next();
    }, swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: "none"
        },
    }))
    
}


module.exports = routes;
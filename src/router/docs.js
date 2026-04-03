import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend Coffeshop",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:8888",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Masukkan JWT token saja (tanpa Bearer)",
                },
            },
        },
    },
    apis: ["./src/router/*.router.js"],
};

const docs = swaggerJSDoc(options);
console.log(JSON.stringify(docs, null, 2));
const docsRouter = Router();
// setup dari docs komentar
docsRouter.use("/", swaggerUi.serve, swaggerUi.setup(docs));

export default docsRouter;

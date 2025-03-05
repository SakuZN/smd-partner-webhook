import * as Fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import logger from "@/util/logger";
import registerRoutes from "@/routes";
import swagger from "@fastify/swagger";
import { DOCUMENTATION, PORT } from "@/config";
const serverOptions: Fastify.FastifyServerOptions = {
    logger: false,
};

//@ts-ignore
const app: Fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> =
    Fastify.fastify(serverOptions);

app.addHook("onRequest", (request, reply, done) => {
    logger.info(`Received ${request.method} request for ${request.url}`);
    done();
});

app.addHook("onResponse", (request, reply, done) => {
    if (reply.statusCode === 200) {
        logger.info(
            `Response sent for ${request.method} ${request.url} with status ${reply.statusCode}`,
        );
    } else {
        logger.error(
            `Response sent for ${request.method} ${request.url} with status ${reply.statusCode}}`,
        );
    }
    done();
});

if (DOCUMENTATION) {
    app
        .register(swagger, {
            openapi: {
                info: {
                    title: "PGP Integration Webhook Backend",
                    description:
                        "API documentation for Payment Gateway Partner Integration Webhook in Typescript and Fastify",
                    version: "1.0.0",
                },
                servers: [
                    {
                        url: `http://localhost:${PORT}`,
                        description: "Development server",
                    },
                ],
                components: {},
            },
        })
        .then(() => {
            registerRoutes(app);
        });
} else {
    registerRoutes(app);
}
export default app;
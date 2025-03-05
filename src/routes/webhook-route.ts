import { FastifyInstance } from "fastify";
import { postWebhookHandler } from "@/controller/webhook";
import { PostWebhookPayload } from "@/routes/schema/webhook";
import { payloadSchema } from "@/routes/schema/ajv/webhook";
import {
  generateJSONResponseSchema,
  typeString,
} from "@/util/fastify-schema-helper";

async function webhookRoute(app: FastifyInstance) {
  app.post<PostWebhookPayload, object>("/webhook", {
    schema: {
      body: payloadSchema,
      response: generateJSONResponseSchema({
        status: typeString,
        message: typeString,
      }),
    },
    handler: postWebhookHandler,
  });
}

export default webhookRoute;

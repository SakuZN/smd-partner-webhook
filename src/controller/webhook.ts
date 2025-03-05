import { FastifyRequest, FastifyReply } from "fastify";
import {PostWebhookPayload} from "@/routes/schema/webhook";
import logDiscord from "@/util/logDiscord";


export const postWebhookHandler = (req: FastifyRequest<PostWebhookPayload>, reply: FastifyReply) => {

    logDiscord(req.body).subscribe({
        next: () => {
            reply.code(200).send({
                message: "Webhook received and Discord notification sent.",
                status_code: 200,
            });
        },
        error: (error) => {
            // Log error (if needed) but still respond with 200
            reply.code(200).send({
                message: "Webhook received, but an error occurred sending Discord notification.",
                status_code: 200,
            });
        },
    });
}
import { FastifyInstance } from "fastify";
import webhookRoute from "@/routes/webhook-route";

const DEFAULT_BASE_URL = "/api";
export default function registerRoutes(fastify: FastifyInstance) {
  fastify.register(webhookRoute, { prefix: DEFAULT_BASE_URL });
}

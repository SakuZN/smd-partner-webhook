import dotenv from "dotenv";
dotenv.config({
    path: ".env",
});

const ENVIRONMENT = process.env.NODE_ENV || "development";
const DOCUMENTATION = process.env.DOCUMENTATION === "true";
const MAINTAINER = process.env.MAINTAINER || "Zach :)";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";


const PORT = Number(process.env.PORT) || 2900;



export {
    ENVIRONMENT,
    DOCUMENTATION,
    MAINTAINER,
    PORT,
    DISCORD_WEBHOOK_URL,
};
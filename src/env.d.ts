// augment process.env
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MINECRAFT_SERVER_IP: string;
            MINECRAFT_SERVER_PORT: string;
            MINECRAFT_DYNMAP_URL: string;
            MINECRAFT_SERVER_NAME: string;
        }
    }
}

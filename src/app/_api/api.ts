import type {
    JavaStatusOptions,
    JavaStatusResponse,
} from 'minecraft-server-util';

import { status } from 'minecraft-server-util';

export const fetchOptions: JavaStatusOptions = {
    enableSRV: false,
    timeout: 1500,
};

export const getServerIp = (): string => {
    const ip = process.env.MINECRAFT_SERVER_IP;
    if (ip === undefined) return '127.0.0.1';
    return ip;
};

const getServerPort = (): number => {
    if (process.env.MINECRAFT_SERVER_PORT === undefined) {
        return 25565;
    }

    const port = parseInt(process.env.MINECRAFT_SERVER_PORT, 10);
    if (Number.isInteger(port)) {
        return port;
    }
    return 25565;
};

export interface StatusResponse {
    status: JavaStatusResponse | string;
    serverName: string | undefined;
    dynmapUrl: string | undefined;
}

const fetchStatus = async (): Promise<StatusResponse> => {
    const serverIp = getServerIp();
    const serverPort = getServerPort();
    console.log(
        typeof window === 'undefined' ? '[SERVER]' : '[CLIENT]',
        'Fetching status from',
        serverIp,
        serverPort,
    );

    try {
        return {
            status: await status(serverIp, serverPort, fetchOptions),
            serverName: process.env.MINECRAFT_SERVER_NAME,
            dynmapUrl: process.env.MINECRAFT_DYNMAP_URL,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: error.message,
                serverName: process.env.MINECRAFT_SERVER_NAME,
                dynmapUrl: process.env.MINECRAFT_DYNMAP_URL,
            };
        }

        return {
            status: 'Unknown error',
            serverName: process.env.MINECRAFT_SERVER_NAME,
            dynmapUrl: process.env.MINECRAFT_DYNMAP_URL,
        };
    }
};

export default fetchStatus;

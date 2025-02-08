import type { NextConfig } from 'next';

import 'dotenv/config';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    devIndicators: {
        appIsrStatus: true,
        buildActivity: true,
        buildActivityPosition: 'bottom-right',
    },
    compiler: {
        ...(process.env.NODE_ENV === 'production'
            ? {
                  removeConsole: true,
                  reactRemoveProperties: true,
              }
            : {}),
    },
};

export default nextConfig;

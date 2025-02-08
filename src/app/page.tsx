import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

import type { FC } from 'react';

import fetchStatus from '@/app/_api/api';

import DynamicServerContent from '@components/DynamicServerContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Home: FC = async () => {
    noStore();

    const initialData = await fetchStatus();

    return (
        <Container
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100vh',
            }}
        >
            <Typography variant="h1" align="center">
                {initialData.serverName}
            </Typography>
            <DynamicServerContent initialData={initialData} />
        </Container>
    );
};

export default Home;

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const status = await fetchStatus();

    if (typeof status.status === 'string') {
        return {
            title: status.status,
            description: status.status,
        };
    }

    return {
        title: status.serverName,
        description: status.status.motd.clean,
        icons: status.status.favicon ?? '/unknown_server.png',
    };
}

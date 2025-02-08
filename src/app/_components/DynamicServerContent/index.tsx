'use client';

import { unstable_noStore as noStore } from 'next/cache';
import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import moment from 'moment';

import type { StatusResponse } from '@/app/_api/api';
import { fetchDataAction } from '@/app/actions';

import PingIcon from '@components/PingIcon';
import MapIcon from '@mui/icons-material/Map';
import { alpha, styled, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import unknownServer from '@public/unknown_server.png';

export interface DynamicServerContentProps {
    initialData: StatusResponse;
}

const minecraftFont = localFont({ src: '/minecraft.otf' });

const StyledBox = styled(Box)(({ theme }) => ({
    // background image
    backgroundImage: 'url(/dirt.png)',
    backgroundSize: 'contain',
    imageRendering: 'pixelated',
    backgroundColor: alpha(theme.palette.common.black, 0.7),
    backgroundBlendMode: 'darken',

    // container
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius * 2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
}));

const DynamicServerContent: FC<DynamicServerContentProps> = ({
    initialData,
}) => {
    noStore();

    const theme = useTheme();

    const [data, setData] = useState<StatusResponse>(initialData);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response = await fetchDataAction();
            setData(response);
            setLastUpdated(Date.now());
        };

        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Box display="flex" flexDirection="column" gap={2}>
                {typeof data.status === 'string' ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography align="center" color="error">
                            Error: {data.status}
                        </Typography>
                    </Box>
                ) : (
                    <StyledBox p={1} borderRadius={2}>
                        <Box
                            display="flex"
                            flexDirection="row"
                            gap={1}
                            flex={1}
                        >
                            {data.status.favicon ? (
                                <Box
                                    sx={{
                                        width: 128,
                                        height: 128,
                                        position: 'relative',
                                    }}
                                >
                                    <Image
                                        src={data.status.favicon}
                                        alt="Minecraft server logo"
                                        fill
                                        style={{
                                            borderRadius:
                                                theme.shape.borderRadius,
                                            boxShadow: theme.shadows[3],
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Image
                                    src={unknownServer}
                                    alt="Minecraft server logo"
                                    style={{
                                        borderRadius: theme.shape.borderRadius,
                                        boxShadow: theme.shadows[3],
                                    }}
                                />
                            )}
                            <Box
                                sx={{
                                    color: theme.palette.common.white,
                                    '& span': {
                                        ...minecraftFont.style,
                                        fontSize: theme.typography.h5.fontSize,
                                    },
                                    letterSpacing: '-0.05em',
                                }}
                                className={minecraftFont.className}
                                flex={1}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="h5"
                                        fontFamily="unset"
                                        sx={{
                                            letterSpacing: '-0.05em',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {data.serverName}
                                    </Typography>
                                    <Box
                                        className={minecraftFont.className}
                                        display="flex"
                                        flexDirection="row"
                                        gap={1}
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="h6"
                                            align="center"
                                            color="common.white"
                                            fontFamily="unset"
                                            sx={{
                                                fontSize: 24,
                                                letterSpacing: '-0.05em',
                                                lineHeight: 1,
                                            }}
                                        >
                                            {data.status.players.online}/
                                            {data.status.players.max}
                                        </Typography>
                                        <Tooltip
                                            title={`${data.status.roundTripLatency}ms`}
                                            arrow
                                            placement="top"
                                        >
                                            <PingIcon
                                                ping={
                                                    data.status.roundTripLatency
                                                }
                                                sx={{
                                                    color: '#0f0',
                                                    fontSize: 24,
                                                }}
                                            />
                                        </Tooltip>
                                    </Box>
                                </Box>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.status.motd.html.replace(
                                            /#FFFFFF/g,
                                            theme.palette.grey[400],
                                        ),
                                    }}
                                    style={{
                                        lineHeight: 1.5,
                                    }}
                                />
                            </Box>
                        </Box>
                    </StyledBox>
                )}
                {data.dynmapUrl ? (
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                    >
                        <Link href={data.dynmapUrl} target="_blank">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ minWidth: 200 }}
                                startIcon={<MapIcon />}
                            >
                                View the map
                            </Button>
                        </Link>
                    </Box>
                ) : null}
            </Box>
            {lastUpdated ? (
                <Box>
                    <Typography
                        variant="subtitle2"
                        align="center"
                        color="textDisabled"
                    >
                        The data was last updated{' '}
                        {moment(lastUpdated).fromNow()} (
                        {moment(lastUpdated).format('HH:mm:ss')})
                    </Typography>
                </Box>
            ) : null}
            {process.env.NODE_ENV === 'development' ? (
                <script type="application/ld+json">
                    {JSON.stringify(data)}
                </script>
            ) : null}
        </Box>
    );
};

export default DynamicServerContent;

export const dynamic = 'force-dynamic';

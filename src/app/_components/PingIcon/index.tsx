import type { SvgIconProps } from '@mui/material';
import type { JavaStatusResponse } from 'minecraft-server-util/src/types/JavaStatusResponse';

import type { FC } from 'react';

import SignalCellular0BarRounded from '@mui/icons-material/SignalCellular0BarRounded';
import SignalCellular1BarRounded from '@mui/icons-material/SignalCellular1BarRounded';
import SignalCellular2BarRounded from '@mui/icons-material/SignalCellular2BarRounded';
import SignalCellular3BarRounded from '@mui/icons-material/SignalCellular3BarRounded';
import SignalCellular4BarRounded from '@mui/icons-material/SignalCellular4BarRounded';

export interface PingIconProps extends SvgIconProps {
    ping: JavaStatusResponse['roundTripLatency'];
}

const PingIcon: FC<PingIconProps> = ({ ping, ...rest }) => {
    if (ping <= 0) {
        return <SignalCellular0BarRounded {...rest} />;
    }
    if (ping <= 50) {
        return <SignalCellular4BarRounded {...rest} />;
    }
    if (ping <= 100) {
        return <SignalCellular3BarRounded {...rest} />;
    }
    if (ping <= 200) {
        return <SignalCellular2BarRounded {...rest} />;
    }
    if (ping <= 300) {
        return <SignalCellular1BarRounded {...rest} />;
    }
    return <SignalCellular0BarRounded {...rest} />;
};

export default PingIcon;

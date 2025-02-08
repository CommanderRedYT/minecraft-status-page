'use server';

import type { StatusResponse } from '@/app/_api/api';
import fetchStatus from '@/app/_api/api';

export async function fetchDataAction(): Promise<StatusResponse> {
    return fetchStatus();
}

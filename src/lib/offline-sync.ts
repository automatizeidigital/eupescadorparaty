import { backendUnavailable } from './backend-reset';
export type SyncOperation = 'SOS' | 'LOCATION' | 'TRIP_END' | 'TRIP_UPDATE';
export interface SyncItem { client_request_id: string; operation_type: SyncOperation; payload: any; priority: number; }
export const offlineSync = {
  enqueue: async (_operation: SyncOperation, _payload: any, _priority = 0) => backendUnavailable(),
  processQueue: async () => {},
};

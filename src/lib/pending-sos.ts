import { backendUnavailable } from './backend-reset';
import type { EmergencyInput } from './emergency.functions';
// Do not queue emergency requests while there is no delivery service.
export async function savePendingSOS(_payload: EmergencyInput) { return backendUnavailable(); }
export async function sendPendingSOS() { return 0; }
export function pendingSOSCount(_userId: string) { return 0; }

// Explicit reset boundary: no network, database client or authenticated user.
export const BACKEND_RESET_MESSAGE = 'Serviço temporariamente indisponível. A nova base está sendo preparada.';
export async function backendUnavailable(): Promise<any> { throw new Error(BACKEND_RESET_MESSAGE); }
export async function getSignedOutSession(): Promise<any> { return { data: { session: null }, error: null }; }
export async function getSignedOutUser(): Promise<any> { return { data: { user: null }, error: null }; }
export async function clearLocalSession() { return { error: null }; }
export function observeSignedOutSession() { return { data: { subscription: { unsubscribe() {} } } }; }

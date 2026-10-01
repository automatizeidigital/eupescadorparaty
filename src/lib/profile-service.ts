import { backendUnavailable } from './backend-reset';
export const profileService = {
  updateMyProfile: async (_values: unknown): Promise<any> => backendUnavailable(),
  getMyProfile: async (): Promise<any> => backendUnavailable(),
};

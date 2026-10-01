import { createServerFn } from "@tanstack/react-start";


export const getMyRoles = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const checkIsMasterAdmin = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const checkIsAdmin = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });



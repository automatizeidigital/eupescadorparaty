
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";

export const getProfile = createServerFn({ method: "GET" })

  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });

export const updateProfile = createServerFn({ method: "POST" })

  .validator((data: unknown) => z.object({
    full_name: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    community: z.string().optional().nullable(),
    locality: z.string().optional().nullable(),
    cpf: z.string().optional().nullable(),
    fishing_type: z.string().optional().nullable(),
    emergency_contact_name: z.string().optional().nullable(),
    emergency_contact_phone: z.string().optional().nullable(),
    emergency_contact_relation: z.string().optional().nullable(),
    avatar_url: z.string().optional().nullable(),
    registration_completed: z.boolean().optional().nullable(),
  }).parse(data))
  .handler(async (): Promise<any> => { throw new Error("Serviço temporariamente indisponível. A nova base está sendo preparada."); });


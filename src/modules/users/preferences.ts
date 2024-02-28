import { z } from "zod";

export const preferencesSchema = z
  .object({
    email: z
      .object({
        trainingRegistration: z.boolean().default(true),
        trainingRegistrationCancelled: z.boolean().default(true),
        trainingCreatedAfterRegistration: z.boolean().default(true),
      })
      .default({}),
  })
  .default({});

import { z } from "zod";

export const preferencesSchema = z
  .object({
    email: z
      .object({
        trainingRequest: z.boolean().default(true),
        trainingRegistration: z.boolean().default(true),
        trainingRegistrationCancelled: z.boolean().default(true),
        trainingCreatedAfterRegistration: z.boolean().default(true),
        trainingCancelled: z.boolean().default(true),
        trainingUpdated: z.boolean().default(true),
      })
      .default({}),
  })
  .default({});

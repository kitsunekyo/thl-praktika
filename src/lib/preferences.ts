import { z } from "zod";

export const preferencesSchema = z.object({
  email: z
    .object({
      // trainer
      trainingRequest: z.boolean().default(true),
      trainingRegistration: z.boolean().default(true),
      trainingRegistrationCancelled: z.boolean().default(true),
      // user
      trainingCreatedAfterRegistration: z.boolean().default(true),
      trainingCancelled: z.boolean().default(true),
      trainingUpdated: z.boolean().default(true),
    })
    .optional()
    .default({
      trainingRequest: true,
      trainingRegistration: true,
      trainingRegistrationCancelled: true,
      trainingCreatedAfterRegistration: true,
      trainingCancelled: true,
      trainingUpdated: true,
    }),
});

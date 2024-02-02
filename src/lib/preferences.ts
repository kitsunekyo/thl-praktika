import { z } from "zod";

const defaultPreferences = {
  email: {
    trainingRequest: true,
    trainingRegistration: true,
    trainingRegistrationCancelled: true,
    trainingCreatedAfterRegistration: true,
    trainingCancelled: true,
    trainingUpdated: true,
  },
};

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
  .nullable()
  .transform((data) => data || defaultPreferences);

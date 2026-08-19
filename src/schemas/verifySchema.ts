import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be at 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only digits"),
});

import { z } from 'zod';

export const AuthUserDto = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string().optional(),
});

export type AuthLoginUserDtoType = z.infer<typeof AuthUserDto>;

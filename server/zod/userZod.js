import zod from 'zod';

export const userSignupZod = zod.object({
  email: zod.string().email(),
  name: zod.string().min(1),
  username: zod.string().min(1),
  password: zod.string().min(6),
  country: zod.string().min(1),
});

export const userLoginZod = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});
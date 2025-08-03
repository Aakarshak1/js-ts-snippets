/**
    Vite exposes env variables under 
     ```import.meta.env```
    object as strings automatically.
*/

import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      description: 'This gets updated depending on your environment',
    })
    .default('development'),
  PORT: z.coerce
    .number({
      description:
        '.env files convert numbers to strings, therefoore we have to enforce them to be numbers',
    })
    .positive()
    .max(65536, `options.port should be >= 0 and < 65536`)
    .default(3000),
  TEST: z
    .string({
      required_error: 'required',
    })
    .min(3, 'Minimum character is 3'),
});

export const env = EnvSchema.safeParse(import.meta.env);
// export const env_two = EnvSchema.parse(import.meta.env);

// with nodejs
// export const env = EnvSchema.parse(process.env);
// export const env_node = EnvSchema.safeParse(process.env);

if (env.success) {
  console.log(env.data.TEST);
} else {
  console.log(env.error.issues);
}

console.log(env.data?.TEST); // return undefined if there is error

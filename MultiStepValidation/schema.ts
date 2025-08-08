// schema.js
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be at least 18'),
});

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(data => console.log(data))}>
  <input {...register("email")} />
  {errors.email && <p>{errors.email.message}</p>}

  <input type="number" {...register("age", { valueAsNumber: true })} />
  {errors.age && <p>{errors.age.message}</p>}

  <button type="submit">Submit</button>
</form>

// Step2.jsx
import { useFormContext } from "react-hook-form";

const Step2 = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label>Email:</label>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
    </div>
  );
};

export default Step2;

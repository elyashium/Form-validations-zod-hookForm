// Step1.jsx
import { useFormContext } from "react-hook-form";

const Step1 = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label>Name:</label>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
    </div>
  );
};

export default Step1;

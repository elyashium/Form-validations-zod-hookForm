// Step3.jsx
import { useFormContext } from "react-hook-form";

const Step3 = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label>Age:</label>
      <input type="number" {...register("age", { valueAsNumber: true })} />
      {errors.age && <p>{errors.age.message}</p>}
    </div>
  );
};

export default Step3;

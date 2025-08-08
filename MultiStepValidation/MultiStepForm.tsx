

// MultiStepForm.tsx

// --- HOOKS & VALIDATION LIBRARIES ---
// 'useForm' is the primary hook from React Hook Form (RHF) to manage form state, validation, and submission.
// 'FormProvider' is a component that uses React's Context API. It allows you to pass all the form methods
// and state down to deeply nested components without having to pass them as props manually. This is crucial
// for clean, multi-step forms where each step is its own component.
import { useForm, FormProvider } from "react-hook-form";

// 'zodResolver' is an adapter that allows React Hook Form to use a Zod schema for validation.
// This is powerful because it lets you define your validation rules in one place (the Zod schema)
// and use them for both form validation and, for instance, server-side validation.
import { zodResolver } from "@hookform/resolvers/zod";

// --- SCHEMA & COMPONENTS ---
// 'formSchema' is a Zod object that defines the shape of our form data and the validation rules for each field.
// For example, it might specify that 'name' is a non-empty string and 'email' must be a valid email address.
import { formSchema } from "./schema";

// Each step of the form is broken into its own component for better organization and reusability.
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

// --- REACT CORE ---
// 'useState' is a fundamental React hook that lets you add state to functional components. We use it
// here to keep track of which step the user is currently on.
import { useState } from "react";

/**
 * An array that holds the titles for each step. This makes it easy to manage
 * step titles and determine the total number of steps in one central place.
 * The index of the array corresponds to the step number (0-indexed).
 */
const steps = ["Basic Info", "Contact", "Age"];

/**
 * The main component that orchestrates the entire multi-step form experience.
 * It manages the overall form state, validation logic, and navigation between steps.
 */
const MultiStepForm = () => {
  /**
   * Initializing React Hook Form.
   * 'methods' is an object containing all the hooks and functions needed to manage the form,
   * such as register, handleSubmit, formState: { errors }, trigger, etc.
   * This object will be passed down to all child components via the FormProvider.
   */
  const methods = useForm({
    // resolver: zodResolver(formSchema) tells RHF to use our Zod schema for all validation.
    resolver: zodResolver(formSchema),

    // mode: "onTouched" tells RHF to trigger validation for a field as soon as the user
    // "touches" it and then blurs (clicks away from) it. This provides instant feedback.
    mode: "onTouched",

    // defaultValues initializes the form fields. This is important for controlled components
    // and ensures the form state is predictable from the start. Setting 'age' to null instead
    // of undefined is a good practice for number inputs that can be empty.
    defaultValues: {
      name: "",
      email: "",
      age: null,
    },
  });

  /**
   * A state variable to keep track of the current step index.
   * We start at 0, which corresponds to the first item in our 'steps' array.
   * 'setStep' is the function we'll use to update this state.
   */
  const [step, setStep] = useState(0);

  /**
   * An asynchronous function to handle the "Next" button click.
   * Its job is to validate ONLY the fields on the current step before allowing the user to proceed.
   */
  const onNext = async () => {
    // This array maps each step index to the field(s) it contains.
    // This is the key to achieving partial validation per step.
    const fieldsPerStep = [
      ["name"],    // Step 0 validates the 'name' field
      ["email"],   // Step 1 validates the 'email' field
      ["age"]      // Step 2 validates the 'age' field
    ];

    // 'methods.trigger()' is a powerful RHF function that manually triggers validation for specific fields.
    // We pass it the array of fields for the current step. It returns a boolean 'true' if validation passes.
    const valid = await methods.trigger(fieldsPerStep[step]);

    // Only if the current step's fields are valid, we advance to the next step.
    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  /**
   * A simple function to handle the "Back" button click.
   * It just decrements the current step index. No validation is needed.
   */
  const onBack = () => setStep((prev) => prev - 1);

  /**
   * This function is called ONLY when the final "Submit" button is clicked AND the entire form
   * (all steps) passes validation according to the schema.
   * The 'handleSubmit' helper from RHF handles this logic for us.
   * @param {object} data - An object containing all the validated form data.
   */
  const onSubmit = (data) => {
    console.log("✅ Final Data:", data);
    alert("Form submitted successfully!");
    // Here you would typically send the 'data' to an API endpoint.
  };

  /**
   * An array of the step components. This allows us to dynamically render the correct
   * component for the current step using its index, e.g., 'stepComponents[step]'.
   * This is cleaner than a long chain of if/else statements or a switch case in the JSX.
   */
  const stepComponents = [<Step1 />, <Step2 />, <Step3 />];

  return (
    // The FormProvider takes the 'methods' object from useForm and makes it available
    // to any descendant component. Any component inside here (like Step1, Step2) can now
    // use hooks like 'useFormContext()' to access everything it needs.
    <FormProvider {...methods}>
      {/* 
        The 'onSubmit' handler is wrapped with 'methods.handleSubmit()'.
        This RHF helper function does two things:
        1. It prevents the default browser form submission behavior.
        2. It runs a full validation of ALL form fields against the Zod schema.
        3. Only if the entire form is valid, it calls our provided 'onSubmit' function with the clean data.
      */}
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ maxWidth: "400px", margin: "auto" }}>
        {/* Dynamically display the current step number and title */}
        <h2>Step {step + 1} of {steps.length}: {steps[step]}</h2>

        {/* This div will contain the content of the currently active step. */}
        <div style={{ marginBottom: 20 }}>
          {/* We render the component for the current step using its index. */}
          {stepComponents[step]}
        </div>

        {/* This div contains the navigation buttons. */}
        <div>
          {/* The "Back" button is only rendered if we are not on the first step (step > 0). */}
          {step > 0 && (
            // IMPORTANT: 'type="button"' prevents this button from accidentally submitting the form.
            <button type="button" onClick={onBack}>
              ⬅ Back
            </button>
          )}

          {/* 
            A ternary operator to conditionally render either the "Next" or "Submit" button.
            If the current step is not the last one, show "Next".
            If it is the last step, show "Submit".
          */}
          {step < steps.length - 1 ? (
            <button type="button" onClick={onNext} style={{ marginLeft: 10 }}>
              Next ➡
            </button>
          ) : (
            // IMPORTANT: This is the only button with 'type="submit"'. Clicking it
            // will trigger the 'methods.handleSubmit(onSubmit)' function on the <form> tag.
            <button type="submit" style={{ marginLeft: 10 }}>
              Submit ✅
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
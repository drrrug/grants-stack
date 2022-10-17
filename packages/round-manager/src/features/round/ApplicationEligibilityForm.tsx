import { FormStepper } from "../common/FormStepper";
import { useContext } from "react";
import { FormContext } from "../common/FormWizard";
import {
  FieldArrayWithId,
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";
import { Round } from "../api/types";
import { Button, Input } from "../common/styles";
import { PlusSmIcon } from "@heroicons/react/solid";

interface ApplicationEligibilityFormProps {
  stepper: typeof FormStepper;
}

export default function ApplicationEligibilityForm(
  props: ApplicationEligibilityFormProps
) {
  const { currentStep, setCurrentStep, stepsCount, formData, setFormData } =
    useContext(FormContext);

  const defaultEligibilityFormData: Round["eligibility"] =
    formData?.eligibility ?? {
      description: "",
      requirements: [{ requirement: "" }], // NB: start with 1 requirement
    };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Round>({
    defaultValues: {
      ...formData,
      eligibility: defaultEligibilityFormData,
    },
  });

  const { fields, append } = useFieldArray({
    name: "eligibility.requirements",
    control,
  });

  const FormStepper = props.stepper;

  const next: SubmitHandler<Round> = async (values) => {
    const data = { ...formData, ...values };
    setFormData(data);
    setCurrentStep(currentStep + 1);
  };
  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-10">
        <LeftSidebar />

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form
            onSubmit={handleSubmit(next)}
            className="shadow-sm text-grey-500"
          >
            <div className="pt-7 pb-10 sm:px-6 bg-white">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <RoundEligibilityQuestion
                    register={register("eligibility.description")}
                    errors={errors}
                    labelText={"Round Description"}
                    inputId={"eligibility.description"}
                    inputPlaceholder={
                      "Enter a short description of your round."
                    }
                  />

                  <DynamicRequirementsForm
                    fields={fields}
                    register={register}
                    append={append}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 align-middle py-3.5 shadow-md">
              <FormStepper
                currentStep={currentStep}
                stepsCount={stepsCount}
                prev={prev}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LeftSidebar() {
  return (
    <div className="md:col-span-1">
      <p className="text-base leading-6">Round Eligibility</p>
      <p
        className="mt-1 text-sm text-grey-400"
        data-testid="round-eligibility-helper-copy"
      >
        Describe the round to applicants and let them know the eligibility
        requirements.
      </p>
    </div>
  );
}

function RoundEligibilityQuestion(props: {
  inputId: string;
  register: UseFormRegisterReturn<string>;
  errors: FieldErrors<Round>;
  labelText: string;
  inputPlaceholder?: string;
}) {
  return (
    <div className="mb-10">
      <label htmlFor={props.inputId} className="block text-sm">
        {props.labelText}
      </label>
      <Input
        {...props.register}
        type="text"
        id={props.inputId}
        placeholder={props.inputPlaceholder}
      />
    </div>
  );
}

function DynamicRequirementsForm(props: {
  fields: FieldArrayWithId<Round, "eligibility.requirements">[];
  register: UseFormRegister<Round>;
  append: (newRequirement: any) => void;
}) {
  const { fields, register, append } = props;
  return (
    <div>
      <p className="text-grey-400 mb-6">
        What requirements do you have for applicants?
      </p>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} className="mb-4">
            <label
              htmlFor={`Requirement ${index + 1}`}
              className="block text-sm"
            >
              {`Requirement ${index + 1}`}
            </label>
            <Input
              {...register(`eligibility.requirements.${index}.requirement`)}
              type="text"
              placeholder="Enter an eligibility requirement."
              data-testid="requirement-input"
            />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        $variant="outline"
        className="inline-flex items-center px-3.5 py-2 border-none shadow-sm text-sm rounded text-violet-500 bg-violet-100"
        onClick={() => {
          append({ requirement: "" });
        }}
      >
        <PlusSmIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        Add A Requirement
      </Button>
    </div>
  );
}
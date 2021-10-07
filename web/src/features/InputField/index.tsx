import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  RadioGroup,
  Radio,
  VStack,
} from "@chakra-ui/react";

export interface durationOption {
  value: string;
  placeholder: string;
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  fontSize: (string | null)[];
  validate?: (value: string) => string | undefined;
  inputType?: "select" | "radio";
  selectOptions?: string[];
  durationOptions?: durationOption[];
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  fontSize,
  inputType,
  selectOptions,
  durationOptions,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel
          htmlFor={field.name}
          fontSize={fontSize}
          textAlign={inputType !== "radio" ? "left" : "center"}
        >
          {label}
        </FormLabel>
      )}
      {inputType === "select" ? (
        <Select
          {...field}
          id={field.name}
          fontSize={fontSize}
          placeholder={props.placeholder}
        >
          {selectOptions?.map((question, key) => (
            <option value={key + 1}>{question}</option>
          ))}
        </Select>
      ) : inputType === "radio" ? (
        <RadioGroup {...field} id={field.name} alignContent="left">
          <VStack align="left">
            {durationOptions?.map(({ value, placeholder }) => (
              <Radio {...field} value={value}>
                {placeholder}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>
      ) : (
        <Input {...field} {...props} id={field.name} fontSize={fontSize} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

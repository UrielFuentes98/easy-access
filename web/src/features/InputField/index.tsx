import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  fontSize: (string | null)[];
  validate?: (value: string) => string | undefined;
  isSelect?: boolean;
  selectOptions?: string[];
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  fontSize,
  isSelect,
  selectOptions,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel htmlFor={field.name} fontSize={fontSize}>
          {label}
        </FormLabel>
      )}
      {!isSelect ? (
        <Input {...field} {...props} id={field.name} fontSize={fontSize} />
      ) : (
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
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

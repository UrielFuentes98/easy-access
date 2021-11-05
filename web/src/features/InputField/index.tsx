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
  Checkbox,
} from "@chakra-ui/react";

export interface durationOption {
  value: string;
  placeholder: string;
}

export interface selectOption {
  key: number;
  value: string;
}

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  fontSize?: (string | null)[];
  validate?: (value: any) => string | undefined;
  inputType?: "select" | "radio" | "check-box" | "file-upload";
  labelPos?: "left" | "center";
  selectOptions?: selectOption[];
  durationOptions?: durationOption[];
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  fontSize,
  labelPos,
  inputType,
  selectOptions,
  durationOptions,
  ...props
}) => {
  const [field, { error, touched }, { setValue }] = useField(props);
  return (
    <FormControl isInvalid={!!error && touched}>
      {label && inputType !== "check-box" && (
        <FormLabel
          htmlFor={field.name}
          fontSize={fontSize}
          textAlign={labelPos}
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
          {selectOptions?.map((question) => (
            <option value={question.key}>{question.value}</option>
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
      ) : inputType === "check-box" ? (
        <Checkbox
          id={field.name}
          isChecked={field.value}
          onChange={field.onChange}
        >
          <FormLabel htmlFor={field.name} fontSize={fontSize} mb={0}>
            {label}
          </FormLabel>
        </Checkbox>
      ) : inputType === "file-upload" ? (
        <Input
          pl={0}
          id={field.name}
          name={field.name}
          onChange={(e) => {
            setValue(e.currentTarget.files![0]);
          }}
          type="file"
          accept=".pdf, .docx, .jpg, .jpeg, .png"
        />
      ) : (
        <Input {...field} {...props} id={field.name} fontSize={fontSize} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

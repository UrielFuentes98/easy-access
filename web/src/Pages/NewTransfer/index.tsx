import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { durationOption, InputField } from "features";
import { useState } from "react";
import { completeUserInfo as POST_UserInfo } from "app/utils/api/user";

export interface NewTransFormVals {
  phrase: string;
  duration: string;
  is_public: boolean;
}

const initialValues: NewTransFormVals = {
  phrase: "",
  duration: "15",
  is_public: false,
};

function validatePhrase(value: string) {
  let error;
  if (!value) {
    error = "You should enter the transfer phrase";
  }
  return error;
}

const durationOptions: durationOption[] = [
  { value: "15", placeholder: "15 minutes" },
  { value: "180", placeholder: "3 hours" },
  { value: "1140", placeholder: "1 day" },
];

function NewTransfer() {
  const history = useHistory();
  const [submitErr, setSubmitErr] = useState(false);
  return (
    <>
      <Box
        w={["2xs", null, "sm"]}
        py={6}
        px={[4, null, 8]}
        rounded={[30, null, 40]}
        bg="white"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values: NewTransFormVals, actions) => {
            alert(JSON.stringify(values, null, 2));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack flexFlow="column" alignItems="center" spacing={3}>
                <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                  New Transfer
                </Text>
                <Text fontSize={["md", null, "xl"]} textAlign="center">
                  Enter the phrase you will use to acces your file(s)
                </Text>
                <InputField
                  name="phrase"
                  placeholder="Transfer phrase"
                  fontSize={["md", null, "xl"]}
                  validate={validatePhrase}
                />
                <InputField
                  name="duration"
                  fontSize={["md", null, "xl"]}
                  inputType="radio"
                  label="Select the duration of the transfer."
                  durationOptions={durationOptions}
                />
                {submitErr && (
                  <Alert status="error" textAlign="center">
                    There was an error processing your request. Please try
                    again.
                  </Alert>
                )}
                <Button type="submit" isLoading={isSubmitting}>
                  Submit
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
}

export default NewTransfer;

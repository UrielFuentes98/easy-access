import { Box, VStack } from "@chakra-ui/layout";
import { Alert, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { durationOption, InputField } from "features";
import { useState } from "react";
import { POST_NewTransfer } from "app/utils/api";

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
            await POST_NewTransfer(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack flexFlow="column" alignItems="center" spacing={5}>
                <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                  New Transfer
                </Text>
                <InputField
                  name="phrase"
                  label="Enter the phrase you will use to access your file(s)"
                  placeholder="Transfer phrase"
                  fontSize={["md", null, "xl"]}
                  validate={validatePhrase}
                  labelPos="center"
                />
                <InputField
                  name="duration"
                  fontSize={["md", null, "xl"]}
                  inputType="radio"
                  label="For how long will it be available?"
                  labelPos="center"
                  durationOptions={durationOptions}
                />
                <Box>
                  <InputField
                    name="is_public"
                    fontSize={["md", null, "xl"]}
                    inputType="check-box"
                    label="This transfer is not for myself."
                  />
                  <Text fontSize={["xs", null, "sm"]}>
                    The public question will be asked.
                  </Text>
                </Box>
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

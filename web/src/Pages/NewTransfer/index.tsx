import { Box, VStack } from "@chakra-ui/layout";
import { Alert, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { durationOption, InputField } from "features";
import { useState } from "react";
import {
  POST_NewTransfer,
  ResponseBody,
  TransferResponse,
} from "app/utils/api";
import { useHistory } from "react-router-dom";
import { POST_SaveFiles } from "app/utils/api";
import { SITE_PATHS } from "app/routes";

export interface NewTransferForm {
  phrase: string;
  duration: string;
  is_public: boolean;
  file: File;
}

const initialValues: NewTransferForm = {
  phrase: "",
  duration: "15",
  is_public: false,
  file: {} as File,
};

function validatePhrase(value: string) {
  let error;
  if (!value) {
    error = "You should enter the transfer phrase";
  }
  return error;
}

function validateFile(value: File) {
  let error;
  if (!value?.name) {
    error = "You should upload a file.";
  }
  return error;
}

const durationOptions: durationOption[] = [
  { value: "15", placeholder: "15 minutes" },
  { value: "180", placeholder: "3 hours" },
  { value: "1440", placeholder: "1 day" },
];

function NewTransfer() {
  const history = useHistory();
  const [submitErr, setSubmitErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
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
          onSubmit={async (values: NewTransferForm, actions) => {
            const transferResponse = await POST_NewTransfer(values);
            if (transferResponse.ok) {
              const newTransferResBody: TransferResponse =
                await transferResponse.json();
              const filesResponse = await POST_SaveFiles(
                values.file,
                newTransferResBody.new_id
              );
              if (filesResponse.ok) {
                history.push(SITE_PATHS.HOME);
              } else {
                const filesResBody: ResponseBody = await filesResponse.json();
                setErrMsg(filesResBody.message);
              }
            } else {
              const body: ResponseBody = await transferResponse.json();
              setErrMsg(body.message);
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
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
                <InputField
                  name="file"
                  inputType="file-upload"
                  label="Add a file to your transfer."
                  validate={validateFile}
                />
                {errMsg && (
                  <Alert status="error" textAlign="center">
                    {errMsg}
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

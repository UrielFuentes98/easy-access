import { Box, VStack } from "@chakra-ui/layout";
import { Alert, Button, Input, Text } from "@chakra-ui/react";
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
import { setNewTransferPhrase, setRecentTransfer } from "./newTransferSlice";
import { useAppDispatch } from "app/hooks";
import UploadedFiles from "./UploadedFiles";

export interface NewTransferForm {
  phrase: string;
  duration: string;
  is_public: boolean;
}

const initialValues: NewTransferForm = {
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
  { value: "1440", placeholder: "1 day" },
];

function NewTransfer() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [files, setFiles] = useState([] as File[]);

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
          onSubmit={async (values: NewTransferForm) => {
            if (files.length > 0) {
              const transferRes = await POST_NewTransfer(values);
              if (transferRes.ok) {
                const newTransResBody: TransferResponse =
                  await transferRes.json();
                const filesTransfered = await POST_SaveFiles(
                  files,
                  newTransResBody.new_id
                );
                if (filesTransfered) {
                  dispatch(setRecentTransfer(true));
                  dispatch(setNewTransferPhrase(values.phrase));
                  history.push(SITE_PATHS.HOME);
                } else {
                  setErrMsg(
                    "There was an error while saving the transfer files."
                  );
                }
              } else {
                const body: ResponseBody = await transferRes.json();
                setErrMsg(body.message);
              }
            } else {
              setErrMsg("You should add files to the transfer.");
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
                  fontSize={{ base: "md", lg: "xl" }}
                  validate={validatePhrase}
                  labelPos="center"
                />
                <InputField
                  name="duration"
                  fontSize={{ base: "md", lg: "xl" }}
                  inputType="radio"
                  label="For how long will it be available?"
                  labelPos="center"
                  durationOptions={durationOptions}
                />
                <Box>
                  <InputField
                    name="is_public"
                    fontSize={{ base: "md", lg: "xl" }}
                    inputType="check-box"
                    label="This transfer is not for myself."
                  />
                  <Text fontSize={["xs", null, "sm"]}>
                    The public question will be asked.
                  </Text>
                </Box>
                <Input
                  pl={0}
                  onChange={(e) => {
                    if (e.currentTarget.files) {
                      const uploadedFiles = Array.from(e.currentTarget.files);
                      const newFiles = files;
                      newFiles.push(...uploadedFiles);
                      setFiles([...newFiles]);
                    }
                    if (files.length > 0) {
                      setErrMsg("");
                    }
                  }}
                  type="file"
                  accept=".pdf, .docx, .jpg, .jpeg, .png"
                  multiple
                />
                <UploadedFiles {...{ files }} {...{ setFiles }} />
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

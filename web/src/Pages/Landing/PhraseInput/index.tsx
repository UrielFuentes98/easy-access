import { Box, VStack } from "@chakra-ui/layout";
import { Alert, Button, Text } from "@chakra-ui/react";
import { useAppDispatch } from "app/hooks";
import { SITE_PATHS } from "app/routes";
import { InputField } from "features";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { GetQuestionRes, GET_QUESTION_KEYS, GET_TransferQuestion } from "./api";
import { setSecretQuestion, setTransferId } from "./transferAccessSlice";

export { selectSecretQuestion } from "./transferAccessSlice";

interface PhraseFormVals {
  phrase: string;
}

const initialValues: PhraseFormVals = {
  phrase: "",
};

function PhraseInput() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [errMsg, setErrMsg] = useState("");

  function validatePhrase(value: string) {
    let error;
    if (!value) {
      error = "You should enter the transfer´s phrase";
    }
    return error;
  }

  return (
    <Box
      w={["2xs", null, "sm"]}
      py={6}
      px={[4, null, 8]}
      rounded={40}
      bg="white"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          const response: GetQuestionRes = await GET_TransferQuestion(
            values.phrase
          );
          if (response.key === GET_QUESTION_KEYS.SUCCESS) {
            dispatch(setTransferId(response.transfer_id));
            dispatch(setSecretQuestion(response.question));
            history.push(SITE_PATHS.QUESTION);
          } else {
            setErrMsg(response.message);
          }
          actions.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack flexFlow="column" alignItems="center" spacing={3}>
              <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                Access Files
              </Text>
              <Text fontSize={["md", null, "xl"]} textAlign="center">
                Enter the phrase to access your files.
              </Text>
              <InputField
                name="phrase"
                placeholder="Enter phrase"
                fontSize={["md", null, "xl"]}
                validate={validatePhrase}
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
  );
}

export default PhraseInput;

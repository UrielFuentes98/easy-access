import { Box, VStack } from "@chakra-ui/layout";
import { Alert, Button, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { SITE_PATHS } from "app/routes";
import { InputField } from "features";
import { Form, Formik } from "formik";
import { selectSecretQuestion } from "Pages/Landing/PhraseInput";
import {
  selectTransferId,
  setTranAccessId,
} from "Pages/Landing/PhraseInput/transferAccessSlice";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { GET_ValdiateAnswer, ValAnswerRes, VAL_ANSWER_KEYS } from "./api";

interface QuestionAsking {
  answer: string;
}

const initialValues: QuestionAsking = {
  answer: "",
};

function Question() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const question = useAppSelector(selectSecretQuestion);
  const transferId = useAppSelector(selectTransferId);
  const [errMsg, setErrMsg] = useState("");

  function validateAnswer(value: string) {
    let error;
    if (!value) {
      error = "You should enter an answer";
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
        onSubmit={async (values) => {
          const response: ValAnswerRes = await GET_ValdiateAnswer(
            transferId,
            values.answer
          );
          if (response.key === VAL_ANSWER_KEYS.SUCCESS) {
            dispatch(setTranAccessId(response.tran_access_id!));
            history.push(SITE_PATHS.GET_TRANSFER);
          } else {
            setErrMsg(response.message);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack flexFlow="column" alignItems="center" spacing={3}>
              <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                Secret Question
              </Text>
              <Text fontSize={{ base: "md", lg: "xl" }} textAlign="center">
                {question}
              </Text>
              <InputField
                name="answer"
                placeholder="Enter your answer"
                fontSize={{ base: "md", lg: "xl" }}
                validate={validateAnswer}
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

export default Question;

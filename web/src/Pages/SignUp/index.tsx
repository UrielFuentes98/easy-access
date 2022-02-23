import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import { Alert, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField } from "features";
import { useEffect, useState } from "react";
import {
  POST_UserInfo,
  GET_SecretQuestions,
  ResponseBody,
  QuestionsResBody,
} from "app/utils/api";
import { MSG_QUES_REQ_ERR, MSG_REQ_ERR } from "app_constants";
import { selectOption } from "features/InputField";
import { SITE_PATHS } from "app/routes";

export interface SignUpFormVals {
  answer_public: string;
  answer_private: string;
  question_public: string;
  question_private: string;
}

const initialValues: SignUpFormVals = {
  answer_public: "",
  answer_private: "",
  question_private: "",
  question_public: "",
};

function validatePrivAnswer(value: string) {
  let error;
  if (!value) {
    error = "You should enter an answer";
  }
  return error;
}

function validatePrivQuestion(value: string) {
  let error;
  if (!value) {
    error = "You should select a question";
  }
  return error;
}

function SignUp() {
  const history = useHistory();
  const [submitErr, setSubmitErr] = useState(false);
  const [secretQuestions, setSecretQuestions] = useState([] as selectOption[]);
  const [questionsErrMsg, setQuestionsErrMsg] = useState("");

  useEffect(() => {
    async function fetchSecretQuestions() {
      try {
        const response = await GET_SecretQuestions();
        if (response.ok) {
          const resBody: QuestionsResBody = await response.json();
          setSecretQuestions(resBody.data);
        } else {
          const resBody: ResponseBody = await response.json();
          setQuestionsErrMsg(resBody.message);
        }
      } catch (err) {
        // @ts-ignore
        console.error(err.message);
        setQuestionsErrMsg(MSG_QUES_REQ_ERR);
      }
    }
    fetchSecretQuestions();
  }, []);

  return (
    <>
      <Text
        fontSize={["xl", null, "3xl"]}
        fontWeight="bold"
        w={["2xs", null, "xl"]}
      >
        It looks like you're signing up. Please fill the fields below to finish
        up your account.
      </Text>
      <Box
        w={["2xs", null, "sm"]}
        py={6}
        px={[4, null, 8]}
        rounded={[30, null, 40]}
        bg="white"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values: SignUpFormVals, actions) => {
            let result = await POST_UserInfo(values);
            if (result) {
              history.push(SITE_PATHS.HOME);
            } else {
              setSubmitErr(true);
            }
            actions.setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack flexFlow="column" alignItems="center" spacing={3}>
                <InputField
                  name="question_private"
                  label="Private question"
                  placeholder="Select a question"
                  fontSize={{ base: "md", lg: "xl" }}
                  inputType="select"
                  selectOptions={secretQuestions}
                  validate={validatePrivQuestion}
                />
                <InputField
                  name="answer_private"
                  placeholder="Your answer"
                  label="Private answer"
                  fontSize={{ base: "md", lg: "xl" }}
                  validate={validatePrivAnswer}
                />
                <InputField
                  name="question_public"
                  label="Public question"
                  placeholder="Select a question"
                  fontSize={{ base: "md", lg: "xl" }}
                  inputType="select"
                  selectOptions={secretQuestions}
                />
                <InputField
                  name="answer_public"
                  placeholder="Your answer"
                  label="Public answer"
                  fontSize={{ base: "md", lg: "xl" }}
                />
                {(submitErr || questionsErrMsg) && (
                  <Alert status="error" textAlign="center">
                    {(submitErr && MSG_REQ_ERR) || questionsErrMsg}
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

export default SignUp;

import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import { Alert, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputField } from "features";
import { useState } from "react";
import { completeUserInfo as POST_UserInfo } from "app/utils/api/user";

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

const questions: string[] = ["question1?", "question2?", "question3?"];

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
              history.push("/home");
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
                  fontSize={["md", null, "xl"]}
                  inputType="select"
                  selectOptions={questions}
                  validate={validatePrivQuestion}
                />
                <InputField
                  name="answer_private"
                  placeholder="Your answer"
                  label="Private answer"
                  fontSize={["md", null, "xl"]}
                  validate={validatePrivAnswer}
                />
                <InputField
                  name="question_public"
                  label="Public question"
                  placeholder="Select a question"
                  fontSize={["md", null, "xl"]}
                  inputType="select"
                  selectOptions={questions}
                />
                <InputField
                  name="answer_public"
                  placeholder="Your answer"
                  label="Public answer"
                  fontSize={["md", null, "xl"]}
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

export default SignUp;

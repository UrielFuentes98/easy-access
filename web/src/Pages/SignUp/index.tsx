import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { InputField } from "features";
import { useEffect } from "react";

interface SignUpFormVals {
  answer_public: string;
  answer_private: string;
  question_public: string;
  question_private: string;
}

const initialValues: SignUpFormVals = {
  answer_public: "",
  answer_private: "",
  question_private: "0",
  question_public: "0",
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
            alert(JSON.stringify(values, null, 2));
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
                  isSelect={true}
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
                  isSelect={true}
                  selectOptions={questions}
                />
                <InputField
                  name="answer_public"
                  placeholder="Your answer"
                  label="Public answer"
                  fontSize={["md", null, "xl"]}
                />
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

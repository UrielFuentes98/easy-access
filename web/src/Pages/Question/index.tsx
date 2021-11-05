import { Box, VStack } from "@chakra-ui/layout";
import { Button, Text } from "@chakra-ui/react";
import { InputField } from "features";
import { Form, Formik } from "formik";

interface QuestionAsking {
  answer: string;
}

const initialValues: QuestionAsking = {
  answer: "",
};

function Question() {
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
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack flexFlow="column" alignItems="center" spacing={3}>
              <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                Secret Question
              </Text>
              <Text fontSize={["md", null, "xl"]} textAlign="center">
                Question?
              </Text>
              <InputField
                name="answer"
                placeholder="Enter your answer"
                fontSize={["md", null, "xl"]}
                validate={validateAnswer}
              />
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

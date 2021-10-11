import { Box, VStack } from "@chakra-ui/layout";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import { InputField } from "features";
import { Field, FieldProps, Form, Formik } from "formik";

interface PhraseFormVals {
  phrase: string;
}

const initialValues: PhraseFormVals = {
  phrase: "",
};

function PhraseInput() {
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

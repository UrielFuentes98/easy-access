import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { useEffect } from "react";

interface SignUpFormVals {
  email: string;
}

const initialValues: SignUpFormVals = {
  email: "",
};

function validateEmail(value: string) {
  let error;
  var re = /\S+@\S+\.\S+/;
  if (!re.test(value)) {
    error = "You should enter a valid email";
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
        rounded={40}
        bg="white"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values: SignUpFormVals, actions) => {}}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack flexFlow="column" alignItems="center" spacing={3}>
                <Field name="email" validate={validateEmail}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={form.touched.email && !!form.errors.email}
                    >
                      <Input
                        {...field}
                        fontSize={["md", null, "xl"]}
                        id="email"
                        placeholder="Enter your email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

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

import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import { Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Magic } from "magic-sdk";
import { InputField } from "features";
import { loginUser } from "app/utils/api/user";

interface SignInFormVals {
  email: string;
}

const initialValues: SignInFormVals = {
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

const magic = new Magic("pk_live_9CECDC3B1BA34ADB");

function SignIn() {
  const history = useHistory();

  // useEffect(() => {
  //   async function checkLoginStatus() {
  //     const isLoggedIn = await magic.user.isLoggedIn();
  //     if (isLoggedIn) {
  //       history.push("/home");
  //     }
  //   }
  //   checkLoginStatus();
  // }, []);

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
        onSubmit={async (values: SignInFormVals, actions) => {
          const email = values.email;
          const didToken = await magic.auth.loginWithMagicLink({ email });
          const message = await loginUser(didToken);
          if (message === "User was logged in.") {
            history.push("/home");
          } else {
            history.push("/signup");
          }
          actions.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack flexFlow="column" alignItems="center" spacing={3}>
              <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                Sign In
              </Text>
              <Text fontSize={["md", null, "xl"]} textAlign="center">
                Or SignIn/SignUp to create a new transfer.
              </Text>
              <InputField
                name="email"
                placeholder="Enter your email"
                fontSize={["md", null, "xl"]}
                validate={validateEmail}
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

export default SignIn;

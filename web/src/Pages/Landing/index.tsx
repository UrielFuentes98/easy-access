import { VStack } from "@chakra-ui/layout";
import { default as PhraseInput } from "./PhraseInput";
import { default as SignIn } from "./SignIn";

function LandingPage() {
  return (
    <VStack spacing={8}>
      <PhraseInput />
      <SignIn />
    </VStack>
  );
}

export default LandingPage;

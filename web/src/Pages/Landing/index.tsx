import { VStack } from "@chakra-ui/layout";
import Banners from "./Banners";
import { default as PhraseInput } from "./PhraseInput";
import { default as SignIn } from "./SignIn";

function LandingPage() {
  return (
    <VStack spacing={8}>
      <PhraseInput />
      <SignIn />
      <Banners />
    </VStack>
  );
}

export default LandingPage;

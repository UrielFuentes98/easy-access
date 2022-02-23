import { ArrowForwardIcon, CheckIcon, TimeIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";

type Props = {
  text: string;
  icon: string;
};
function Banner({ text, icon }: Props) {
  return (
    <Box
      maxW={{ base: "3xs", lg: "xs" }}
      py={6}
      px={{ base: 8, lg: 14 }}
      rounded={40}
      bg="white"
      alignItems="center"
      display="flex"
      flexFlow="column"
    >
      {icon === "time" ? (
        <TimeIcon boxSize={[6, null, 8]} />
      ) : icon === "check" ? (
        <CheckIcon boxSize={[6, null, 8]} />
      ) : icon === "arrow" ? (
        <ArrowForwardIcon boxSize={[8, null, 10]} />
      ) : null}
      <Text fontSize={{ base: "md", lg: "xl" }} pt={5} textAlign="justify">
        {text}
      </Text>
    </Box>
  );
}

export default Banner;

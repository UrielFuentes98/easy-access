import { Box } from "@chakra-ui/layout";
import { Flex, Text } from "@chakra-ui/react";

function AppHeader() {
  return (
    <Box
      w="full"
      maxW="4xl"
      h="3xs"
      borderBottomRadius={50}
      bg="orange.400"
    >
      <Flex alignContent="center">
        <Box flex="1" />
        <Text  fontSize={"5xl"} fontWeight="bold" textAlign="center">
          Easy Access
        </Text>
        <Box flex="1">
        </Box>
      </Flex>
    </Box>
  );
}

export default AppHeader;

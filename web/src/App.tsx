import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import { Box, Container, Flex } from "@chakra-ui/react";

function App() {
  return (
    <Flex
      h="100vh"
      direction={["column", null, null, "row"]}
      pt={[20, null, null, null, 40]}
    >
      <Box flex={["0", null, null, "1"]} bg="tomato" />
      <Box flex={["1", null, null, "2"]} bg="brown"></Box>
      <Box flex={["1", null, null, "1"]} bg="twitter.400" />
    </Flex>
  );
}

export default App;

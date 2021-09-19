import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import { Box, Container, Flex } from "@chakra-ui/react";
import { AppHeader, LandingPage } from "./Pages";

function App() {
  return (
    <Container maxW="container.xl" centerContent px={10}>
      <AppHeader />
      <Box position="absolute" top={100}>
      <LandingPage />
      </Box>
    </Container>
  );
}

export default App;

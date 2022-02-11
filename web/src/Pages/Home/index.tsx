import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { SITE_PATHS } from "app/routes";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  useEffect(() => {
    async function fetchUserData() {
      //alert(JSON.stringify(userMetadata, null, 2));
    }
    fetchUserData();
  }, []);
  return (
    <>
      <Box
        w={["2xs", null, "sm"]}
        py={6}
        px={[4, null, 8]}
        rounded={40}
        bg="white"
      >
        <VStack flexFlow="column" alignItems="center" spacing={4}>
          <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
            Welcome!
          </Text>
          <Text fontSize={["md", null, "xl"]} textAlign="center">
            Start a new transfer or access your active transfers.
          </Text>
          <Button
            fontSize={["md", null, "xl"]}
            colorScheme="teal"
            rounded={15}
            p={6}
          >
            <Link to={SITE_PATHS.NEW_TRANSFER}>Transfer new file(s)</Link>
          </Button>
        </VStack>
      </Box>
      <Table
        variant="simple"
        size="lg"
        alignSelf="center"
        width="xs"
        colorScheme="blue"
      >
        <Thead>
          <Tr>
            <Th>Transfer</Th>
            <Th width={8}></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Test</Td>
            <Td textAlign="center">
              <CloseIcon
                alignContent="center"
                width={3}
                color="red.600"
                _hover={{ cursor: "pointer" }}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Alert status="success" rounded={10} alignSelf="center" width={80}>
        <AlertIcon />
        Data uploaded to the server. Fire on!
      </Alert>
    </>
  );
}

export default HomePage;

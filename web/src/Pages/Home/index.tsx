import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { Magic } from "magic-sdk";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

const magic = new Magic("pk_live_9CECDC3B1BA34ADB");

function HomePage() {
  const history = useHistory();

  useEffect(() => {
    async function fetchUserData() {
      const userMetadata = await magic.user.getMetadata();
      //alert(JSON.stringify(userMetadata, null, 2));
    }
    fetchUserData();
  }, []);
  return (
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
          <Link to="/newTransfer">Transfer new file(s)</Link>
        </Button>
      </VStack>
    </Box>
  );
}

export default HomePage;

import { Box } from "@chakra-ui/layout";
import { Button, Flex, Text } from "@chakra-ui/react";
import { SITE_PATHS } from "app/routes";
import { POST_LogoutUser } from "app/utils/api";
import { useHistory, useLocation } from "react-router-dom";
import { showLogOutButton } from "./uilts";

function AppHeader() {
  const history = useHistory();
  const location = useLocation();

  async function onLogOutUser() {
    console.log(history.location.pathname);
    const result = await POST_LogoutUser();
    if (result.ok) {
      history.push(SITE_PATHS.LANDING);
    }
  }
  return (
    <Box w="full" maxW="4xl" h="2xs" borderBottomRadius={50} bg="orange.400">
      <Flex>
        <Box flex="1" />
        <Text
          fontSize={["4xl", null, "5xl"]}
          pt={[2, null, 0]}
          fontWeight="bold"
          textAlign="center"
        >
          Easy Access
        </Text>
        <Box flex="1" display="flex" justifyContent="flex-end">
          {showLogOutButton(location.pathname) && (
            <Button
              fontSize={["xs", null, "sm"]}
              colorScheme="teal"
              rounded={5}
              onClick={onLogOutUser}
              p={2}
              mr={[null, null, 4]}
              mt={4}
            >
              LogOut
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export default AppHeader;

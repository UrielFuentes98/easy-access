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
import { useAppSelector } from "app/hooks";
import { SITE_PATHS } from "app/routes";
import { GET_ActiveTransfers, POST_DeactivateTransfer } from "app/utils/api";
import {
  selectRecentTransfer,
  setRecentTransfer,
  selectNewTransferPhrase,
} from "Pages/NewTransfer/newTransferSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [transferPhrases, setTransferPhrases] = useState([] as string[]);
  const [showNewTransferAlert, setShowNewTransferAlert] = useState(false);
  const recentTransfer = useAppSelector(selectRecentTransfer);
  const newTransferPhrase = useAppSelector(selectNewTransferPhrase);

  useEffect(() => {
    if (recentTransfer) {
      setRecentTransfer(false);
      setShowNewTransferAlert(true);
      const timer = setTimeout(() => setShowNewTransferAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    async function fetchActiveTransfers() {
      const response = await GET_ActiveTransfers();
      if (response.ok) {
        const activeTransfers: string[] = await response.json();
        setTransferPhrases([...activeTransfers]);
      }
    }
    fetchActiveTransfers();
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
      {showNewTransferAlert && (
        <Alert status="success" rounded={10} alignSelf="center" width={80}>
          <AlertIcon />
          New transfer created with phrase '{newTransferPhrase}'
        </Alert>
      )}
      {transferPhrases.length > 0 && (
        <Table
          variant="simple"
          size="lg"
          alignSelf="center"
          width="xs"
          colorScheme="blue"
        >
          <Thead>
            <Tr>
              <Th>Transfers</Th>
              <Th width={8}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {transferPhrases.map((phrase) => (
              <Tr>
                <Td>{phrase}</Td>
                <Td textAlign="center">
                  <CloseIcon
                    alignContent="center"
                    width={3}
                    color="red.600"
                    _hover={{ cursor: "pointer" }}
                    id={phrase}
                    onClick={async (e) => {
                      const transferPhrase = e.currentTarget.id;
                      const reponse = await POST_DeactivateTransfer(
                        transferPhrase
                      );
                      if (reponse.ok) {
                        const index = transferPhrases.indexOf(transferPhrase);
                        if (index > -1) {
                          let newPhrases = transferPhrases;
                          newPhrases.splice(index, 1);
                          setTransferPhrases([...newPhrases]);
                        }
                      }
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
}

export default HomePage;

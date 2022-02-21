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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { useAppSelector } from "app/hooks";
import { SITE_PATHS } from "app/routes";
import {
  GET_ActiveTransfers,
  POST_DeactivateTransfer,
  TransferStat,
} from "app/utils/api";
import {
  selectRecentTransfer,
  setRecentTransfer,
  selectNewTransferPhrase,
} from "Pages/NewTransfer/newTransferSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getTimeFormat(seconds: number): string {
  const intSecs = Math.floor(seconds % 60);
  const intMins = Math.floor((seconds / 60) % 60);
  const intHrs = Math.floor(seconds / (60 * 60));

  const strHrs = intHrs.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const strMins = intMins.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
  const strSecs = intSecs.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });

  return `${strHrs}:${strMins}:${strSecs}`;
}

function HomePage() {
  const [transfersStats, setTransfersStats] = useState([] as TransferStat[]);
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
        const transfersStats: TransferStat[] = await response.json();
        setTransfersStats([...transfersStats]);
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
            Start a new transfer or check your active transfers.
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
      {transfersStats.length > 0 && (
        <Table
          variant="simple"
          size="lg"
          alignSelf="center"
          width="2xs"
          colorScheme="blue"
        >
          <Thead>
            <Tr>
              <Th px={0}>Transfer</Th>
              <Th>Time remaining hh:mm:ss</Th>
              <Th width={8}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {transfersStats.map((transfer) => (
              <Tr>
                <Td px={0}>{transfer.phrase}</Td>
                <Td>{getTimeFormat(transfer.secs_remaining)}</Td>
                <Td textAlign="center">
                  <Popover>
                    {({ onClose }) => (
                      <>
                        <PopoverTrigger>
                          <CloseIcon
                            alignContent="center"
                            width={3}
                            color="red.600"
                            _hover={{ cursor: "pointer" }}
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>
                            Are you sure you want to delete the transfer?
                          </PopoverHeader>
                          <PopoverBody>
                            <Button
                              colorScheme="blue"
                              id={transfer.phrase}
                              onClick={async (e) => {
                                const transferPhrase = e.currentTarget.id;
                                const reponse = await POST_DeactivateTransfer(
                                  transferPhrase
                                );
                                if (reponse.ok) {
                                  const transfer = transfersStats.find(
                                    (transfer) =>
                                      transfer.phrase === transferPhrase
                                  );
                                  if (transfer) {
                                    const index =
                                      transfersStats.indexOf(transfer);
                                    let newStats = transfersStats;
                                    newStats.splice(index, 1);
                                    setTransfersStats([...newStats]);
                                  }
                                }
                                onClose();
                              }}
                            >
                              Yes
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </>
                    )}
                  </Popover>
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

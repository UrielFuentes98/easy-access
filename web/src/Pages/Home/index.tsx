import { Box, Button, VStack, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { SITE_PATHS } from "app/routes";
import { GET_ActiveTransfers, TransferStat } from "app/utils/api";
import {
  selectRecentTransfer,
  setRecentTransfer,
  selectNewTransferPhrase,
} from "Pages/NewTransfer/newTransferSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableStats from "./TableStats";

function HomePage() {
  const dispatch = useAppDispatch();
  const [transfersStats, setTransfersStats] = useState([] as TransferStat[]);
  const [showNewTransferAlert, setShowNewTransferAlert] = useState(false);
  const recentTransfer = useAppSelector(selectRecentTransfer);
  const newTransferPhrase = useAppSelector(selectNewTransferPhrase);

  useEffect(() => {
    if (recentTransfer) {
      dispatch(setRecentTransfer(false));
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
          <Text fontSize={{ base: "md", lg: "xl" }} textAlign="center">
            Start a new transfer or check your active transfers.
          </Text>
          <Button
            fontSize={{ base: "md", lg: "xl" }}
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
        <TableStats {...{ transfersStats }} {...{ setTransfersStats }} />
      )}
    </>
  );
}

export default HomePage;

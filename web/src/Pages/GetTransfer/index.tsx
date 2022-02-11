import { Box } from "@chakra-ui/layout";
import { useAppSelector } from "app/hooks";
import {
  selectTranAccessId,
  selectTransferId,
} from "Pages/Landing/PhraseInput";
import { useEffect } from "react";
import { GET_Transfer } from "app/utils/api";

function GetTransfer() {
  const transAccessId = useAppSelector(selectTranAccessId);
  const transferId = useAppSelector(selectTransferId);

  useEffect(() => {
    async function fetchTransfer() {
      const transferRes = await GET_Transfer(transferId, transAccessId);
    }
    fetchTransfer();
  }, []);

  return (
    <Box
      w={["2xs", null, "sm"]}
      py={6}
      px={[4, null, 8]}
      rounded={40}
      bg="white"
    >
      Hello World!
    </Box>
  );
}

export default GetTransfer;

import { Box, Link, Text } from "@chakra-ui/layout";
import { useAppSelector } from "app/hooks";
import {
  selectTranAccessId,
  selectTransferId,
} from "Pages/Landing/PhraseInput";
import { useEffect, useState } from "react";
import {
  FilesNamesResponse,
  GET_FilesNames,
  GET_FILES_NAMES,
} from "app/utils/api";
import { DownloadIcon } from "@chakra-ui/icons";

function GetTransfer() {
  const accessId = useAppSelector(selectTranAccessId);
  const transferId = useAppSelector(selectTransferId);
  const [filesNames, setFilesNames] = useState([] as string[]);

  useEffect(() => {
    async function getFilesNames() {
      const transferRes = await GET_FilesNames(transferId, accessId);
      const response: FilesNamesResponse = await transferRes.json();
      if (response.key === GET_FILES_NAMES.SUCCESS) {
        setFilesNames(response.filesNames);
      }
    }
    getFilesNames();
  }, []);

  function getDownloadUrl(fileName: string) {
    return `http://localhost:4000/transfer/file?transId=${transferId}&accessId=${accessId}&fileName=${fileName}`;
  }

  return (
    <Box
      w={["2xs", null, "sm"]}
      py={6}
      px={[8, null, 20]}
      rounded={[20, null, 30]}
      bg="white"
    >
      <Text
        fontSize={["xl", null, "3xl"]}
        fontWeight="bold"
        pb={2}
        textAlign="center"
      >
        Transfer
      </Text>
      {filesNames.map((fileName, key) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          key={key}
        >
          <Text fontSize={{ base: "md", lg: "xl" }}>{fileName}</Text>
          <Link href={getDownloadUrl(fileName)}>
            <DownloadIcon
              color="blue.600"
              boxSize={5}
              _hover={{ cursor: "pointer" }}
            />
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export default GetTransfer;

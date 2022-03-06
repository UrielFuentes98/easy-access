import { Box, Text } from "@chakra-ui/layout";
import { useAppDispatch, useAppSelector } from "app/hooks";
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
import { CloseIcon, DownloadIcon } from "@chakra-ui/icons";
import { SITE_PATHS } from "app/routes";
import { Link } from "react-router-dom";
import {
  setAnswer,
  setSecretQuestion,
  setTranAccessId,
  setTransferId,
} from "Pages/Landing/PhraseInput/transferAccessSlice";
import { DOMAIN } from "app/constants";

function GetTransfer() {
  const dispatch = useAppDispatch();
  const accessId = useAppSelector(selectTranAccessId);
  const transferId = useAppSelector(selectTransferId);
  const [filesNames, setFilesNames] = useState([] as string[]);

  function ResetTransInfo() {
    dispatch(setTransferId(0));
    dispatch(setSecretQuestion(""));
    dispatch(setAnswer(""));
    dispatch(setTranAccessId(""));
  }

  useEffect(() => {
    async function getFilesNames() {
      const transferRes = await GET_FilesNames(transferId, accessId);
      const response: FilesNamesResponse = await transferRes.json();
      if (response.key === GET_FILES_NAMES.SUCCESS) {
        setFilesNames(response.filesNames);
      }
    }
    getFilesNames();
    return () => ResetTransInfo();
  }, []);

  function getDownloadUrl(fileName: string) {
    return `${DOMAIN}/transfer/file?transId=${transferId}&accessId=${accessId}&fileName=${fileName}`;
  }

  return (
    <Box
      w={["3xs", null, "sm"]}
      py={6}
      px={[8, null, 20]}
      rounded={[20, null, 30]}
      bg="white"
    >
      <Box display="flex" alignItems="center">
        <Text
          fontSize={["xl", null, "3xl"]}
          fontWeight="bold"
          pb={2}
          textAlign="center"
          ml="auto"
        >
          Transfer
        </Text>
        <Link to={SITE_PATHS.LANDING} style={{ marginLeft: "auto" }}>
          <CloseIcon color="red.600" boxSize={{ base: 3, lg: 4 }} />
        </Link>
      </Box>
      {filesNames.map((fileName, key) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          key={key}
        >
          <Text fontSize={{ base: "md", lg: "xl" }}>{fileName}</Text>
          <a href={getDownloadUrl(fileName)}>
            <DownloadIcon
              color="blue.600"
              boxSize={5}
              _hover={{ cursor: "pointer" }}
            />
          </a>
        </Box>
      ))}
    </Box>
  );
}

export default GetTransfer;

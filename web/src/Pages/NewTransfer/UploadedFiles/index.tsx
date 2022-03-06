import { CloseIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";

type Props = {
  files: File[];
  setFiles: (stats: React.SetStateAction<File[]>) => void;
};

function UploadedFiles({ files, setFiles }: Props) {
  return (
    <Box>
      {files.map((file, key) => (
        <Box
          display="flex"
          alignItems="center"
          key={key}
          width={[100, null, 130]}
          justifyContent="space-between"
        >
          <Text fontSize={{ base: "md", lg: "xl" }}>{file.name}</Text>
          <CloseIcon
            color="red.600"
            boxSize={3}
            _hover={{ cursor: "pointer" }}
            id={file.name}
            onClick={(e) => {
              const fileName = e.currentTarget.id;
              const fileToRemove = files.find((file) => file.name === fileName);
              if (fileToRemove) {
                const newFiles = files;
                const indexOfFile = newFiles.indexOf(fileToRemove);
                newFiles.splice(indexOfFile, 1);
                setFiles([...newFiles]);
              }
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default UploadedFiles;

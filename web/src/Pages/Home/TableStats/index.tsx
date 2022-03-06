import { CloseIcon } from "@chakra-ui/icons";
import {
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
  Button,
} from "@chakra-ui/react";
import { POST_DeactivateTransfer, TransferStat } from "app/utils/api";

type Props = {
  transfersStats: TransferStat[];
  setTransfersStats: (stats: React.SetStateAction<TransferStat[]>) => void;
};

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

function TableStats({ transfersStats, setTransfersStats }: Props) {
  return (
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
        {transfersStats.map((transfer, index) => (
          <Tr key={index}>
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
                                (transfer) => transfer.phrase === transferPhrase
                              );
                              if (transfer) {
                                const index = transfersStats.indexOf(transfer);
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
  );
}

export default TableStats;

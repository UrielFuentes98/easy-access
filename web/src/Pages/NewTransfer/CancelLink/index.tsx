import {
  Button,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { SITE_PATHS } from "app/routes";
import { useHistory } from "react-router-dom";

function CancelLink() {
  const history = useHistory();
  return (
    <Popover>
      {() => (
        <>
          <PopoverTrigger>
            <Link
              textDecoration="underline"
              color="red.400"
              fontSize={{ base: "sm", lg: "md" }}
            >
              Cancel
            </Link>
          </PopoverTrigger>
          <PopoverContent alignItems="center" maxW={{ base: "3xs", lg: "2xs" }}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              Are you sure you want to cancel the transfer?
            </PopoverHeader>
            <PopoverBody>
              <Button
                colorScheme="blue"
                onClick={async () => {
                  history.push(SITE_PATHS.HOME);
                }}
              >
                Yes
              </Button>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}

export default CancelLink;

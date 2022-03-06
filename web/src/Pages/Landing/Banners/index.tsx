import { Stack } from "@chakra-ui/react";
import Banner from "./Banner";

function Banners() {
  return (
    <Stack direction={["column", "row"]} spacing={{ base: 4, lg: 12 }} pb={8}>
      <Banner
        text="Make your files easily accesible during a short time."
        icon="time"
      />
      <Banner
        text="You just need to pick a phrase and answer your secret question."
        icon="check"
      />
      <Banner
        text="You can also make files accessible to others with a public question."
        icon="arrow"
      />
    </Stack>
  );
}

export default Banners;

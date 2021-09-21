import { Box, Container } from "@chakra-ui/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routes, defaultPage } from "./app/";
import { AppHeader } from "./Pages";

const app_routes = [...routes];
function App() {
  const route_pages = app_routes.map(({ path, page }, key) => (
    <Route exact path={path} component={page} key={key} />
  ));

  return (
    <Container maxW="container.xl" centerContent px={10}>
      <AppHeader />
      <Box position="absolute" top={100}>
        <BrowserRouter>
          <Switch>
            {route_pages}
            <Route component={defaultPage}></Route>
          </Switch>
        </BrowserRouter>
      </Box>
    </Container>
  );
}

export default App;

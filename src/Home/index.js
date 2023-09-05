import { Container, Title, Space, Divider } from "@mantine/core";

import Items from "../Items";

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center" color="red">
        ShoppingList
      </Title>
      <Space h="20px" />
      {/* <Title order={2} align="center">
        Enjoy big movies, hit series and more from RM17.
      </Title> */}
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      {/* list all the movies here */}
      <Items />
      <Space h="30px" />
      {/* list all the Tv shows here */}
    </Container>
  );
}

export default Home;

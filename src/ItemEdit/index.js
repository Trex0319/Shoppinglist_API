import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const getItem = async (id) => {
  const response = await axios.get("http://localhost:8000/items/" + id);
  return response.data;
};

const updateItem = async ({ id, data }) => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:8000/items/" + id,
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function MoviesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");
  const [priority, setPriority] = useState("");
  const { data } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
    onSuccess: (data) => {
      setName(data.name);
      setPriority(data.priority);
      setUnit(data.unit);
      setQuantity(data.quantity);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      notifications.show({
        title: "Item Edited",
        color: "green",
      });
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateItem = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        name: name,
        quantity: quantity,
        unit: unit,
        priority: priority,
      }),
    });
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Edit item
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the item name here"
          label="Name"
          description="The name of the item"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={quantity}
          placeholder="Enter the item quantity here"
          label="Quantity"
          min={1}
          max={10}
          description="The quantity of the item"
          withAsterisk
          onChange={setQuantity}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={unit}
          placeholder="Enter the unit here"
          label="Unit"
          description="The unit of the item"
          withAsterisk
          onChange={(event) => setUnit(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={priority}
          placeholder="Enter the priority here"
          label="Priority"
          description="The priority of the item"
          withAsterisk
          onChange={(event) => setPriority(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <Button fullWidth onClick={handleUpdateItem}>
          Update
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}

export default MoviesEdit;

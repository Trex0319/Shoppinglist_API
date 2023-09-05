import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchItems = async (priority, purchased) => {
  if (priority !== "") {
    const response = await axios.get(
      "http://localhost:8000/items?priority=" + priority
    );
    return response.data;
  } else if (purchased !== "") {
    const response = await axios.get(
      "http://localhost:8000/items?purchased=" + purchased
    );
    return response.data;
  } else {
    const response = await axios.get("http://localhost:8000/items");
    return response.data;
  }
};

const eidtItem = async (item_id = "") => {
  await axios({
    method: "PUT",
    url: "http://localhost:8000/items/" + item_id + "/purchased",
  });
};

const deleteItem = async (item_id = "") => {
  await axios({
    method: "DELETE",
    url: "http://localhost:8000/items/" + item_id,
  });
};

function Items() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [purchased, setPurchased] = useState("");
  const [priority, setPriority] = useState("");
  const {
    isLoading,
    isError,
    data: items,
    error,
  } = useQuery({
    queryKey: ["items", priority, purchased],
    queryFn: () => fetchItems(priority, purchased),
  });

  console.log(items);

  const memoryItems = queryClient.getQueryData(["items", "", ""]);
  const priorityOptions = useMemo(() => {
    let options = [];
    if (items && items.length > 0) {
      items.forEach((item) => {
        if (!options.includes(item.priority)) {
          options.push(item.priority);
        }
      });
    }
    return options;
  }, [memoryItems]);

  const updateMutation = useMutation({
    mutationFn: eidtItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items", priority, purchased],
      });

      notifications.show({
        title: "Updated Purchase",
        color: "green",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items", priority, purchased],
      });

      notifications.show({
        title: "Item deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="apart">
        <Title order={3} align="center">
          Shopping List
        </Title>
        <Button component={Link} to="/item_add" color="blue">
          Add New Items
        </Button>
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={priority}
          onChange={(event) => {
            setPriority(event.target.value);
          }}
        >
          <option value="">All priority</option>
          {priorityOptions.map((priority) => {
            console.log(priorityOptions);
            return (
              <option key={priority} value={priority}>
                {priority}
              </option>
            );
          })}
        </select>

        <select
          value={purchased}
          onChange={(event) => {
            setPurchased(event.target.value);
          }}
        >
          <option value="">All purchased</option>
          <option value="yes">Purchased</option>
          <option value="no">Unpurchased</option>
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {items
          ? items.map((item) => {
              return (
                <Grid.Col span={4} key={item._id}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{item.name}</Title>
                    <Space h="20px" />
                    <Group position="center" spacing="5px">
                      <Badge color="red">{item.quantity}</Badge>
                      <Badge color="green">{item.unit}</Badge>
                      <Badge color="orange">{item.priority}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/items/" + item._id}
                        size="xs"
                        radius="50px"
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          updateMutation.mutate(item._id);
                        }}
                      >
                        Purchased
                      </Button>
                      <Button
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          deleteMutation.mutate(item._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Items;

import { Menu, Button, Group, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { IconMail } from "@tabler/icons-react";

// Temporary sample data
const mockMessages = [
  {
    id: 1,
    sender: "RareBooksLLC",
    snippet: "Interested in your copy of Moby Dick...",
    time: "2h",
  },
  {
    id: 2,
    sender: "Collector42",
    snippet: "Can you provide more photos of the spine?",
    time: "5h",
  },
  {
    id: 3,
    sender: "AntiquarianPress",
    snippet: "Offer: $120 on your listed item.",
    time: "1d",
  },
];

export function MessagesButton() {
  return (
    <Group visibleFrom="sm">
      <Menu shadow="md" width={280} withinPortal>
        <Menu.Target>
          <Button
            variant="subtle"
            color="dark"
            className="flex items-center gap-2 px-3 py-2"
            leftSection={<IconMail size={20} />}
          >
            Messages
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Recent Messages</Menu.Label>

          {mockMessages.map((msg) => (
            <Menu.Item
              key={msg.id}
              component={Link}
              to={`/messages/${msg.id}`} // individual thread
              className="flex flex-col items-start"
            >
              <div className="flex justify-between w-full">
                <Text fw={500} size="sm">
                  {msg.sender}
                </Text>
                <Text size="xs" c="dimmed">
                  {msg.time}
                </Text>
              </div>
              <Text size="xs" c="dimmed" truncate="end" w="100%">
                {msg.snippet}
              </Text>
            </Menu.Item>
          ))}

          <Menu.Divider />

          <Menu.Item
            component={Link}
            to="/messages"
            fw={500}
            className="text-center justify-center"
          >
            View all messages
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

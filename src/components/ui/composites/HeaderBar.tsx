import { Box, Group, Burger, Text } from "@mantine/core";
import { SearchBar } from "./SearchBar";
import { AccountButton } from "./AccountButton";
import { MessagesButton } from "./MessagesButton";
import { LightDarkToggle } from "./LightDark";

export function HeaderBar({
  drawerOpened,
  onToggleDrawer,
  user,
  onLogout,
}: {
  drawerOpened: boolean;
  onToggleDrawer: () => void;
  user: { id: string; email: string } | null;
  onLogout: () => void;
}) {
  return (
    <Group justify="space-between" h="100%" px="md" py="4">
      {/* Logo */}
      <Group>
        <img
          src="/NEB-Logo.png"
          alt="Not Enough Books"
          className="h-14 w-auto"
        />
        <Text fw={700} size="xl">
          Not Enough Books
        </Text>
      </Group>

      {/* Search */}
      <Box className="flex-1 hidden sm:flex justify-center">
        {/* wire your state into this component as needed */}
        <SearchBar
          value={"searchTerm"}
          onChange={"setSearchTerm"}
          placeholder="Search books..."
        />
      </Box>

      {/* Account */}
      <MessagesButton />
      <AccountButton user={user} onLogout={onLogout} />
      <LightDarkToggle />

      {/* Mobile burger */}
      <Burger opened={drawerOpened} onClick={onToggleDrawer} hiddenFrom="sm" />
    </Group>
  );
}

import { Box, Group, Burger, Text } from "@mantine/core";
import { SearchBar } from "@/features/search";
import { MessagesButton } from "../components/ui/composites/MessagesButton.tsx";
import { LightDarkToggle } from "../components/ui/composites/LightDark.tsx";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthButton } from "@/features/auth";

export function HeaderBar({
  drawerOpened,
  onToggleDrawer,
}: {
  drawerOpened: boolean;
  onToggleDrawer: () => void;
  user: { id: string; email: string } | null;
  onLogout: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={(val) =>
            navigate({ to: "/products", search: { query: val } })
          }
          placeholder="Search books..."
        />
      </Box>

      {/* Account */}
      <MessagesButton />
      <AuthButton />
      {/*  <AccountButton user={user} onLogout={onLogout} />*/}
      <LightDarkToggle />

      {/* Mobile burger */}
      <Burger opened={drawerOpened} onClick={onToggleDrawer} hiddenFrom="sm" />
    </Group>
  );
}

import {
  Group,
  HoverCard,
  Anchor,
  Box,
  Divider,
  SimpleGrid,
  Text,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "@/styles/HeaderMegaMenu.module.css";

export function NavBar({ links }: { links: React.ReactNode }) {
  const theme = useMantineTheme();

  return (
    <Group justify="center" gap="lg" px="md" py="xs" visibleFrom="sm">
      <a href="#" className={classes.link}>
        Home
      </a>

      <HoverCard width={600} position="bottom" radius="md" shadow="md">
        <HoverCard.Target>
          <a href="#" className={classes.link}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.colors.blue[6]} />
            </Center>
          </a>
        </HoverCard.Target>

        <HoverCard.Dropdown style={{ overflow: "hidden" }}>
          <Group justify="space-between" px="md">
            <Text fw={500}>Features</Text>
            <Anchor href="#" fz="xs">
              View all
            </Anchor>
          </Group>
          <Divider my="sm" />
          <SimpleGrid cols={2} spacing={0}>
            {links}
          </SimpleGrid>
          <div className={classes.dropdownFooter}>
            <Group justify="space-between">
              <div>
                <Text fw={500} fz="sm">
                  Get started
                </Text>
                <Text size="xs" c="dimmed">
                  Their food sources have decreased, and their numbers
                </Text>
              </div>
              <button className="px-3 py-1.5 rounded-md border">
                Get started
              </button>
            </Group>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>

      <a href="#" className={classes.link}>
        Learn
      </a>
      <a href="#" className={classes.link}>
        Academy
      </a>
    </Group>
  );
}

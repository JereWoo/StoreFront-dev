import {
  Drawer,
  ScrollArea,
  Divider,
  Group,
  UnstyledButton,
  Center,
  Box,
  Collapse,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import classes from "../../css/HeaderMegaMenu.module.css";

export function MobileDrawer({
  opened,
  onClose,
  links,
}: {
  opened: boolean;
  onClose: () => void;
  links: React.ReactNode;
}) {
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="100%"
      padding="md"
      title="Navigation"
      hiddenFrom="sm"
      zIndex={1000000}
    >
      <ScrollArea h="calc(100vh - 80px" mx="-md">
        <Divider my="sm" />
        <a href="#" className={classes.link}>
          Home
        </a>
        <UnstyledButton className={classes.link} onClick={toggleLinks}>
          <Center inline>
            <Box component="span" mr={5}>
              Features
            </Box>
            <IconChevronDown size={16} />
          </Center>
        </UnstyledButton>
        <Collapse in={linksOpened}>{links}</Collapse>
        <a href="#" className={classes.link}>
          Learn
        </a>
        <a href="#" className={classes.link}>
          Academy
        </a>
        <Divider my="sm" />
        <Group justify="center" grow pb="xl" px="md">
          <a
            href="/auth/sign-in"
            className="px-3 py-2 border rounded-md text-center"
          >
            Log in
          </a>
          <a
            href="/auth/sign-up"
            className="px-3 py-2 rounded-md bg-black text-white text-center"
          >
            Sign up
          </a>
        </Group>
      </ScrollArea>
    </Drawer>
  );
}

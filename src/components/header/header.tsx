import {
  Box,
  Group,
  ThemeIcon,
  Text,
  useMantineTheme,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "@/css/HeaderMegaMenu.module.css";
import { HeaderBar } from "./HeaderBar";
import { NavBar } from "./NavBar";
import { MobileDrawer } from "./MobileDrawer";
import {
  IconBook,
  IconChartPie3,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
} from "@tabler/icons-react";
import { useAuth } from "@/lib/vendure/AuthState.tsx";

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

function FeatureLinks() {
  const theme = useMantineTheme();
  return (
    <>
      {mockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title}>
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon size={34} variant="default" radius="md">
              <item.icon size={22} color={theme.colors.blue[6]} />
            </ThemeIcon>
            <div>
              <Text size="sm" fw={500}>
                {item.title}
              </Text>
              <Text size="xs" c="dimmed">
                {item.description}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      ))}
    </>
  );
}

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { status, user, customer, logout } = useAuth();
  const accountUser = status === "authenticated" ? user : null; // { id, identifier } | null
  const customerEmail = customer?.emailAddress ?? null; // optional label for the button

  const links = <FeatureLinks />;

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <HeaderBar
          drawerOpened={drawerOpened}
          onToggleDrawer={toggleDrawer}
          user={accountUser} // ← pass Vendure `me` shape
          customerEmail={customerEmail} // ← optional for display
          onLogout={logout} // ← hook up logout
        />
        <NavBar links={links} />
      </header>
      <MobileDrawer opened={drawerOpened} onClose={closeDrawer} links={links} />
    </Box>
  );
}

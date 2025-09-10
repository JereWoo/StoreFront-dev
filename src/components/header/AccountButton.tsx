import { Menu, Button, Group } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import {
  IconUser,
  IconShoppingCart,
  IconEye,
  IconMessageCircle,
  IconHistory,
  IconBooks,
  IconPlus,
  IconChartBar,
  IconCreditCard,
  IconHelpCircle,
  IconSettings,
  IconPower,
} from "@tabler/icons-react";

type AccountUser = { id: string; email: string } | null;

export function AccountButton({
  user,
  onLogout,
}: {
  user: AccountUser;
  onLogout: () => void;
}) {
  if (!user) {
    const currentPath =
      typeof window !== "undefined" ? location.pathname + location.search : "/";
    return (
      <Group visibleFrom="sm">
        <Link
          to="/auth/sign-in"
          search={{ redirect: currentPath }}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-700 hover:text-emerald-700 transition-colors"
        >
          <IconUser size={18} />
          <span>Login / Sign Up</span>
        </Link>
      </Group>
    );
  }

  return (
    <Group visibleFrom="sm">
      <Menu shadow="md" width={220} withinPortal>
        <Menu.Target>
          <Button
            variant="subtle"
            color="dark"
            className="flex items-center gap-2 px-4 py-2"
            leftSection={<IconUser size={18} />}
          >
            <span className="hidden sm:inline truncate max-w-40">
              {user.email}
            </span>
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {/* Collecting */}
          <Menu.Label>Collecting</Menu.Label>
          <Menu.Item
            component={Link}
            to="/account/purchases"
            leftSection={<IconShoppingCart size={18} />}
          >
            Purchases
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/account/watchlist"
            leftSection={<IconEye size={18} />}
          >
            Watchlist
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/account/bids"
            leftSection={<IconMessageCircle size={18} />}
          >
            Bids & Offers
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/account/recently-viewed"
            leftSection={<IconHistory size={18} />}
          >
            Recently Viewed
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/collection"
            leftSection={<IconBooks size={18} />}
          >
            My Collection
          </Menu.Item>

          <Menu.Divider />

          {/* Selling */}
          <Menu.Label>Selling</Menu.Label>
          <Menu.Item
            component={Link}
            to="/sell/new"
            leftSection={<IconPlus size={18} />}
          >
            List an Item
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/sell/dashboard"
            leftSection={<IconChartBar size={18} />}
          >
            Seller Dashboard
          </Menu.Item>

          <Menu.Divider />

          {/* Account */}
          <Menu.Label>Account</Menu.Label>
          <Menu.Item
            component={Link}
            to="/account/payments"
            leftSection={<IconCreditCard size={18} />}
          >
            Payments
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/help"
            leftSection={<IconHelpCircle size={18} />}
          >
            Help
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/account/settings"
            leftSection={<IconSettings size={18} />}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            color="red"
            onClick={onLogout}
            leftSection={<IconPower size={18} />}
          >
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

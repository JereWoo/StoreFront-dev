import { Outlet, createFileRoute } from "@tanstack/react-router";
import "@mantine/core/styles.css";
import { HeaderMegaMenu } from "@/components/header/header";
import { FooterLinks } from "@/components/mantine/footer.tsx";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <main className="flex-1">
      <HeaderMegaMenu />
      <Outlet />
      <FooterLinks />
    </main>
  );
}

import { AppShell, Title, NavLink } from '@mantine/core';
import { Outlet, Link } from 'react-router-dom'; // Import Outlet and Link

function Layout() {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section mt="xs">
            <Title order={3} p="xs">Menü</Title>
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            {/* These NavLinks use React Router's Link component for navigation */}
            <NavLink label="Kitaplar" component={Link} to="/" />
            <NavLink label="Öğrenciler" component={Link} to="/students" />
            <NavLink label="Ödünç Alma" component={Link} to="/checkouts" />
          </Navbar.Section>
          <Navbar.Section>
            {/* Logout button or user profile can go here */}
            <NavLink label="Çıkış Yap" component={Link} to="/login" />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Title order={2}>Kütüphane Yönetim Sistemi</Title>
        </Header>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {/* This is where the content of the current page will be rendered */}
      <Outlet />
    </AppShell>
  );
}

export default Layout;

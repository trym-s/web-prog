import { AppShell, Title, NavLink } from '@mantine/core';
import { Outlet, Link } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
function Layout() {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >
      {/* HEADER KULLANIMI */}
      <AppShell.Header p="xs">
        <Title order={2}>Kütüphane Yönetim Sistemi</Title>
      <Notifications /> {/* 2. Add Notifications component here */}
      </AppShell.Header>
      <AppShell.Navbar p="xs">
        <AppShell.Section mt="xs">
          <Title order={3} p="xs">Menü</Title>
        </AppShell.Section>
        <AppShell.Section grow mt="md">
          <NavLink label="Kitaplar" component={Link} to="/" />
          <NavLink label="Öğrenciler" component={Link} to="/students" />
          <NavLink label="Ödünç Alma" component={Link} to="/checkouts" />
        </AppShell.Section>
        <AppShell.Section>
          <NavLink label="Çıkış Yap" component={Link} to="/login" />
        </AppShell.Section>
      </AppShell.Navbar>

      {/* ANA İÇERİK ALANI */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;

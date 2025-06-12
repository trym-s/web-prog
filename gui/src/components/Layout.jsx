import { AppShell, Title, NavLink, Divider, Text } from '@mantine/core'; // Text ve Divider eklendi
import { Outlet, Link } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext'; // useAuth hook'unu içe aktar

function Layout() {
  const { user } = useAuth(); // Kimlik doğrulama bağlamından kullanıcı bilgilerini al

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
      styles={{
        main: { backgroundColor: 'var(--color-background)' },
      }}
    >
      {/* HEADER KULLANIMI */}
      <AppShell.Header p="xs" style={{ backgroundColor: 'var(--color-dark-2)', color: '#fff' }}>
        <Title order={2}>Kütüphane Yönetim Sistemi</Title>
      <Notifications /> {/* 2. Add Notifications component here */}
      </AppShell.Header>
      
      <AppShell.Navbar p="xs" style={{ backgroundColor: 'var(--color-dark-1)', color: '#fff' }}>
        {/* Hoşgeldin Mesajı */}
        <AppShell.Section mt="xs" mb="md">
          {user ? (
            <Title order={3} p="xs">Hoşgeldin {user.firstName} {user.lastName}</Title> // Kullanıcı adı ve soyadını göster
          ) : (
            <Title order={3} p="xs">Hoşgeldin Ziyaretçi</Title> // Kullanıcı yoksa varsayılan mesaj
          )}
          <Divider my="sm" /> {/* Ayırıcı ekle */}
        </AppShell.Section>

        {/* ANA NAVİGASYON BAĞLANTILARI */}
        <AppShell.Section grow mt="md">
          {user?.role === 'admin' ? (
            <>
              <NavLink label="Kitaplar" component={Link} to="/admin/books" />
              <NavLink label="Yönetim" component={Link} to="/admin" />
            </>
          ) : (
            <>
              <NavLink label="Kitaplar" component={Link} to="/" />
              <NavLink label="Ödünç Aldıklarım" component={Link} to="/my-borrowed-books" />
            </>
          )}
        </AppShell.Section>

        {/* ALT NAVİGASYON BAĞLANTILARI */}
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

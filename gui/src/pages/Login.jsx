import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Center } from '@mantine/core';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Logging in with:', { username, password });
    // TODO: Connect to backend API
    // Simulating network request
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Container size={420} my={40}>
        <Title align="center" order={1} mb="md">
          Kütüphane Sistemi
        </Title>
        <Paper withBorder shadow="md" p={30} radius="md" component="form" onSubmit={handleSubmit}>
          <TextInput
            label="Kullanıcı Adı"
            placeholder="Kullanıcı adınız"
            required
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <PasswordInput
            label="Parola"
            placeholder="Parolanız"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Giriş Yap
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}

export default LoginPage;

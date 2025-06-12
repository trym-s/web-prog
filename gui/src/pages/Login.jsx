import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Center, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş yapılamadı.');
      }
      
      // Use the login function from AuthContext
      login(data.token);
      
      // Redirect to homepage on successful login
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Container size={420} my={40}>
        <Title align="center" order={1} mb="md">
          Kütüphane Sistemi
        </Title>
        <Paper withBorder shadow="md" p={30} radius="md" component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Hata!" color="red" mb="md">
              {error}
            </Alert>
          )}
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

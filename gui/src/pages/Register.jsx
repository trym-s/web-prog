import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Center, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create student record
      const studentRes = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          studentNumber,
        }),
      });
      const studentData = await studentRes.json();
      if (!studentRes.ok) {
        throw new Error(studentData.message || 'Öğrenci oluşturulamadı.');
      }

      // 2. Create user linked to the student
      const userRes = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          studentId: studentData.id,
        }),
      });
      const userData = await userRes.json();
      if (!userRes.ok) {
        throw new Error(userData.message || 'Kullanıcı oluşturulamadı.');
      }

      notifications.show({
        title: 'Başarılı!',
        message: 'Kayıt işlemi tamamlandı. Giriş yapabilirsiniz.',
        color: 'green',
      });
      navigate('/login');
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
          Kayıt Ol
        </Title>
        <Paper withBorder shadow="md" p={30} radius="md" component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Hata!" color="red" mb="md">
              {error}
            </Alert>
          )}
          <TextInput
            label="Ad"
            placeholder="Adınız"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
          />
          <TextInput
            label="Soyad"
            placeholder="Soyadınız"
            required
            mt="md"
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
          />
          <TextInput
            label="Öğrenci No"
            placeholder="Öğrenci numaranız"
            required
            mt="md"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.currentTarget.value)}
          />
          <TextInput
            label="Kullanıcı Adı"
            placeholder="Kullanıcı adınız"
            required
            mt="md"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <PasswordInput
            label="Parola"
            placeholder="Parolanız"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Kayıt Ol
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}

export default RegisterPage;

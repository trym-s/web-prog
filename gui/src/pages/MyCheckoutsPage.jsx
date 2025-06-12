import { useState, useEffect } from 'react';
import { Title, Table, Badge, Text, ScrollArea, Paper } from '@mantine/core';
import { useAuth } from '../context/AuthContext';

function MyCheckoutsPage() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    // Bu effect, sadece bu kullanıcıya ait kayıtları getiren API'ı çağırır.
    const fetchMyCheckouts = async () => {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/api/checkouts/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Ödünç aldığınız kitaplar getirilirken bir hata oluştu.');
        }

        const data = await response.json();
        setCheckouts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCheckouts();
  }, [token]);

  const rows = checkouts.map((item) => (
    <tr key={item.id}>
      <td>{item.bookTitle}</td>
      <td>{new Date(item.checkout_date).toLocaleDateString()}</td>
      <td>{new Date(item.due_date).toLocaleDateString()}</td>
      <td>
        {item.return_date ? (
          <Badge color="gray" variant="filled">
            İade Edildi
          </Badge>
        ) : (
          <Badge color="green" variant="light">
            Sizde
          </Badge>
        )}
      </td>
    </tr>
  ));

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Paper withBorder shadow="md" p="md">
      <Title order={2} mb="lg">Ödünç Aldığım Kitaplar</Title>
      {checkouts.length > 0 ? (
        <ScrollArea>
          <Table sx={{ minWidth: 700 }} verticalSpacing="sm" striped highlightOnHover>
            <thead>
              <tr>
                <th>Kitap Adı</th>
                <th>Alınma Tarihi</th>
                <th>Teslim Tarihi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      ) : (
        <Text>Şu anda ödünç aldığınız bir kitap bulunmamaktadır.</Text>
      )}
    </Paper>
  );
}

export default MyCheckoutsPage;

import { useState, useEffect } from 'react';
import { Title, Table, Badge, Text, ScrollArea } from '@mantine/core';
import { useAuth } from '../context/AuthContext';

function CheckoutsPage() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // We need the token for authenticated requests

  useEffect(() => {
    const fetchCheckouts = async () => {
      if (!token) {
        setLoading(false);
        setError("Bu sayfayı görüntülemek için giriş yapmalısınız.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3000/api/my', {
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token for authorization
          },
        });

        if (!response.ok) {
          throw new Error('Ödünç alma kayıtları getirilirken bir hata oluştu.');
        }

        const data = await response.json();
        setCheckouts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, [token]); // Re-fetch if the token changes (e.g., on login/logout)

  const rows = checkouts.map((item) => (
    <tr key={item.id}>
      <td>{item.bookTitle}</td>
      <td>{item.studentName}</td>
      <td>{new Date(item.checkout_date).toLocaleDateString()}</td>
      <td>{new Date(item.due_date).toLocaleDateString()}</td>
      <td>
        {item.return_date ? (
          <Badge color="gray" variant="filled">
            İade Edildi
          </Badge>
        ) : (
          <Badge color="green" variant="light">
            Ödünç Alındı
          </Badge>
        )}
      </td>
    </tr>
  ));

  return (
    <>
      <Title order={2} mb="lg">Ödünç Alma Kayıtları</Title>
      
      {loading && <p>Yükleniyor...</p>}
      {error && <Text color="red">{error}</Text>}
      
      {!loading && !error && (
        <ScrollArea>
          <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
            <thead>
              <tr>
                <th>Kitap Adı</th>
                <th>Öğrenci</th>
                <th>Alınma Tarihi</th>
                <th>Teslim Tarihi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
}

export default CheckoutsPage;

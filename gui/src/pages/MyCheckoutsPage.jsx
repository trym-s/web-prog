import { useState, useEffect } from 'react';
import { Title, Text, Paper, Image, Button, Card, Group, Badge, SimpleGrid, Table, ScrollArea } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { notifications } from '@mantine/notifications';

function MyCheckoutsPage() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyCheckouts = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/checkouts/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Kitaplarınız getirilirken bir hata oluştu.');
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

  const handleReturnBook = async (checkoutId, bookTitle) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:3000/api/checkouts/${checkoutId}/return`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Kitap iade edilemedi.');
      }
      // Başarılı iade sonrası listeyi anında güncelle
      setCheckouts(currentCheckouts =>
        currentCheckouts.map(checkout =>
          checkout.id === checkoutId ? { ...checkout, return_date: new Date().toISOString() } : checkout
        )
      );
      notifications.show({
        title: 'Başarılı!',
        message: `'${bookTitle}' adlı kitap iade edildi.`,
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata!',
        message: error.message,
        color: 'red',
      });
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <Text color="red">{error}</Text>;

  // --- YENİ MANTIK: Aktif ve iade edilmiş kitapları ayır ---
  const activeCheckouts = checkouts.filter(c => !c.return_date);
  const returnedCheckouts = checkouts.filter(c => c.return_date);

  return (
    <Paper p="md">
      <Title order={2} mb="xl">Kitaplarım</Title>
      
      {/* --- BÖLÜM 1: AKTİF KİTAPLAR --- */}
      <Title order={3} mb="md">Şu An Sendekiler ({activeCheckouts.length})</Title>
      {activeCheckouts.length > 0 ? (
        <SimpleGrid cols={3} spacing="lg" verticalSpacing="lg">
          {activeCheckouts.map((checkout) => {
            const isOverdue = new Date(checkout.due_date) < new Date();
            return (
              <Card key={checkout.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={checkout.cover_image_url}
                    height={220}
                    alt={checkout.bookTitle}
                    fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok"
                  />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500} lineClamp={1}>{checkout.bookTitle}</Text>
                  <Badge color={isOverdue ? 'red' : 'blue'} variant="light">
                    {isOverdue ? 'GECİKTİ' : 'Sende'}
                  </Badge>
                </Group>

                <Text size="sm" color="dimmed">
                  Son Teslim: 
                  <Text span weight={700} color={isOverdue ? 'red' : 'dimmed'}>
                    {' '}{new Date(checkout.due_date).toLocaleDateString()}
                  </Text>
                </Text>

                <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => handleReturnBook(checkout.id, checkout.bookTitle)}>
                  İade Et
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      ) : (
        <Text color="dimmed">Şu anda ödünç aldığınız bir kitap bulunmamaktadır.</Text>
      )}

      {/* --- BÖLÜM 2: İADE EDİLMİŞ KİTAPLAR --- */}
      <Title order={3} mb="md" mt="xl">Daha Önce Aldıkların ({returnedCheckouts.length})</Title>
       {returnedCheckouts.length > 0 ? (
        <ScrollArea>
           <Table sx={{ minWidth: 700 }} verticalSpacing="sm" striped highlightOnHover>
            <thead>
              <tr>
                <th>Kitap Adı</th>
                <th>Yazar</th>
                <th>İade Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {returnedCheckouts.map(item => (
                <tr key={item.id}>
                  <td>{item.bookTitle}</td>
                  <td>{item.bookAuthor}</td>
                  <td>{new Date(item.return_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
       ) : (
        <Text color="dimmed">Daha önce ödünç alıp iade ettiğiniz bir kitap bulunmamaktadır.</Text>
       )}
    </Paper>
  );
}

export default MyCheckoutsPage;

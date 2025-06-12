import { useState, useEffect } from 'react';
import { Title, TextInput, Card, SimpleGrid, Text, Image, Modal, Button, Group, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce'; // Debounce hook'umuzu import ediyoruz

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Arama terimini 500ms geciktir

  const [selectedBook, setSelectedBook] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { user, token } = useAuth();

  // useEffect artık normal arama terimi yerine GECİKTİRİLMİŞ olana bağlı
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      // API isteği için geciktirilmiş arama terimini kullan
      const apiUrl = `http://localhost:3000/api/books?search=${debouncedSearchTerm}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Kitaplar getirilirken bir hata oluştu.');
        const result = await response.json();
        setBooks(result.data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [debouncedSearchTerm]); // <-- Kritik: Bağımlılık burada!

  const handleCardClick = (book) => {
    setSelectedBook(book);
    open();
  };

  const handleCheckout = async () => {
    if (!user || !token || !selectedBook) return;

    try {
      const response = await fetch('http://localhost:3000/api/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: user.studentId, bookId: selectedBook.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ödünç alma işlemi başarısız.');

      notifications.show({
        title: 'Başarılı!',
        message: `'${selectedBook.title}' adlı kitabı ödünç aldınız.`,
        color: 'green',
      });

      // Veriyi yeniden çekerek listeyi güncellemek yerine,
      // sadece ödünç alınan kitabın state'ini güncelleyebiliriz (daha performanslı).
      setBooks(currentBooks => 
        currentBooks.map(b => 
          b.id === selectedBook.id ? { ...b, available_quantity: b.available_quantity - 1 } : b
        )
      );
      close();
      
    } catch (err) {
      notifications.show({
        title: 'Hata!',
        message: err.message,
        color: 'red',
      });
    }
  };

  return (
    <>
      <Title order={2} mb="lg">Kitap Kataloğu</Title>
      
      {/* ARAMA KUTUSU */}
      <TextInput
        placeholder="Kitap veya yazar ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="xl"
      />

      {/* DETAY POPUP'I (MODAL) */}
      <Modal opened={opened} onClose={close} title={selectedBook?.title} size="lg">
        {selectedBook && (
          <div>
            <Image src={selectedBook.cover_image_url} height={200} fit="contain" mb="md" />
            <Title order={3}>{selectedBook.title}</Title>
            <Text size="md" color="dimmed" mb="sm">{selectedBook.author}</Text>
            <Badge color={selectedBook.available_quantity > 0 ? 'green' : 'red'} variant="light">
              {selectedBook.available_quantity > 0 ? `Mevcut: ${selectedBook.available_quantity}` : 'Mevcut Değil'}
            </Badge>
            <Text size="sm" mt="md">{selectedBook.description || 'Açıklama mevcut değil.'}</Text>
            <Text size="xs" color="dimmed" mt="lg">Sayfa Sayısı: {selectedBook.page_number || 'Belirtilmemiş'}</Text>
            
            <Group position="right" mt="xl">
              <Button
                disabled={selectedBook.available_quantity < 1 || !user}
                onClick={handleCheckout}
              >
                Ödünç Al
              </Button>
            </Group>
          </div>
        )}
      </Modal>

      {/* KİTAP LİSTESİ */}
      {loading && <p>Yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}
      <SimpleGrid cols={4} mt="md">
        {!loading && !error && books.length === 0 && (
          <Text>Sonuç bulunamadı.</Text>
        )}
        {books.map((book) => (
          <Card 
            shadow="sm" 
            p="lg" 
            radius="md" 
            withBorder 
            key={book.id} 
            onClick={() => handleCardClick(book)}
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            component="button"
          >
            <Card.Section>
              <Image src={book.cover_image_url} height={250} alt={book.title} />
            </Card.Section>
            <Text weight={500} mt="md" lineClamp={1}>{book.title}</Text>
            <Text size="sm" color="dimmed">{book.author}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}

export default BookListPage;

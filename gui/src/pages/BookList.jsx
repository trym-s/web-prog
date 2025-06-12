import { useState, useEffect } from 'react';
import { Title, TextInput, Card, SimpleGrid, Text, Image, Modal, Button, Group, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';

function BookListPage() {
  // --- STATE MANAGEMENT ---
  // Data states
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search input

  // Modal states
  const [selectedBook, setSelectedBook] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  
  // Authentication context
  const { user, token } = useAuth();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      // Use the debounced search term for API calls
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
  }, [debouncedSearchTerm]); // Re-run only when the debounced search term changes

  // --- HANDLER FUNCTIONS ---
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
          'Authorization': `Bearer ${token}`, // Send token for authentication
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

      // Update the book's quantity locally for better performance instead of a full refetch
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

  // --- RENDER ---
  return (
    <>
      <Title order={2} mb="lg">Kitap Kataloğu</Title>
      
      {/* SEARCH INPUT */}
      <TextInput
        placeholder="Kitap veya yazar ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="xl"
      />

      {/* BOOK DETAIL MODAL (POPUP) */}
      <Modal opened={opened} onClose={close} title={selectedBook?.title} size="lg" centered>
        {selectedBook && (
          <div>
            <Image src={selectedBook.cover_image_url} height={200} fit="contain" mb="md" fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok" />
            <Title order={3}>{selectedBook.title}</Title>
            <Text size="md" color="dimmed" mb="sm">{selectedBook.author}</Text>
            <Badge color={selectedBook.available_quantity > 0 ? 'green' : 'red'} variant="light">
              {selectedBook.available_quantity > 0 ? `Mevcut: ${selectedBook.available_quantity}` : 'Mevcut Değil'}
            </Badge>
            <Text size="sm" mt="md">{selectedBook.description || 'Açıklama mevcut değil.'}</Text>
            <Text size="xs" color="dimmed" mt="lg">Sayfa Sayısı: {selectedBook.page_number || 'Belirtilmemiş'}</Text>
            
            <Group position="right" mt="xl">
              <Button onClick={close} variant="default">Kapat</Button>
              <Button
                disabled={selectedBook.available_quantity < 1 || !user || user.role !== 'student'}
                onClick={handleCheckout}
                title={user?.role !== 'student' ? 'Sadece öğrenciler ödünç alabilir' : ''}
              >
                Ödünç Al
              </Button>
            </Group>
          </div>
        )}
      </Modal>

      {/* BOOK LIST GRID */}
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
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            component="button"
          >
            <div>
              <Card.Section>
                <Image
                  src={book.cover_image_url}
                  height={250}
                  alt={book.title}
                  fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok"
                />
              </Card.Section>
              <Text weight={500} mt="md" lineClamp={2}>{book.title}</Text>
            </div>
            <Text size="sm" color="dimmed" mt="xs">{book.author}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}

export default BookListPage;


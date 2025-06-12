import { useState, useEffect } from 'react';
// DatePickerInput import'u kaldırıldı
import { Title, TextInput, Card, SimpleGrid, Text, Image, Modal, Button, Group, Badge, SegmentedControl, Center, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
// 'dayjs/locale/tr' import'u kaldırıldı

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [selectedBook, setSelectedBook] = useState(null);
  // selectedDueDate state'i kaldırıldı
  const [opened, { open, close }] = useDisclosure(false);
  
  const { user, token } = useAuth();

  // useEffect (veri çekme) bloğu aynı kalabilir.
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('search', debouncedSearchTerm);
      if (availabilityFilter !== 'all') {
        params.append('availability', availabilityFilter);
      }
      const apiUrl = `http://localhost:3000/api/books?${params.toString()}`;
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
  }, [debouncedSearchTerm, availabilityFilter]);

  // handleModalOpen fonksiyonu kaldırılıp eski handleCardClick'e dönüldü
  const handleCardClick = (book) => {
    setSelectedBook(book);
    open();
  };

  const handleCheckout = async () => {
    if (!user || !token || !selectedBook) return;

    try {
      const response = await fetch('http://localhost:3000/api/checkouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        // Request body'den dueDate kaldırıldı
        body: JSON.stringify({ 
          studentId: user.studentId, 
          bookId: selectedBook.id 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ödünç alma işlemi başarısız.');

      notifications.show({
        title: 'Başarılı!',
        message: `'${selectedBook.title}' adlı kitabı ödünç aldınız.`,
        color: 'green',
      });

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
      
      {/* FILTERS */}
      <Group position="apart" mb="xl">
        <TextInput
          placeholder="Kitap veya yazar ara..."
          style={{ flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SegmentedControl
          value={availabilityFilter}
          onChange={setAvailabilityFilter}
          data={[
            { label: 'Tümü', value: 'all' },
            { label: 'Alınabilir', value: 'available' },
            { label: 'Tükenenler', value: 'unavailable' },
          ]}
        />
      </Group>

      {/* BOOK DETAIL MODAL (POPUP) - DatePicker kaldırıldı */}
      <Modal opened={opened} onClose={close} title={selectedBook?.title} size="lg" centered
      styles={{
          inner: {
            left: '50%',
            transform: 'translateX(-50%)',
          },
        }}
      >
        {selectedBook && (
          <div>
            <Image src={selectedBook.cover_image_url} height={200} fit="contain" mb="md" fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok" />
            <Title order={3}>{selectedBook.title}</Title>
            <Text size="md" color="dimmed" mb="sm">{selectedBook.author}</Text>
            <Badge color={selectedBook.available_quantity > 0 ? 'green' : 'red'} variant="light">
              {selectedBook.available_quantity > 0 ? `Mevcut: ${selectedBook.available_quantity}` : 'Tükendi'}
            </Badge>
            <Text size="sm" mt="md">{selectedBook.description || 'Açıklama mevcut değil.'}</Text>
            <Text size="xs" color="dimmed" mt="lg">Sayfa Sayısı: {selectedBook.page_number || 'Belirtilmemiş'}</Text>
            
            <Group position="right" mt="xl">
              <Button onClick={close} variant="default">Kapat</Button>
              <Button
                // disabled koşulundan tarih kontrolü kaldırıldı
                disabled={selectedBook.available_quantity < 1 || !user || user.role !== 'student'}
                onClick={handleCheckout}
                title={!user ? 'Giriş yapmalısınız' : user.role !== 'student' ? 'Sadece öğrenciler ödünç alabilir' : ''}
              >
                Ödünç Al
              </Button>
            </Group>
          </div>
        )}
      </Modal>

      {/* BOOK LIST GRID */}
      <SimpleGrid cols={4} spacing="lg" verticalSpacing="lg" mt="md">
        {books.map((book) => {
          const isAvailable = book.available_quantity > 0;
          return (
            <Card 
              shadow="sm" p={0} radius="md" withBorder key={book.id}
              onClick={() => handleCardClick(book)}
              style={{ cursor: 'pointer' }} component="button"
            >
              <Card.Section>
                <Image
                  src={book.cover_image_url}
                  height={250} alt={book.title}
                  fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok"
                  style={{ filter: isAvailable ? 'none' : 'grayscale(80%)', opacity: isAvailable ? 1 : 0.7 }}
                />
              </Card.Section>
              <div style={{ padding: 'var(--mantine-spacing-md)', paddingTop: 0, textAlign: 'left' }}>
                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500} lineClamp={1}>{book.title}</Text>
                </Group>
                <Text size="sm" color="dimmed">{book.author}</Text>
                 {!isAvailable && (
                    <Text color="red" size="sm" weight={700} mt="xs">Ödünç Alınamaz</Text>
                 )}
              </div>
            </Card>
          );
        })}
      </SimpleGrid>
    </>
  );
}

export default BookListPage;

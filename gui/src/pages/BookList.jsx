
// gui/src/pages/BookList.jsx
import { useState, useEffect } from 'react';
import {
  Title,
  TextInput,
  Card,
  SimpleGrid,
  Text,
  Image,
  Modal,
  Button,
  Group,
  Badge,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';

function BookListPage() {
  // --- STATE MANAGEMENT ---
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedBook, setSelectedBook] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { user, token } = useAuth();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
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
  }, [debouncedSearchTerm]);

  // --- HANDLERS ---
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
        body: JSON.stringify({
          studentId: user.studentId,
          bookId: selectedBook.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ödünç alma işlemi başarısız.');

      notifications.show({
        title: 'Başarılı!',
        message: `'${selectedBook.title}' adlı kitabı ödünç aldınız.`,
        color: 'green',
        autoClose: 3000,
      });

      setBooks((currentBooks) =>
        currentBooks.map((b) =>
          b.id === selectedBook.id
            ? { ...b, available_quantity: b.available_quantity - 1 }
            : b
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
      <Title order={2} mb="lg">
        Kitap Kataloğu
      </Title>

      {/* SEARCH INPUT */}
      <TextInput
        placeholder="Kitap veya yazar ara..."
        icon={<IconSearch size="1rem" />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        rightSection={loading ? <Text size="xs" color="dimmed">Aranıyor...</Text> : null}
        mb="xl"
      />

      {/* FEEDBACK */}
      {!loading && !error && (
        <Text mb="sm" size="sm" color="dimmed">
          {books.length > 0
            ? `${books.length} kitap bulundu.`
            : 'Sonuç bulunamadı. Farklı bir kelimeyle tekrar deneyin.'}
        </Text>
      )}
      {error && (
        <Text color="red" mb="sm">
          ⚠️ Hata: {error}
        </Text>
      )}

      {/* BOOK DETAIL MODAL */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedBook?.title}
        size="lg"
        centered
        styles={{
          inner: {
            left: '50%',
            transform: 'translateX(-50%)',
          },
        }}
      >
        {selectedBook && (
          <div>
            <Image
              src={selectedBook.cover_image_url}
              height={200}
              fit="contain"
              mb="md"
              fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok"
            />

            <Title order={3} mb="xs">
              {selectedBook.title}
            </Title>
            <Text size="sm" color="dimmed" mb="xs">
              Yazar: {selectedBook.author}
            </Text>

            <Group mb="sm">
              <Badge
                color={selectedBook.available_quantity > 0 ? 'green' : 'red'}
                variant="light"
              >
                {selectedBook.available_quantity > 0
                  ? `Mevcut: ${selectedBook.available_quantity}`
                  : 'Mevcut Değil'}
              </Badge>
              <Badge color="blue" variant="light">
                Sayfa: {selectedBook.page_number || 'Belirtilmemiş'}
              </Badge>
            </Group>

            <Text size="sm" mt="sm">
              {selectedBook.description || 'Açıklama mevcut değil.'}
            </Text>

            {user?.role !== 'student' && (
              <Text size="xs" color="red" mt="sm">
                Sadece öğrenciler kitap ödünç alabilir.
              </Text>
            )}

            <Group position="right" mt="xl">
              <Button onClick={close} variant="default">
                Kapat
              </Button>
              <Button
                disabled={
                  selectedBook.available_quantity < 1 ||
                  !user ||
                  user.role !== 'student'
                }
                onClick={handleCheckout}
              >
                Ödünç Al
              </Button>
            </Group>
          </div>
        )}
      </Modal>

      {/* BOOK LIST */}
      {loading && <Text>Yükleniyor...</Text>}
      <SimpleGrid cols={4} mt="md">
        {!loading &&
          books.map((book) => (
            <Card
              shadow="lg"
              p="lg"
              radius="xl"
              withBorder
              key={book.id}
              onClick={() => handleCardClick(book)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                 transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Hover efekti için geçiş eklendi
                 '&:hover': { 
                 transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)', // Daha büyük gölge
                 },
                 }}
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
                <Text weight={500} mt="md" lineClamp={2}>
                  {book.title}
                </Text>
              </div>
              <Text size="sm" color="dimmed" mt="xs">
                {book.author}
              </Text>
            </Card>
          ))}
      </SimpleGrid>
    </>
  );
}

export default BookListPage;


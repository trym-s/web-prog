import { useState, useEffect } from 'react';
import { Title, TextInput, Card, SimpleGrid, Text } from '@mantine/core';

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const apiUrl = `http://localhost:3000/api/books?search=${searchTerm}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setBooks(result.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm]);

  return (
    <>
      <Title order={2} mb="lg">Kitap Kataloğu</Title>
      <TextInput
        placeholder="Kitap veya yazar ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="xl"
      />
      {loading && <p>Yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}
      <SimpleGrid cols={3}>
        {books.map((book) => (
          <Card shadow="sm" p="lg" radius="md" withBorder key={book.id}>
            <Text weight={500}>{book.title}</Text>
            <Text size="sm" color="dimmed">{book.author}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}

export default BookListPage;

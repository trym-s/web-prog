import { useState, useEffect } from 'react';
import { Title, Card, SimpleGrid, Image, Text, Button, Modal, TextInput, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../context/AuthContext';
import { notifications } from '@mantine/notifications';

function AdminBooksPage() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', quantity: 1 });

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/books');
      const data = await res.json();
      setBooks(data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFormChange = (field) => (e) => {
    setForm({ ...form, [field]: e.currentTarget.value });
  };

  const handleAdd = () => {
    setEditingBook(null);
    setForm({ title: '', author: '', quantity: 1 });
    open();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({ title: book.title, author: book.author, quantity: book.quantity });
    open();
  };

  const handleSave = async () => {
    const method = editingBook ? 'PUT' : 'POST';
    const url = editingBook
      ? `http://localhost:3000/api/books/${editingBook.id}`
      : 'http://localhost:3000/api/books';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      await fetchBooks();
      close();
      notifications.show({ title: 'Başarılı', message: 'Kaydedildi', color: 'green' });
    } catch (e) {
      notifications.show({ title: 'Hata', message: e.message, color: 'red' });
    }
  };

  const handleDelete = async () => {
    if (!editingBook) return;
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/books/${editingBook.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      await fetchBooks();
      close();
      notifications.show({ title: 'Başarılı', message: 'Kitap silindi', color: 'green' });
    } catch (e) {
      notifications.show({ title: 'Hata', message: e.message, color: 'red' });
    }
  };

  return (
    <div>
      <Group position="apart" mb="md">
        <Title order={2}>Kitaplar</Title>
        <Button onClick={handleAdd}>Kitap Ekle</Button>
      </Group>
      <SimpleGrid cols={4} spacing="lg" verticalSpacing="lg">
        {books.map((book) => (
          <Card key={book.id} shadow="sm" p={0} radius="md" withBorder>
            <Card.Section>
              <Image
                src={book.cover_image_url}
                height={250}
                alt={book.title}
                fallbackSrc="https://via.placeholder.com/300x450?text=Kapak+Yok"
              />
            </Card.Section>
            <div style={{ padding: 'var(--mantine-spacing-md)', paddingTop: 0, textAlign: 'left' }}>
              <Group position="apart" mt="md" mb="xs">
                <Text weight={500} lineClamp={1}>{book.title}</Text>
              </Group>
              <Text size="sm" color="dimmed">{book.author}</Text>
              <Button mt="sm" onClick={() => handleEdit(book)}>Düzenle</Button>
            </div>
          </Card>
        ))}
      </SimpleGrid>
      <Modal opened={opened} onClose={close} title="Kitap" centered>
        <TextInput label="Başlık" value={form.title} onChange={handleFormChange('title')} required />
        <TextInput label="Yazar" value={form.author} onChange={handleFormChange('author')} mt="sm" required />
        <TextInput label="Adet" type="number" value={form.quantity} onChange={handleFormChange('quantity')} mt="sm" />
        <Group position="apart" mt="md">
          {editingBook && <Button color="red" onClick={handleDelete}>Sil</Button>}
          <Group position="right">
            <Button variant="default" onClick={close}>İptal</Button>
            <Button onClick={handleSave}>Kaydet</Button>
          </Group>
        </Group>
      </Modal>
    </div>
  );
}

export default AdminBooksPage;

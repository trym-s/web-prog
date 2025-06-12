import { useEffect, useState } from 'react';
import { Table, Title, Button, TextInput, Modal, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', quantity: 1 });
  const [editingId, setEditingId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBooks = await fetch('http://localhost:3000/api/books');
        const booksData = await resBooks.json();
        setBooks(booksData.data || []);
        const resCheckouts = await fetch('http://localhost:3000/api/checkouts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const checkoutsData = await resCheckouts.json();
        setCheckouts(checkoutsData);
      } catch (e) {
        console.error(e);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleFormChange = (field) => (e) => {
    setForm({ ...form, [field]: e.currentTarget.value });
  };

  const handleSave = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = `http://localhost:3000/api/books${editingId ? '/' + editingId : ''}`;
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
      const data = await res.json();
      if (editingId) {
        setBooks((b) => b.map((bk) => (bk.id === editingId ? { ...data } : bk)));
      } else {
        setBooks((b) => [...b, data]);
      }
      close();
      setForm({ title: '', author: '', quantity: 1 });
      setEditingId(null);
      notifications.show({ title: 'Başarılı', message: 'Kitap kaydedildi', color: 'green' });
    } catch (e) {
      notifications.show({ title: 'Hata', message: e.message, color: 'red' });
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, quantity: book.quantity });
    open();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setBooks((b) => b.filter((bk) => bk.id !== id));
      notifications.show({ title: 'Başarılı', message: 'Kitap silindi', color: 'green' });
    } catch (e) {
      notifications.show({ title: 'Hata', message: e.message, color: 'red' });
    }
  };

  const bookRows = books.map((b) => (
    <tr key={b.id}>
      <td>{b.title}</td>
      <td>{b.author}</td>
      <td>{b.quantity}</td>
      <td>
        <Button size="xs" mr={4} onClick={() => handleEdit(b)}>
          Düzenle
        </Button>
        <Button size="xs" color="red" onClick={() => handleDelete(b.id)}>
          Sil
        </Button>
      </td>
    </tr>
  ));

  const checkoutRows = checkouts.map((c) => (
    <tr key={c.id}>
      <td>{c.bookTitle}</td>
      <td>{c.studentName}</td>
      <td>{new Date(c.checkout_date).toLocaleDateString()}</td>
      <td>{c.return_date ? new Date(c.return_date).toLocaleDateString() : '-'}</td>
    </tr>
  ));

  return (
    <div>
      <Title order={2} mb="md">Tüm Ödünç Alımlar</Title>
      <Table mb="xl">
        <thead>
          <tr>
            <th>Kitap</th>
            <th>Öğrenci</th>
            <th>Alınma</th>
            <th>İade</th>
          </tr>
        </thead>
        <tbody>{checkoutRows}</tbody>
      </Table>

      <Group position="apart" mb="sm">
        <Title order={2}>Kitaplar</Title>
        <Button onClick={open}>Yeni Kitap</Button>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Yazar</th>
            <th>Adet</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{bookRows}</tbody>
      </Table>

      <Modal opened={opened} onClose={close} title="Kitap" centered>
        <TextInput label="Başlık" value={form.title} onChange={handleFormChange('title')} required />
        <TextInput label="Yazar" value={form.author} onChange={handleFormChange('author')} required mt="sm" />
        <TextInput label="Adet" type="number" value={form.quantity} onChange={handleFormChange('quantity')} mt="sm" />
        <Group position="right" mt="md">
          <Button variant="default" onClick={close}>İptal</Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default AdminPage;

-- schema.sql

-- Önceki tablolar varsa temiz bir başlangıç için onları siler.
-- DİKKAT: Bu komutlar mevcut verileri sileceği için sadece geliştirme ortamında kullanılmalıdır.
DROP TABLE IF EXISTS Checkouts;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Books;

-- Users Tablosu: Sistemi kullanacak personeller için.
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student', -- Bu satırın varlığı önemli
    student_id INTEGER UNIQUE REFERENCES Students(id) ON DELETE SET NULL, -- Ve bu satırın
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Students Tablosu: Kitap ödünç alacak öğrenciler.
CREATE TABLE Students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    student_number TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Books Tablosu: Kütüphanedeki kitap envanteri.
CREATE TABLE Books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT, -- ADDED
    page_number INTEGER, -- ADDED
    cover_image_url TEXT, -- ADDED
    isbn TEXT UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Checkouts Tablosu: Öğrenci ve Kitap arasındaki ödünç alma ilişkisi.
CREATE TABLE Checkouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    checkout_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    due_date TEXT NOT NULL,
    return_date TEXT, -- NULL ise kitap henüz iade edilmemiş demektir.
    FOREIGN KEY (student_id) REFERENCES Students (id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Books (id) ON DELETE RESTRICT
);

-- Hızlı sorgular için indeksler oluşturmak performansı artırır.
CREATE INDEX idx_checkouts_student_id ON Checkouts (student_id);
CREATE INDEX idx_checkouts_book_id ON Checkouts (book_id);
CREATE INDEX idx_books_title ON Books (title);

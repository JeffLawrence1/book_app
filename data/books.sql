DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url TEXT,
    description TEXT,
    bookshelf VARCHAR(255)
);
INSERT INTO books (author, title, isbn, image_url, description)
VALUES ("Terry Pratchett", "The Carpet People", "9780544284715" "http://books.google.com/books/content?id=cVMPAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api\" "Description: In the beginning, there was nothing but endless flatness.")
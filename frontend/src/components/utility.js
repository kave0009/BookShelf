import axios from "axios";

export const genres = [
  { title: "History", link: "history" },
  { title: "Romance", link: "love" },
  { title: "Science Fiction", link: "science-fiction" },
  { title: "Fantasy", link: "fantasy" },
];

export const fetchBooksFromAPI = async (genre, numBooks = 50) => {
  try {
    const response = await axios.get(
      `https://openlibrary.org/subjects/${encodeURIComponent(
        genre
      )}.json?limit=${numBooks}`
    );
    return response.data.works.map((book) => ({
      id: book.cover_edition_key || book.key,
      title: book.title,
      authors: book.authors || [],
      cover_id: book.cover_id,
    }));
  } catch (error) {
    console.error(`Error fetching books from API:`, error);
    return [];
  }
};

export const fetchBooksFromDB = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Expected an array but got:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching books from database:", error);
    return [];
  }
};

const isValidImage = (cover_id) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `https://covers.openlibrary.org/b/id/${cover_id}-L.jpg`;
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
  });
};

export const mergeBookData = async (dbBooks, apiBooks) => {
  const dbBooksMap = new Map();
  dbBooks.forEach((book) => dbBooksMap.set(book.title.toLowerCase(), book));

  const mergedBooksPromises = apiBooks.map(async (apiBook) => {
    const dbBook = dbBooksMap.get(apiBook.title.toLowerCase());
    if (dbBook && apiBook.cover_id) {
      const hasValidImage = await isValidImage(apiBook.cover_id);
      if (hasValidImage) {
        return {
          ...apiBook,
          price: dbBook.price,
          quantity: dbBook.quantity,
          id: dbBook.id,
        };
      }
    }
    return null;
  });

  const mergedBooks = await Promise.all(mergedBooksPromises);
  return mergedBooks.filter((book) => book !== null);
};

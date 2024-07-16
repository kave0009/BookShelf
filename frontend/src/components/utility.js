import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import uuid package

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

export const isValidImage = (cover_id) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `https://covers.openlibrary.org/b/id/${cover_id}-L.jpg`;
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
  });
};

export const mergeBookData = async (dbBooks, apiBooks) => {
  const normalizeTitle = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/gi, "");

  const dbBooksMap = new Map();
  dbBooks.forEach((book) => dbBooksMap.set(normalizeTitle(book.title), book));

  console.log("DB Books Map:", dbBooksMap);

  const mergedBooksPromises = apiBooks.map(async (apiBook) => {
    const normalizedTitle = normalizeTitle(apiBook.title);
    const dbBook = dbBooksMap.get(normalizedTitle);
    console.log(`Checking API Book: ${apiBook.title}`, { apiBook, dbBook });

    if (dbBook && apiBook.cover_id) {
      const hasValidImage = await isValidImage(apiBook.cover_id);
      if (hasValidImage) {
        const mergedBook = {
          ...apiBook,
          price: dbBook.price,
          quantity: dbBook.quantity,
          id: dbBook.id || uuidv4(), // Assign unique ID if not already present
        };
        console.log("Merged Book:", mergedBook);
        return mergedBook;
      }
    }
    return null;
  });

  const mergedBooks = await Promise.all(mergedBooksPromises);
  console.log("Merged books after promises:", mergedBooks);

  return mergedBooks.filter((book) => book !== null);
};

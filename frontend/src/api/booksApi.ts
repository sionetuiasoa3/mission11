import type { Book, PagedBooksResult } from '../types/book'

/**
 * Books API base path. Must end with `/api/books` (no trailing slash after `books`).
 * Local dev: use `'/api/books'` and Vite proxy. Production: full Azure URL.
 */
export const API_URL =
  'https://is413-bookstore-api-gbdkeqftb6azcgc8.francecentral-01.azurewebsites.net/api/books'

export async function fetchDistinctCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/categories`)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<string[]>
}

export async function fetchDistinctClassifications(): Promise<string[]> {
  const res = await fetch(`${API_URL}/classifications`)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<string[]>
}

export async function fetchBooks(
  page: number,
  pageSize: number,
  sortDirection: 'asc' | 'desc',
  selectedCategories: string[],
): Promise<PagedBooksResult> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortDirection,
  })
  const categoryQuery =
    selectedCategories.length > 0
      ? selectedCategories
          .map((c) => `categories=${encodeURIComponent(c)}`)
          .join('&')
      : ''
  const qs = categoryQuery ? `${params.toString()}&${categoryQuery}` : params.toString()
  const res = await fetch(`${API_URL}?${qs}`)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<PagedBooksResult>
}

export type NewBookPayload = Omit<Book, 'bookID'>

export async function addBook(payload: NewBookPayload): Promise<Book> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, bookID: 0 }),
  })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<Book>
}

export async function updateBook(bookId: number, updatedBook: Book): Promise<Book> {
  const res = await fetch(`${API_URL}/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updatedBook, bookID: bookId }),
  })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<Book>
}

export async function deleteBook(bookId: number): Promise<void> {
  const res = await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
}

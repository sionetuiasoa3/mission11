import type { Book, PagedBooksResult } from '../types/book'

/** Base path for books API. For Azure, set to full URL e.g. https://yourapp.azurewebsites.net/api/books */
export const API_URL = '/api/books'

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

export type Book = {
  bookID: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

export type PagedBooksResult = {
  items: Book[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

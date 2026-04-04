# Backend (Bookstore API)

ASP.NET Core Web API in **`BookstoreApi/`** — EF Core, SQLite, REST endpoints for books (list, filter, paginate, **POST / PUT / DELETE** for admin).

**→ Full grading guide, live URLs, and how to run:** see the [repository root `README.md`](../README.md).

| Path | Purpose |
|------|---------|
| `BookstoreApi/Controllers/BooksController.cs` | All `/api/books` routes |
| `BookstoreApi/Data/` | `BookstoreDbContext`, `Bookstore.sqlite` |
| `BookstoreApi/Models/` | `Book`, `PagedBooksResult`, etc. |

```bash
cd BookstoreApi
dotnet run --launch-profile http
```

# Backend (API)

**ASP.NET Core** Web API in **`BookstoreApi/`**.

- **`BookstoreApi/`** — Project root (`BookstoreApi.csproj`, `Program.cs`).
- **`BookstoreApi/Controllers/`** — HTTP endpoints (e.g. `BooksController`).
- **`BookstoreApi/Models/`** — EF entities and DTOs.
- **`BookstoreApi/Data/`** — `BookstoreDbContext` and **`Bookstore.sqlite`**.

Run from the project folder:

```bash
cd BookstoreApi
dotnet run --launch-profile http
```

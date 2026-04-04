# MISSION 13 — Cursor Chunk Prompts

> Copy one chunk at a time into Cursor. Wait for it to finish and for Tua's approval before sending the next one.

Also read **MISSION13.md** for the full spec. Use **MISSION13_PLAN.md** to check off steps. This repo’s backend is **`net10.0`** (not .NET 8) unless you retarget.

---

## CHUNK 1 — Create Git branch

```
Read MISSION13.md in the project root before doing anything.

Then run this in the terminal:
  If branch phase6 does not exist yet:
    git checkout -b phase6
  If it already exists (you started Mission 13 before):
    git checkout phase6

Confirm you are on phase6:
  git branch

Show me the output so I can confirm we are on phase6.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 2 — Backend: Add CRUD endpoints

```
Read MISSION13.md in the project root.

Open backend/BookstoreApi/Controllers/BooksController.cs.
Read the existing file carefully. Do not touch any existing methods.

Add these three new methods inside the BooksController class,
after the existing GetBooks method:

// Add a new book
[HttpPost]
public async Task<ActionResult<Book>> AddBook([FromBody] Book newBook)
{
    _db.Books.Add(newBook);
    await _db.SaveChangesAsync();
    return Ok(newBook);
}

// Update an existing book
[HttpPut("{bookId}")]
public async Task<ActionResult<Book>> UpdateBook(int bookId, [FromBody] Book updatedBook)
{
    var existing = await _db.Books.FindAsync(bookId);
    if (existing == null) return NotFound();

    existing.Title = updatedBook.Title;
    existing.Author = updatedBook.Author;
    existing.Publisher = updatedBook.Publisher;
    existing.ISBN = updatedBook.ISBN;
    existing.Classification = updatedBook.Classification;
    existing.Category = updatedBook.Category;
    existing.PageCount = updatedBook.PageCount;
    existing.Price = updatedBook.Price;

    _db.Books.Update(existing);
    await _db.SaveChangesAsync();
    return Ok(existing);
}

// Delete a book
[HttpDelete("{bookId}")]
public async Task<ActionResult> DeleteBook(int bookId)
{
    var book = await _db.Books.FindAsync(bookId);
    if (book == null) return NotFound("Book not found.");

    _db.Books.Remove(book);
    await _db.SaveChangesAsync();
    return NoContent();
}

After saving, show me the complete updated BooksController.cs file
so I can review it before we continue.

Stop here and wait for my approval before doing anything else.
```

**Note (optional hardening, not in paste above):** If `AddBook` fails because `BookID` is sent as non-zero, set `newBook.BookID = 0` before `Add` so SQLite autoincrement applies. Use `CancellationToken` parameters if you want to match the style of existing controller actions.

---

## CHUNK 3 — Backend: Fix CORS

```
Read MISSION13.md in the project root.

Open backend/BookstoreApi/Program.cs.
Read the existing file carefully.

1. Find the existing AddCors block and replace it entirely with:

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

2. Find app.UseCors() and replace it with:

app.UseCors("AllowAll");

Do not change anything else in Program.cs.

After saving, show me the complete updated Program.cs so I can review it.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 4 — Backend: Fix SQLite for deployment

```
Read MISSION13.md in the project root.

Open backend/BookstoreApi/BookstoreApi.csproj.
Read the existing file carefully.

First check: if Bookstore.sqlite ALREADY has <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
in BookstoreApi.csproj (often as <None Update="Data\Bookstore.sqlite">), Mission 13 is already satisfied —
do not add a second ItemGroup for the same file.

Otherwise add inside <Project>, after existing ItemGroups:

<ItemGroup>
  <Content Include="Data\Bookstore.sqlite">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </Content>
</ItemGroup>

If switching from None to Content, remove the old None block to avoid duplicate copies.

Do not change anything else in the .csproj file unless replacing that duplicate.

After saving, show me the complete updated .csproj file so I can review it.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 5 — Frontend: Create booksApi.ts

```
Read MISSION13.md in the project root.

Create a new folder: frontend/src/api/
Create a new file: frontend/src/api/booksApi.ts

The file must:
- Import the Book and PagedBooksResult types from ../types/book
- Export a const API_URL = '/api/books'
- Export an async fetchBooks() function that takes
  (page, pageSize, sortDirection, selectedCategories) and returns
  Promise<PagedBooksResult> — use the same fetch logic already in
  BookList.tsx as a reference for the query string building
- Export an async addBook() function that takes a book without bookID,
  POSTs to API_URL with Content-Type application/json, and returns
  Promise<Book>
- Export an async updateBook() function that takes (bookId, updatedBook),
  PUTs to API_URL/{bookId}, and returns Promise<Book>
- Export an async deleteBook() function that takes bookId,
  DELETEs at API_URL/{bookId}, and returns Promise<void>
- All functions must throw an Error if response is not ok

Do not modify BookList.tsx — it should keep its own local fetchBooks
for now. We are only creating the new centralized file.

After creating, show me the complete booksApi.ts file so I can review it.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 6 — Frontend: Create AdminBooksPage

```
Read MISSION13.md in the project root.

Create a new file: frontend/src/pages/AdminBooksPage.tsx

Requirements:
- Imports: useState, useEffect from react
- Imports: Book type from ../types/book
- Imports: fetchBooks, deleteBook from ../api/booksApi
- Imports: NewBookForm from ../components/NewBookForm
- Imports: EditBookForm from ../components/EditBookForm
- State: books (Book[]), loading (boolean), error (string|null),
  showAddForm (boolean), editingBook (Book|null)
- On mount: call loadBooks() which calls fetchBooks(1, 100, 'asc', [])
  and sets books to data.items
- loadBooks must handle loading/error state with try/catch/finally
- handleDelete(bookId): window.confirm → if confirmed call deleteBook
  → filter book out of books state → catch shows alert
- JSX structure:
  - h1 heading "Admin — Manage Books"
  - loading alert when loading
  - error alert when error
  - "Add Book" button (btn-success) that sets showAddForm=true,
    only visible when showAddForm is false and editingBook is null
  - NewBookForm shown when showAddForm is true,
    onSuccess: setShowAddForm(false) then loadBooks(),
    onCancel: setShowAddForm(false)
  - EditBookForm shown when editingBook is not null,
    onSuccess: setEditingBook(null) then loadBooks(),
    onCancel: setEditingBook(null)
  - Bootstrap table (table table-bordered table-striped align-middle)
    with thead table-dark
  - Columns: ID, Title, Author, Publisher, ISBN, Classification,
    Category, Pages, Price, Actions
  - Each row maps a book — price formatted with toFixed(2)
  - Actions column: Edit button (btn-sm btn-primary) sets editingBook,
    Delete button (btn-sm btn-danger) calls handleDelete

Use Bootstrap classes throughout. Export as default.

After creating, show me the complete AdminBooksPage.tsx so I can review it.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 7 — Frontend: Create NewBookForm

```
Read MISSION13.md in the project root.

Create a new file: frontend/src/components/NewBookForm.tsx

Requirements:
- Props: onSuccess(() => void), onCancel(() => void)
- State: formData (object with all Book fields except bookID,
  initialized to empty strings / 0 for numbers),
  submitting (boolean), error (string|null)
- handleChange: handles both string fields and number fields
  (pageCount and price should be converted with Number())
  using [e.target.name] dynamic key
- handleSubmit: e.preventDefault() → setSubmitting(true) →
  await addBook(formData) → onSuccess() →
  catch sets error → finally setSubmitting(false)
- JSX: Bootstrap card wrapping a form
  - h2 "Add New Book" as card-title
  - error alert if error exists
  - Input fields in a row g-3 grid (col-md-6 for text fields,
    col-md-3 for pageCount and price):
    title, author, publisher, isbn, classification, category
    (all type="text", required),
    pageCount (type="number", min=1, required),
    price (type="number", min=0, step=0.01, required)
  - Each field has a label and input with name, value, onChange bound
  - Submit button "Add Book" (btn-success), disabled when submitting,
    shows "Adding…" text while submitting
  - Cancel button (btn-secondary, type="button") calls onCancel

Import addBook from ../api/booksApi.
Use Bootstrap classes throughout. Export as default.

After creating, show me the complete NewBookForm.tsx so I can review it.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 8 — Frontend: Create EditBookForm

```
Read MISSION13.md in the project root.

Create a new file: frontend/src/components/EditBookForm.tsx

Requirements:
- Props: book (Book), onSuccess(() => void), onCancel(() => void)
- State: formData initialized to { ...book } (spread the incoming book),
  submitting (boolean), error (string|null)
- handleChange: same pattern as NewBookForm — handles string and number
  fields using [e.target.name] dynamic key
- handleSubmit: e.preventDefault() → setSubmitting(true) →
  await updateBook(formData.bookID, formData) → onSuccess() →
  catch sets error → finally setSubmitting(false)
- JSX: Bootstrap card with border-primary wrapping a form
  - h2 showing "Edit Book — {book.title}" as card-title
  - error alert if error exists
  - Same field layout as NewBookForm but pre-filled from formData
  - bookID field is NOT shown (it's in state but not editable)
  - Submit button "Update Book" (btn-primary), disabled when submitting,
    shows "Saving…" while submitting
  - Cancel button (btn-secondary, type="button") calls onCancel

Import Book type from ../types/book.
Import updateBook from ../api/booksApi.
Use Bootstrap classes throughout. Export as default.

After creating, show me the complete EditBookForm.tsx so I can review it.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 9 — Frontend: Wire up route and nav link

```
Read MISSION13.md in the project root.

Make two small changes only. Do not touch anything else.

CHANGE 1 — Open frontend/src/App.tsx:
- Add this import at the top with the other imports:
    import AdminBooksPage from './pages/AdminBooksPage'
- Add this route inside <Routes> alongside the existing routes:
    <Route path="/adminbooks" element={<AdminBooksPage />} />

CHANGE 2 — Open frontend/src/pages/BookListPage.tsx:
- Find the offcanvas-body div that contains the existing nav links
- Add this link after the existing ones:
    <Link to="/adminbooks" className="btn btn-light text-start" data-bs-dismiss="offcanvas">
      Admin
    </Link>

After saving both files, show me the updated sections of each file
(just the changed parts) so I can review them.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 10 — Frontend: Add routes.json

```
Read MISSION13.md in the project root.

Create a new file: frontend/public/routes.json

File contents must be exactly:
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}

This file is required for Azure Static Web Apps to handle React
routes like /adminbooks correctly. Without it, navigating directly
to /adminbooks will return a 404.

After creating, show me the file contents to confirm it is correct.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 11 — Frontend: Update Vite proxy

```
Read MISSION13.md in the project root.

Open frontend/vite.config.ts.
Replace the entire file contents with:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7255',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

After saving, show me the file to confirm it is correct.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 12 — Local test

```
Read MISSION13.md in the project root. Refer to the Local Test
Checklist section.

Open two terminals and run:
  Terminal 1: cd backend/BookstoreApi && dotnet watch run --launch-profile https
    (Needed when Vite proxies to https://localhost:7255 per CHUNK 11.)
  Terminal 2: cd frontend && npm run dev

Tell me:
1. Whether both servers started without errors
2. Any TypeScript or build errors shown in the terminal
3. The URLs they are running on

I will then test the following manually and tell you if anything
needs fixing:
  - / loads book list
  - /adminbooks loads the admin table
  - Add Book works
  - Edit works
  - Delete works

Do not proceed to deployment until I confirm all tests pass.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 13 — Commit to GitHub

```
Read MISSION13.md in the project root.

Run the following git commands in the terminal from the project root:

  git add .
  git commit -m "Mission 13: CRUD admin page, add/edit/delete books, Azure routes.json"
  git push -u origin phase6

Show me the output of each command so I can confirm the push succeeded.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 14 — Deploy backend to Azure

```
Read MISSION13.md in the project root. Refer to the Azure Deployment
Notes section.

Run these commands in the terminal:
  cd backend/BookstoreApi
  dotnet publish -c Release -o ./publish

Then tell me when the publish folder is ready.

I will then:
1. Open the Azure panel in VS Code
2. Click + and create an App Service Web App
   - Name: bookstore-backend-[my name]
   - Runtime: match BookstoreApi.csproj (this repo uses net10.0 — pick .NET 10 in Azure when available)
   - Tier: Free F1
3. Right-click the app → Deploy to Web App → select the publish folder
4. Copy the deployed URL once it succeeds

Tell me when the publish command is done and wait for me to complete
the Azure steps and give you the backend URL.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 15 — Update API_URL to Azure backend URL

```
Read MISSION13.md in the project root.

I will give you the Azure backend URL now. It will look something like:
  https://bookstore-backend-yourname.azurewebsites.net

Open frontend/src/api/booksApi.ts.

Replace this line:
  export const API_URL = '/api/books'

With (example shape — use my exact host, no trailing slash after books):
  export const API_URL = 'https://[THE-HOST-I-GIVE-YOU].azurewebsites.net/api/books'

Use the exact URL I provide. Do not guess or make up a URL.
The value must end with /api/books so POST goes to .../api/books and PUT to .../api/books/{id}.

After saving, show me the updated line to confirm it is correct.

Then run:
  git add .
  git commit -m "Update API_URL to Azure backend"
  git push

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 16 — Deploy frontend to Azure

```
Read MISSION13.md in the project root.

Run this in the terminal:
  cd frontend && npm run build

Tell me when the build completes and confirm the dist/ folder was created.

I will then:
1. Open the Azure panel in VS Code
2. Click + → Create Static Web App
3. Sign in to GitHub
4. Settings:
   - Name: bookstore-frontend-[my name]
   - Framework: React
   - App location: frontend
   - Build output: dist
5. Watch GitHub Actions to confirm deployment succeeds

Tell me when the build is done and wait for me to complete the Azure
steps. I will give you the frontend URL when it is live.

Stop here and wait for my approval before doing anything else.
```

---

## CHUNK 17 — Final verify and submit

```
Read MISSION13.md in the project root.

I will now test the live deployed site. Help me verify the following:

1. Does the homepage load at the Azure Static Web App URL?
2. Does /adminbooks load correctly (not a 404)?
3. Does Add Book work on the live site?
4. Does Edit work on the live site?
5. Does Delete work on the live site?

If anything is broken, help me diagnose and fix it.

If everything works, run:
  git add .
  git commit -m "Mission 13 complete"
  git push

The final submission for Learning Suite is the deployed Azure
Static Web App URL.
```

# Mission 13 — step checklist

Check each box as you complete it (mirrors **MISSION13.md** and **MISSION13_CHUNKS.md**).

- [x] **1.** Create git branch `phase6` (or `git checkout phase6` if it exists)
- [x] **2.** Add CRUD endpoints to `BooksController.cs` (`POST`, `PUT`, `DELETE`)
- [x] **3.** Replace CORS with `AllowAll` policy in `Program.cs`
- [x] **4.** Confirm SQLite `CopyToOutputDirectory` in `BookstoreApi.csproj` (avoid duplicate ItemGroups)
- [x] **5.** Create `frontend/src/api/booksApi.ts`
- [x] **6.** Create `frontend/src/pages/AdminBooksPage.tsx`
- [x] **7.** Create `frontend/src/components/NewBookForm.tsx`
- [x] **8.** Create `frontend/src/components/EditBookForm.tsx`
- [x] **9.** Add `/adminbooks` route in `App.tsx` + Admin link in `BookListPage.tsx` (offcanvas per chunk prompts)
- [x] **10.** Add `frontend/public/routes.json`
- [x] **11.** Update `vite.config.ts` proxy to `https://localhost:7255` with `secure: false`
- [x] **12.** Local test: API with **`dotnet watch run --launch-profile https`** + `npm run dev` (API CRUD smoke-tested; you should still click through the UI once)
- [x] **13.** Commit and push `phase6` to GitHub
- [ ] **14.** Publish backend + deploy to Azure App Service
- [ ] **15.** Set `API_URL` in `booksApi.ts` to full Azure `.../api/books` URL; commit + push
- [ ] **16.** `npm run build` + deploy frontend (e.g. Azure Static Web App)
- [ ] **17.** Live verify `/`, `/adminbooks`, CRUD; submit Static Web App URL

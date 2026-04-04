using BookstoreApi.Data;
using BookstoreApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreDbContext _db;

    public BooksController(BookstoreDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns all distinct book categories.
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCategories(
        CancellationToken cancellationToken = default)
    {
        var categories = await _db.Books
            .AsNoTracking()
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync(cancellationToken);

        return Ok(categories);
    }

    /// <summary>
    /// Returns books sorted by title with pagination. Default: page 1, 5 per page, ascending title.
    /// Optional category filters narrow the result set before pagination totals are computed.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedBooksResult>> GetBooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortDirection = "asc",
        [FromQuery] List<string>? categories = null,
        CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1)
        {
            pageSize = 5;
        }

        pageSize = Math.Min(pageSize, 100);

        var dir = sortDirection.Trim().ToLowerInvariant();
        IQueryable<Book> query = _db.Books.AsNoTracking();

        if (categories is { Count: > 0 })
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        query = dir == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(new PagedBooksResult
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Adds a new book (client should omit BookID or send 0 for insert).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Book>> AddBook(
        [FromBody] Book newBook,
        CancellationToken cancellationToken = default)
    {
        newBook.BookID = 0;
        _db.Books.Add(newBook);
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(newBook);
    }

    /// <summary>
    /// Updates an existing book by id.
    /// </summary>
    [HttpPut("{bookId}")]
    public async Task<ActionResult<Book>> UpdateBook(
        int bookId,
        [FromBody] Book updatedBook,
        CancellationToken cancellationToken = default)
    {
        var existing = await _db.Books.FindAsync([bookId], cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        existing.Title = updatedBook.Title;
        existing.Author = updatedBook.Author;
        existing.Publisher = updatedBook.Publisher;
        existing.ISBN = updatedBook.ISBN;
        existing.Classification = updatedBook.Classification;
        existing.Category = updatedBook.Category;
        existing.PageCount = updatedBook.PageCount;
        existing.Price = updatedBook.Price;

        _db.Books.Update(existing);
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(existing);
    }

    /// <summary>
    /// Deletes a book by id.
    /// </summary>
    [HttpDelete("{bookId}")]
    public async Task<ActionResult> DeleteBook(
        int bookId,
        CancellationToken cancellationToken = default)
    {
        var book = await _db.Books.FindAsync([bookId], cancellationToken);
        if (book is null)
        {
            return NotFound("Book not found.");
        }

        _db.Books.Remove(book);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

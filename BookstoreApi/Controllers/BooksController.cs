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
    /// Returns books sorted by title with pagination. Default: page 1, 5 per page, ascending title.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedBooksResult>> GetBooks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string sortDirection = "asc",
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
        var query = _db.Books.AsNoTracking();
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
}

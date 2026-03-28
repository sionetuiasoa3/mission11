# Mission 12 — Bootstrap features (beyond class videos)

## Feature 1: Accordion

- **Component:** `CategoryFilter`
- **What it is:** Bootstrap **Accordion** — a collapsible panel (“How filters work”) that expands/collapses with Bootstrap’s accordion behavior.
- **Where:** `frontend/src/components/CategoryFilter.tsx` — look for the comment `MISSION12 Bootstrap feature: Accordion`.

## Feature 2: Offcanvas

- **Component:** `BookListPage`
- **What it is:** Bootstrap **Offcanvas** — a slide-in panel from the side, opened with the “Menu” button, with links to the book list and cart.
- **Where:** `frontend/src/pages/BookListPage.tsx` — look for the comment `MISSION12 Bootstrap feature: Offcanvas`.

---

## Learning Suite — ready-to-paste comment

I added two Bootstrap features that were not covered in the class videos:

1. **Accordion** — In `CategoryFilter.tsx`, I used Bootstrap’s accordion component for a collapsible “How filters work” section under the category checkboxes. It uses `accordion`, `accordion-item`, `accordion-collapse`, and `data-bs-toggle="collapse"` so users can expand or hide the help text.

2. **Offcanvas** — In `BookListPage.tsx`, I used Bootstrap’s offcanvas component for a slide-in “Store menu” from the right. The “Menu” button uses `data-bs-toggle="offcanvas"` and `data-bs-target` to open the panel, which includes navigation links to the book list and shopping cart. Bootstrap’s JavaScript bundle is imported in `main.tsx` so these interactive components work.

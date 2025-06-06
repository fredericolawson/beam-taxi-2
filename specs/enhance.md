# UX Enhancement Recommendations

Based on the current MVP, here are recommendations to improve the User Experience using ShadCN components for clarity and simplicity:

1.  **Persistent Navigation Header:**

    - Implement a consistent header in `src/app/layout.tsx` visible on all pages.
    - Include:
      - Site title/logo linking home (`/`).
      - Conditional buttons/links based on auth state:
        - **Logged In:** "List Your Mooring", Account dropdown (`Avatar` + `DropdownMenu`) with links to `/account` and "Logout".
        - **Logged Out:** "Login", "Sign Up" buttons.
    - _ShadCN Components:_ `Button`, `Avatar`, `DropdownMenu`, `Separator`.

2.  **Mooring Card Loading State:**

    - Show a loading state while fetching moorings on the homepage (`src/app/page.tsx`).
    - Display multiple `Skeleton` components mimicking the `Card` layout within the grid.
    - _ShadCN Components:_ `Skeleton`.

3.  **Enhanced Empty State:**

    - Improve the "No moorings currently available" message on the homepage.
    - Use an `Alert` or a custom component with an icon (`lucide-react`) and potentially a CTA button ("List Your Mooring").
    - _ShadCN Components:_ `Alert`, `Button`.

4.  **Consistent Footer:**

    - Add a simple footer back to `src/app/layout.tsx`.
    - Include minimal info like copyright/site name using subtle styling (`text-sm`, `text-muted-foreground`).

5.  **UI Consistency Across Pages:**
    - Ensure forms and layouts on other pages (Login, Sign Up, New Mooring, Mooring Details, Account) consistently use ShadCN components.
    - Review pages in `src/app/auth/`, `src/app/account/`, `src/app/moorings/` for consistency.
    - _ShadCN Components:_ `Input`, `Label`, `Button`, `Card`, `Textarea`, `Select`, etc.

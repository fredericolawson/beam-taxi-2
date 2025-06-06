# Bermuda Moorings MVP Specification

This document outlines the Minimum Viable Product (MVP) for the Bermuda moorings listing site. The goal is a clean, simple application using Next.js, Shad CN, Supabase, and TypeScript.

## 1. Database Schema (Supabase)

Create a single table named `moorings`.

**`moorings` table:**

| Column                 | Type                       | Constraints                                                     | Notes                                               |
| :--------------------- | :------------------------- | :-------------------------------------------------------------- | :-------------------------------------------------- |
| `id`                   | `uuid`                     | Primary Key, Default: `gen_random_uuid()`                       | Unique identifier for each mooring.                 |
| `created_at`           | `timestamp with time zone` | Default: `now()`                                                | Timestamp of creation.                              |
| `name`                 | `text`                     | Not Null                                                        | Name or identifier of the mooring.                  |
| `location_description` | `text`                     |                                                                 | Textual description of the mooring location.        |
| `latitude`             | `numeric`                  | Optional                                                        | For potential future map features.                  |
| `longitude`            | `numeric`                  | Optional                                                        | For potential future map features.                  |
| `price_per_month`      | `numeric`                  |                                                                 | Monthly rental price.                               |
| `commitment_term`      | `text`                     | Check (`commitment_term IN ('monthly', 'quarterly', 'annual')`) | Required commitment: monthly, quarterly, or annual. |
| `is_available`         | `boolean`                  | Default: `true`                                                 | Availability status.                                |
| `owner_id`             | `uuid`                     | Foreign Key -> `auth.users.id`, Not Null                        | Links mooring to the owner user.                    |
| `description`          | `text`                     | Optional                                                        | Additional details about the mooring.               |

Enable Row Level Security (RLS) on the `moorings` table:

- Allow public read access for all rows (`SELECT`).
- Allow authenticated users to insert new rows (`INSERT`).
- Allow users to update (`UPDATE`) rows where `auth.uid() = owner_id`.
- Allow users to delete (`DELETE`) rows where `auth.uid() = owner_id`.

## 2. API / Data Fetching (Server Actions / Server Components)

Implement the following data access logic primarily using Next.js Server Actions or direct Supabase calls within Server Components:

- **`getAllAvailableMoorings()`**: Fetches all records from `moorings` where `is_available = true`. Used for the main listing page.
- **`getMooringById(id)`**: Fetches a single mooring record by its `id`. Used for the detail page.
- **`getMooringsByOwner(userId)`**: Fetches all mooring records where `owner_id` matches the provided `userId`. Used for the "My Moorings" page.
- **`createMooring(formData)`**: Server Action. Takes form data, validates it, and inserts a new record into the `moorings` table. Associates the mooring with the currently authenticated user (`auth.uid()`). Requires authentication.
- **`updateMooring(formData)`**: Server Action. Takes form data (including mooring `id`), validates it, and updates the corresponding record in `moorings`. Requires authentication and checks if `auth.uid()` matches the `owner_id`.
- **`deleteMooring(id)`**: Server Action. Takes a mooring `id`, deletes the corresponding record. Requires authentication and checks if `auth.uid()` matches the `owner_id`.

## 3. Frontend Pages & Components

Leverage Shad CN components for UI elements.

- **Homepage (`/`)**:
  - Fetches and displays available moorings using `getAllAvailableMoorings()`.
  - Use `Card` components for each mooring preview (show `name`, `location_description`, `price_per_month`).
  - Each card links to `/moorings/[id]`.
  - Conditionally display a "List Your Mooring" `Button` (linking to `/moorings/new`) if the user is logged in. Check authentication status server-side.
- **Mooring Detail Page (`/moorings/[id]`)**:
  - Dynamic route using the mooring `id`.
  - Fetches and displays details using `getMooringById(id)`.
  - Show all relevant fields (`name`, `location_description`, `price_per_month`, `commitment_term`, `description`).
  * _(Stretch Goal)_ Display owner's email (requires fetching user data).
  - Conditionally display "Edit" (`/moorings/[id]/edit`) and "Delete" buttons if the logged-in user is the owner (check `owner_id` against `auth.uid()` server-side). The delete button should trigger the `deleteMooring` server action (potentially with confirmation).
- **Create Mooring Page (`/moorings/new`)**:
  - Protected Route (redirect to `/auth/login` if not authenticated).
  - A form built with Shad CN `Input`, `Label`, `Textarea`, `Checkbox`, `Button`, `Select` (for commitment term).
  - Fields: `name`, `location_description`, `price_per_month`, `commitment_term`, `description`.
  - Submit triggers the `createMooring` Server Action. Redirect to the new mooring's detail page or "My Moorings" on success.
- **Edit Mooring Page (`/moorings/[id]/edit`)**:
  - Protected Route (redirect if not authenticated or not the owner).
  - Fetch existing mooring data using `getMooringById(id)`.
  - Pre-populate the form (similar to the Create page) with the fetched data.
  - Submit triggers the `updateMooring` Server Action. Redirect to the mooring's detail page on success.
- **My Moorings Page (`/account/moorings`)**:
  - Protected Route (redirect to `/auth/login` if not authenticated). Found under the existing `/account` route structure.
  - Fetch and display moorings owned by the current user using `getMooringsByOwner(userId)`.
  - Display as a list or grid of `Card` components.
  - Each card should link to the detail page (`/moorings/[id]`) and potentially have quick links/buttons for "Edit" (`/moorings/[id]/edit`).

## 4. Authentication & Authorization

- Utilize the existing Supabase authentication components and middleware.
- Protect routes (`/moorings/new`, `/moorings/[id]/edit`, `/account/moorings`) using middleware or checks within page/layout components.
- Enforce ownership checks within Server Actions (`updateMooring`, `deleteMooring`) by comparing `owner_id` with the ID of the authenticated user (`auth.uid()`). Rely on Supabase RLS as the primary security mechanism.

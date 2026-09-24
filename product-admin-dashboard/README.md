# Product Admin Dashboard

A Next.js + React + Tailwind CSS + Axios admin dashboard using the free DummyJSON API.

## Features

- Login with `emilys` / `emilyspass`
- Protected product routes and logout
- Shared Axios instance with auth-token interceptor and centralized error handling
- Product list with responsive desktop table and mobile cards
- Pagination with URL state, page sizes 10 / 20 / 50
- Debounced product search
- Category filter and price/rating/title sorting
- Product details with images, description and reviews
- Add, edit and delete product flows
- Client-side validation
- Loading, empty, error and retry states
- Abort/cancellation handling so stale search responses do not overwrite newer results
- Invalid URL values are normalized
- No React Query, SWR, table or pagination libraries

## Run locally

Requirements: Node.js 18.17+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Demo credentials:

```text
Username: emilys
Password: emilyspass
```

## Environment

Copy `.env.example` to `.env.local` if you want to configure the API base URL:

```text
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

## Important API/design decisions

### Search and category

DummyJSON's search endpoint and category endpoint are separate. The dashboard uses `/products/search?q=` when a search term exists and applies the selected category to the returned page on the client. This avoids pretending the API supports a combined search + category query.

Because this client-side category filter operates on the API page, the displayed category result is limited to the currently fetched page. This behavior is intentionally documented in the UI.

### Fast typing / stale requests

Search input is debounced by 500ms. Each product request gets an `AbortController`; starting a new request aborts the previous request. A request ID guard also prevents an older response from updating state if it resolves late. This is useful when testing with an artificial API delay.

### Add/edit/delete persistence

DummyJSON simulates mutations but does not permanently save them to its public dataset. The app sends real POST/PUT/DELETE requests and updates its local UI state where appropriate. Therefore a refresh may show the original server data again. This limitation is documented rather than hidden.

### URL state

`page`, `size`, `search`, `category`, and `sort` are stored in the URL. Invalid page/size values are normalized so URLs such as `?page=abc` or `?page=999` do not crash the page.

## Suggested Git workflow

Make several focused commits instead of one large commit:

```bash
git init
git add .
git commit -m "chore: initialize Next.js dashboard"

git add .
git commit -m "feat: add authentication and axios setup"

git add .
git commit -m "feat: add product listing pagination search and filters"

git add .
git commit -m "feat: add product details and CRUD forms"

git add .
git commit -m "docs: add setup and design notes"
```

Then create a public GitHub repository and push the commits.

## Deployment

The project is suitable for Vercel:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com` if desired.
4. Deploy.

## AI note

AI can be used as a coding assistant, but every part of the generated code should be reviewed and understood before the interview walkthrough. Be prepared to explain Axios interceptors, URL search parameters, debounce behavior, AbortController, responsive rendering, validation, and DummyJSON mutation limitations.

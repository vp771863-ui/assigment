# Interview walkthrough notes

## Architecture

- `app/` contains Next.js routes.
- `components/` contains small UI components.
- `api/` contains API functions; UI components do not call Axios directly.
- `lib/axios.js` is the single Axios setup.
- `lib/auth.js` stores the demo token and user in localStorage.

## Key implementation choices

1. Axios request interceptor reads the login token and attaches `Authorization: Bearer ...`.
2. Axios response interceptor converts API errors into a single Error message and redirects on 401.
3. Search is delayed 500ms.
4. Each product fetch aborts the previous request.
5. A request ID guard protects against late responses.
6. URL parameters are parsed and validated before use.
7. Product mutations are optimistic/local UI changes because DummyJSON does not persist them.
8. Desktop uses a table; mobile uses cards.

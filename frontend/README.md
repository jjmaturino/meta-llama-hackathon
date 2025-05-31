# Meta Llama Hackathon Frontend

This is the frontend application for the Meta Llama Hackathon project. It's built with React, TypeScript, and Vite, featuring a modern UI with various interactive components.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd meta-llama-hackathon/frontend
```

2. Install dependencies:
```bash
npm install
```

## Key Dependencies

The project uses the following major dependencies:

### Core
- React ^19.0.0
- React DOM ^19.0.0
- TypeScript ^5.8.3
- Vite ^6.1.0
- TailwindCSS ^4.0.6

### Routing & Data Management
- @tanstack/react-router ^1.114.3
- @tanstack/react-query ^5.66.5
- @tanstack/react-router-devtools ^1.114.3
- @tanstack/react-query-devtools ^5.66.5

### UI Components & Effects
- canvas-confetti ^1.9.3 - For celebration effects
- TailwindCSS utilities - For styling

### Development Tools
- @vitejs/plugin-react ^4.3.4
- @tanstack/router-cli ^1.16.6
- prettier ^3.5.3
- vitest ^3.0.5
- web-vitals ^4.2.4

### Browser APIs
- Web Speech API (built-in) - For voice input and transcription
- Canvas API (built-in) - For visual effects

## Features

### Notes Page
- Create and manage notes
- Rich text editing capabilities

### Quiz System
1. Multiple Choice Quiz (`/test-create-multiselect`)
   - Interactive question interface
   - Progress tracking
   - Score calculation

2. Short Answer Quiz (`/test-create-shortanswer`)
   - Voice input support (using Web Speech API)
   - Real-time transcription
   - Visual feedback:
     - Confetti for high scores (≥70%)
     - Rain and thunder effects for lower scores
   - Score summary and detailed feedback

### Profile Page
- User information display
- Statistics tracking
- Recent activity feed

## Available Scripts

```bash
# Start development server (port 3000)
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run serve

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format

# Check and fix formatting/linting
npm run check

# Generate routes
npm run generate:routes
```

## Browser Support

The application uses modern web APIs including:
- Web Speech API for voice recognition
- Canvas API for visual effects

Ensure your browser supports these features:
- Chrome (recommended)
- Firefox
- Safari (latest version)
- Edge (Chromium-based)

## Environment Setup

No environment variables are required for basic functionality. However, if you're integrating with the backend API, you might need to set up:

```env
VITE_API_URL=your_backend_url
```

## Project Structure

```
frontend/
├── src/
│   ├── routes/              # Route components
│   ├── components/          # Reusable components
│   ├── styles/              # CSS files
│   ├── integrations/        # External integrations
│   └── types/              # TypeScript declarations
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Your License]

## Acknowledgments

- TanStack Query & Router teams
- Meta Llama team
- All contributors

Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
npm install
npm run start  
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```


## Setting up Netlify

First install the Netlify CLI with:

```bash
npm install -g netlify-cli`
```

```bash
netlify init
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TestCreateShortanswerImport } from './routes/test-create-shortanswer'
import { Route as TestCreateMultiselectImport } from './routes/test-create-multiselect'
import { Route as QuizzesImport } from './routes/quizzes'
import { Route as QuizSelectionImport } from './routes/quiz-selection'
import { Route as ProfileImport } from './routes/profile'
import { Route as GameModeImport } from './routes/game-mode'
import { Route as IndexImport } from './routes/index'
import { Route as QuizzesIndexImport } from './routes/quizzes/index'
import { Route as NotesIndexImport } from './routes/notes/index'
import { Route as NotesSlugImport } from './routes/notes/$slug'
import { Route as DemoTanstackQueryImport } from './routes/demo.tanstack-query'

// Create/Update Routes

const TestCreateShortanswerRoute = TestCreateShortanswerImport.update({
  id: '/test-create-shortanswer',
  path: '/test-create-shortanswer',
  getParentRoute: () => rootRoute,
} as any)

const TestCreateMultiselectRoute = TestCreateMultiselectImport.update({
  id: '/test-create-multiselect',
  path: '/test-create-multiselect',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesRoute = QuizzesImport.update({
  id: '/quizzes',
  path: '/quizzes',
  getParentRoute: () => rootRoute,
} as any)

const QuizSelectionRoute = QuizSelectionImport.update({
  id: '/quiz-selection',
  path: '/quiz-selection',
  getParentRoute: () => rootRoute,
} as any)

const ProfileRoute = ProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any)

const GameModeRoute = GameModeImport.update({
  id: '/game-mode',
  path: '/game-mode',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const QuizzesIndexRoute = QuizzesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => QuizzesRoute,
} as any)

const NotesIndexRoute = NotesIndexImport.update({
  id: '/notes/',
  path: '/notes/',
  getParentRoute: () => rootRoute,
} as any)

const NotesSlugRoute = NotesSlugImport.update({
  id: '/notes/$slug',
  path: '/notes/$slug',
  getParentRoute: () => rootRoute,
} as any)

const DemoTanstackQueryRoute = DemoTanstackQueryImport.update({
  id: '/demo/tanstack-query',
  path: '/demo/tanstack-query',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/game-mode': {
      id: '/game-mode'
      path: '/game-mode'
      fullPath: '/game-mode'
      preLoaderRoute: typeof GameModeImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileImport
      parentRoute: typeof rootRoute
    }
    '/quiz-selection': {
      id: '/quiz-selection'
      path: '/quiz-selection'
      fullPath: '/quiz-selection'
      preLoaderRoute: typeof QuizSelectionImport
      parentRoute: typeof rootRoute
    }
    '/quizzes': {
      id: '/quizzes'
      path: '/quizzes'
      fullPath: '/quizzes'
      preLoaderRoute: typeof QuizzesImport
      parentRoute: typeof rootRoute
    }
    '/test-create-multiselect': {
      id: '/test-create-multiselect'
      path: '/test-create-multiselect'
      fullPath: '/test-create-multiselect'
      preLoaderRoute: typeof TestCreateMultiselectImport
      parentRoute: typeof rootRoute
    }
    '/test-create-shortanswer': {
      id: '/test-create-shortanswer'
      path: '/test-create-shortanswer'
      fullPath: '/test-create-shortanswer'
      preLoaderRoute: typeof TestCreateShortanswerImport
      parentRoute: typeof rootRoute
    }
    '/demo/tanstack-query': {
      id: '/demo/tanstack-query'
      path: '/demo/tanstack-query'
      fullPath: '/demo/tanstack-query'
      preLoaderRoute: typeof DemoTanstackQueryImport
      parentRoute: typeof rootRoute
    }
    '/notes/$slug': {
      id: '/notes/$slug'
      path: '/notes/$slug'
      fullPath: '/notes/$slug'
      preLoaderRoute: typeof NotesSlugImport
      parentRoute: typeof rootRoute
    }
    '/notes/': {
      id: '/notes/'
      path: '/notes'
      fullPath: '/notes'
      preLoaderRoute: typeof NotesIndexImport
      parentRoute: typeof rootRoute
    }
    '/quizzes/': {
      id: '/quizzes/'
      path: '/'
      fullPath: '/quizzes/'
      preLoaderRoute: typeof QuizzesIndexImport
      parentRoute: typeof QuizzesImport
    }
  }
}

// Create and export the route tree

interface QuizzesRouteChildren {
  QuizzesIndexRoute: typeof QuizzesIndexRoute
}

const QuizzesRouteChildren: QuizzesRouteChildren = {
  QuizzesIndexRoute: QuizzesIndexRoute,
}

const QuizzesRouteWithChildren =
  QuizzesRoute._addFileChildren(QuizzesRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/game-mode': typeof GameModeRoute
  '/profile': typeof ProfileRoute
  '/quiz-selection': typeof QuizSelectionRoute
  '/quizzes': typeof QuizzesRouteWithChildren
  '/test-create-multiselect': typeof TestCreateMultiselectRoute
  '/test-create-shortanswer': typeof TestCreateShortanswerRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
  '/notes/$slug': typeof NotesSlugRoute
  '/notes': typeof NotesIndexRoute
  '/quizzes/': typeof QuizzesIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/game-mode': typeof GameModeRoute
  '/profile': typeof ProfileRoute
  '/quiz-selection': typeof QuizSelectionRoute
  '/test-create-multiselect': typeof TestCreateMultiselectRoute
  '/test-create-shortanswer': typeof TestCreateShortanswerRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
  '/notes/$slug': typeof NotesSlugRoute
  '/notes': typeof NotesIndexRoute
  '/quizzes': typeof QuizzesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/game-mode': typeof GameModeRoute
  '/profile': typeof ProfileRoute
  '/quiz-selection': typeof QuizSelectionRoute
  '/quizzes': typeof QuizzesRouteWithChildren
  '/test-create-multiselect': typeof TestCreateMultiselectRoute
  '/test-create-shortanswer': typeof TestCreateShortanswerRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
  '/notes/$slug': typeof NotesSlugRoute
  '/notes/': typeof NotesIndexRoute
  '/quizzes/': typeof QuizzesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/game-mode'
    | '/profile'
    | '/quiz-selection'
    | '/quizzes'
    | '/test-create-multiselect'
    | '/test-create-shortanswer'
    | '/demo/tanstack-query'
    | '/notes/$slug'
    | '/notes'
    | '/quizzes/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/game-mode'
    | '/profile'
    | '/quiz-selection'
    | '/test-create-multiselect'
    | '/test-create-shortanswer'
    | '/demo/tanstack-query'
    | '/notes/$slug'
    | '/notes'
    | '/quizzes'
  id:
    | '__root__'
    | '/'
    | '/game-mode'
    | '/profile'
    | '/quiz-selection'
    | '/quizzes'
    | '/test-create-multiselect'
    | '/test-create-shortanswer'
    | '/demo/tanstack-query'
    | '/notes/$slug'
    | '/notes/'
    | '/quizzes/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  GameModeRoute: typeof GameModeRoute
  ProfileRoute: typeof ProfileRoute
  QuizSelectionRoute: typeof QuizSelectionRoute
  QuizzesRoute: typeof QuizzesRouteWithChildren
  TestCreateMultiselectRoute: typeof TestCreateMultiselectRoute
  TestCreateShortanswerRoute: typeof TestCreateShortanswerRoute
  DemoTanstackQueryRoute: typeof DemoTanstackQueryRoute
  NotesSlugRoute: typeof NotesSlugRoute
  NotesIndexRoute: typeof NotesIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  GameModeRoute: GameModeRoute,
  ProfileRoute: ProfileRoute,
  QuizSelectionRoute: QuizSelectionRoute,
  QuizzesRoute: QuizzesRouteWithChildren,
  TestCreateMultiselectRoute: TestCreateMultiselectRoute,
  TestCreateShortanswerRoute: TestCreateShortanswerRoute,
  DemoTanstackQueryRoute: DemoTanstackQueryRoute,
  NotesSlugRoute: NotesSlugRoute,
  NotesIndexRoute: NotesIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/game-mode",
        "/profile",
        "/quiz-selection",
        "/quizzes",
        "/test-create-multiselect",
        "/test-create-shortanswer",
        "/demo/tanstack-query",
        "/notes/$slug",
        "/notes/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/game-mode": {
      "filePath": "game-mode.tsx"
    },
    "/profile": {
      "filePath": "profile.tsx"
    },
    "/quiz-selection": {
      "filePath": "quiz-selection.tsx"
    },
    "/quizzes": {
      "filePath": "quizzes.tsx",
      "children": [
        "/quizzes/"
      ]
    },
    "/test-create-multiselect": {
      "filePath": "test-create-multiselect.tsx"
    },
    "/test-create-shortanswer": {
      "filePath": "test-create-shortanswer.tsx"
    },
    "/demo/tanstack-query": {
      "filePath": "demo.tanstack-query.tsx"
    },
    "/notes/$slug": {
      "filePath": "notes/$slug.tsx"
    },
    "/notes/": {
      "filePath": "notes/index.tsx"
    },
    "/quizzes/": {
      "filePath": "quizzes/index.tsx",
      "parent": "/quizzes"
    }
  }
}
ROUTE_MANIFEST_END */

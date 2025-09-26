import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initAuth } from '@repo/auth'
import { trpcServer } from '@hono/trpc-server'
import { appRouter, createTRPCContext } from '@repo/api'
import { generateRootHtml } from './utils.js';
import { serve } from '@hono/node-server'

const {
  PUBLIC_SERVER_URL = 'http://localhost:3000',
  PUBLIC_WEB_URL = 'http://localhost:3001',
  AUTH_SECRET = 'secret',
  GOOGLE_CLIENT_ID = '',
  GOOGLE_CLIENT_SECRET = '',
  APPLE_CLIENT_ID = '',
  APPLE_CLIENT_SECRET = '',
  FACEBOOK_CLIENT_ID = '',
  FACEBOOK_CLIENT_SECRET = ''
} = process.env;

const trustedOrigins = [PUBLIC_WEB_URL].map((url) => new URL(url).origin);

const app = new Hono()

const auth = initAuth({
  serverUrl: PUBLIC_SERVER_URL,
  authSecret: AUTH_SECRET,
  webUrl: PUBLIC_WEB_URL,
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
  appleClientId: APPLE_CLIENT_ID,
  appleClientSecret: APPLE_CLIENT_SECRET,
  facebookClientId: FACEBOOK_CLIENT_ID,
  facebookClientSecret: FACEBOOK_CLIENT_SECRET,
})

// Middlewares
app.use(logger())
app.use(
  '/*',
  cors({
    origin: trustedOrigins,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

// Health
app.get('/healthcheck', (c) => {
  return c.text('OK');
});

app.get('/', (c) => {
  return c.html(generateRootHtml(PUBLIC_WEB_URL));
});

// Auth (better-auth)
app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

// tRPC
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => createTRPCContext({ context, auth })
  })
)

// Start
const port = parseInt(process.env.PORT || '3000')

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
})
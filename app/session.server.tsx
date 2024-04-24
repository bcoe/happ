import { redirect } from "@remix-run/node";
import 'dotenv/config';

// Session stuff:
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import session from 'express-session';

const isTestEnvironment = process.env.NODE_ENV === 'test';

type SessionObject = {
  userId?: string;
}

type SessionStoreCallback = (sess: SessionObject) => void;

type ConnectDecoratedReq = {
  sessionStore?: {
    get: (id: string, SessionStoreCallback) => void;
  };
  sessionID?: string;
  headers: { [name: string]: string | null },
  url: string
}

type SessionOpts = {
  resave: boolean;
  saveUninitialized: boolean;
  secret?: string;
  store?: any;
}

const sessionOpts: SessionOpts = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
};
const sessionPrefix = `happ:${process.env.NODE_ENV}`
if (!isTestEnvironment) {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: sessionPrefix,
  });
  redisClient.connect();
  redisClient.unref();
  sessionOpts.store = redisStore;
}
const s = session(sessionOpts);

export async function isLoggedIn(req: Request): Promise<string | undefined> {
  const connectReq: ConnectDecoratedReq = {
    headers: {
      cookie: req.headers.get('cookie')
    },
    url: '/'
  }
  s(connectReq, {}, () => {});
  const sess: SessionObject = await new Promise((resolve) => {
    if (!connectReq.sessionID) return resolve({});
    if (!connectReq.sessionStore) return resolve({});
    connectReq.sessionStore.get(connectReq.sessionID, (err, sess: SessionObject) => {
      if (err || !sess) return resolve({});
      return resolve(sess);
    })
  });
  return sess.userId;
}

export async function requireUserId(
  req: Request,
) {
  if (!await isLoggedIn(req)) {
    throw redirect('/login');
  }
}

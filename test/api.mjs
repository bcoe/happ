import {
  beforeEach, describe, it, before, after,
} from 'mocha';
import { mock } from 'node:test';
import util from 'node:util';
import { exec } from 'node:child_process';
import assert from 'assert';
import * as api from '../lib/api.mjs';

const execP = util.promisify(exec);

// This isn't necessary because cross-env sets NODE_ENV to
// "test", but we should be extra careful to not run db:rollback
// in a non-test environment.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://127.0.0.1:5432/happ_test';
// This is a fake session secret.
process.env.SESSION_SECRET = process.env.SESSION_SECRET ?? '31ba3298-5b08-4ef6-8c25-a536b7b46c64';
process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

const UUID_REGEX = /[0-9a-f]{8}-.*/;

describe('api', () => {
  let server;
  const PORT = 9999;
  const SERVER = `http://localhost:${PORT}`;
  before(async () => {
    server = await api.listen(PORT);
  });
  after(async () => {
    await server.close();
  });
  beforeEach(async () => {
    mock.reset(); // Reset all mocks.
    {
      const { stderr } = await execP('npm run db:rollback -- --all');
      if (stderr) {
        throw Error(stderr);
      }
    }
    {
      const { stderr } = await execP('npm run db:up');
      if (stderr) {
        throw Error(stderr);
      }
    }
  });
  describe('POST /v1/habits', () => {
    it('returns 422 status if email not set', async () => {
      /// Mock the session middleware as though there's a logged in user.
      const { id } = (await api.getDatabase()('users').insert({ email: 'fake@example.com', account_type: 'google' }, ['id']))[0];
      api.helpers.authenticated = (req, res, next) => {
        req.userId = id;
        return next();
      };
      const resp = await fetch(`${SERVER}/v1/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(resp.status, 422);
    });

    it('creates and returns a new habit if name is set', async () => {
      /// Mock the session middleware as though there's a logged in user.
      const { id } = (await api.getDatabase()('users').insert({ email: 'fake@example.com', account_type: 'google' }, ['id']))[0];
      api.helpers.authenticated = (req, _res, next) => {
        req.userId = id;
        return next();
      };
      const resp = await fetch(`${SERVER}/v1/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'brush teeth' }),
      });
      assert.strictEqual(resp.status, 201);
      const json = await resp.json();
      assert(UUID_REGEX.test(json.id));
      // It should have also create a positon for the habit in the list:
      const positions = await api.getDatabase()('habits_active_position')
        .first(['sorted_habit_ids'])
        .where('user_id', id);
      assert.strictEqual(positions.sorted_habit_ids.length, 1);
      assert.strictEqual(positions.sorted_habit_ids[0], json.id);
    });
  });

  describe('GET /v1/habits-daily', () => {
    it('creates a new list of daily habits if one does not exist for day', async () => {
      /// Mock the session middleware as though there's a logged in user.
      const { id } = (await api.getDatabase()('users').insert({ email: 'fake@example.com', account_type: 'google' }, ['id']))[0];
      api.helpers.authenticated = (req, _res, next) => {
        req.userId = id;
        return next();
      };
      // Create some fake habits:
      await fetch(`${SERVER}/v1/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'brush teeth' }),
      });
      await fetch(`${SERVER}/v1/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'make coffee' }),
      });
      const resp = await fetch(`${SERVER}/v1/habits-daily`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      assert.strictEqual(resp.status, 200);
      const habits = await resp.json();
      assert.strictEqual(habits.habits.length, 2);
    });
  });

  describe('POST /v1/habits/array-move', () => {
    it('swaps positions of two items', async () => {
      /// Mock the session middleware as though there's a logged in user.
      const { id } = (await api.getDatabase()('users').insert({ email: 'fake@example.com', account_type: 'google' }, ['id']))[0];
      api.helpers.authenticated = (req, _res, next) => {
        req.userId = id;
        return next();
      };
      // Create some fake habits:
      const { id: aId } = await (await fetch(`${SERVER}/v1/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'a' }),
      })).json();
      const { id: bId } = await (await fetch(`${SERVER}/v1/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'd' }),
      })).json();
      const resp = await fetch(`${SERVER}/v1/habits/array-move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldIndex: 1,
          newIndex: 0,
        }),
      });
      const orderedIds = await resp.json();
      assert.deepStrictEqual(orderedIds, [bId, aId]);
    });
  });

  describe('GET /v1/callback', () => {
    it('creates user if none exists', async () => {
      // Mock the getToken() call to exchange code for access token:
      mock.method(api.getGoogleOAuthClient(), 'getToken', () => ({
        tokens: {
          access_token: 'foo',
        },
      }));
      // Mock the call to fetch profile information with access token:
      const originalFetch = global.fetch;
      mock.method(global, 'fetch', (url, opts) => {
        if (url.includes('www.googleapis.com')) {
          return {
            json: () => ({ email: 'bob@example.com' }),
          };
        }
        return originalFetch(url, opts);
      });
      await fetch(`${SERVER}/v1/callback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // TODO: check that the user was created in the DB.
    });

    it('uses an existing user if available', async () => {
      /// Mock the session middleware as though there's a logged in user.
      // const { id } = (await api.getDatabase()('users')
      // .insert({ email: 'fake@example.com', account_type: 'google' }, ['id']))[0];
      // Mock the getToken() call to exchange code for access token:
      mock.method(api.getGoogleOAuthClient(), 'getToken', () => ({
        tokens: {
          access_token: 'foo',
        },
      }));
      // Mock the call to fetch profile information with access token:
      const originalFetch = global.fetch;
      mock.method(global, 'fetch', (url, opts) => {
        if (url.includes('www.googleapis.com')) {
          return {
            json: () => ({ email: 'fake@example.com' }),
          };
        }
        return originalFetch(url, opts);
      });
      await fetch(`${SERVER}/v1/callback`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // TODO: check that the existing user was used.
    });
  });
});

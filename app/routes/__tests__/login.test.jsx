import assert from 'node:assert/strict';
import { createRemixStub } from "@remix-run/testing";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { test } from 'vitest'

test("renders google login button", async () => {
  const { default: Login } = await import('../login');

  const LoginStub = createRemixStub([
    {
      path: "/",
      Component: Login,
      loader() {
        return {
          data: {
            redirect: 'https://conventionalcommits.org/'
          }
        }
      },
    },
  ]);
  render(<LoginStub />);
  await waitFor(() => screen.findByText("Login with Google"));
  const a = document.querySelector('#login-with-google');
  assert.match(a.href, /conventionalcommits/);
});

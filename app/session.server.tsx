import { redirect } from "@remix-run/node";

export async function requireUserId(
  request: Request,
) {
  const userId = 'bcoe';
  if (!userId) {
    throw redirect('/login');
  }
  return userId;
}

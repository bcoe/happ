import React from 'react'
import { json } from "@remix-run/node";
import { OAuth2Client } from 'google-auth-library';
import { FaGoogle } from "react-icons/fa";
import { Link, useLoaderData } from "@remix-run/react";

const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT,
);

type RedirectData = {
  data: {
    redirect: string;
  }
}

export const loader = async () => {
  const redirect = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
  return json({
    data: {
      redirect
    }
  });
};

export default function Login () {
  const {data} = useLoaderData<RedirectData>();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-zinc-100 text-center mb-1">Sign in to happ</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">Track your daily habits</p>
        <Link
          id="login-with-google"
          to={data.redirect}
          data-testid="google-login"
          className="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-medium transition-colors"
        >
          <FaGoogle className="text-zinc-400 size-4" />
          Continue with Google
        </Link>
      </div>
    </div>
  )
}

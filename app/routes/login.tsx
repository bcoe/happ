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
    <div className={'bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'}>
      <Link id="login-with-google" className={'grid grid-cols-3'} to={data.redirect} data-testid="google-login">
        <div className={'pt-1'}>
          <FaGoogle />
        </div>
        <div className={'text-center'}>
          Login with Google
        </div>
      </Link>
    </div>
  )
}

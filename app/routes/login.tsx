import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginComponent () {
  const navigate = useNavigate()

  useEffect(() => {
    async function getRedirect() {
      const resp = await fetch("/v1/login");
      const { redirect } = await resp.json();
      window.location.href = redirect;
    }
    getRedirect();
  })

  return (
    <div>Redirecting to Google login...</div>
  )
}

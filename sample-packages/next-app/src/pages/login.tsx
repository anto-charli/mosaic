import React from 'react'
import { Login } from 'Component/Login/Login.tsx'
import { Header } from '@Component/Header'
function LoginPage() {
    return (
        <>
            <Header />
            <Login />
        </>
    )
}

export default LoginPage
export { LoginPage }
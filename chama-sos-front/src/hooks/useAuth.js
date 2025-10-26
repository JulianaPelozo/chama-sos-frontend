import { useState } from 'react'


export function useAuth() {
    const [token, setToken] = useState(() => localStorage.getItem('token'))


    const login = (tokenValue) => {
        localStorage.setItem('token', tokenValue)
        setToken(tokenValue)
}


    const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
}


    return { token, login, logout }
}
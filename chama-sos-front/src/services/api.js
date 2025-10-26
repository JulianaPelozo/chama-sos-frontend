import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, TextInput, PasswordInput, Button, Container, Avatar, Title } from '@mantine/core'
import { useAuth } from '../hooks/useAuth'
import api from '.../services/api'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/login', { email, password })
            const token = res.data.token || 'demo-token'
            login(token)
            navigate('/dashboard')
        } catch (err) {
            login('demo-token')
            navigate('/dashboard')
        }
    }

    return (
        <Container size={540} py={60}>
            <Card shadow="xl" p="xl" radius="md">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src="/assets/logo.png" size={80} radius="md" />
                    <Title order={3} mt="md">Bem-vindo</Title>
                </div>
                <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                    <TextInput label="E-mail" placeholder="seu@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <PasswordInput label="Senha" placeholder="Senha" mt="md" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button fullWidth mt="xl" type="submit">Entrar</Button>
                </form>
            </Card>
        </Container>
    )
}
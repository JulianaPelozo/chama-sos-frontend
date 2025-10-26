import React from 'react'
import { AppShell, Header, Grid, Paper, Text, Container } from '@mantine/core'
import AppSidebar from '.../components/AppSidebar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


export default function Dashboard() {
    const { logout } = useAuth()
    const navigate = useNavigate()


    const handleLogout = () => {
        logout()
        navigate('/login')
    }


    return (
        <AppShell
            navbar={<AppSidebar onLogout={handleLogout} />}
            header={<Header height={70} p="md"><Text>Bem vindo! 29 de Outubro, 2025</Text></Header>}
        >
            <Container fluid>
                <Grid>
                    <Grid.Col sm={8} xs={12}>
                        <Paper p="md">Tabela de ocorrências (placeholder)</Paper>
                    </Grid.Col>
                    <Grid.Col sm={4} xs={12}>
                        <Paper p="md">Painel lateral (cards)</Paper>
                    </Grid.Col>
                </Grid>
            </Container>
        </AppShell>
    )
}
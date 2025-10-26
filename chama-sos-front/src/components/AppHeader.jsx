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
      header={
        <Header height={70} p="md" style={{ backgroundColor: '#E94B3C', color: 'white' }}>
          <Text fw={500}>Bem-vindo! 26 de Outubro, 2025</Text>
        </Header>
      }
      padding="md"
      styles={{
        main: {
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }
      }}
    >
      <Container fluid>
        <Grid gutter="md">
          {/* Coluna principal */}
          <Grid.Col sm={8} xs={12}>
            <Paper shadow="sm" radius="md" p="md">
              <Text fw={600} mb="sm">Ocorrências Recentes</Text>
              <Paper
                p="lg"
                radius="md"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  minHeight: '200px'
                }}
              >
                <Text size="sm" color="dimmed">
                  Aqui ficará a tabela de ocorrências (dados carregados da API)
                </Text>
              </Paper>
            </Paper>
          </Grid.Col>

          {/* Coluna lateral */}
          <Grid.Col sm={4} xs={12}>
            <Paper shadow="sm" radius="md" p="md">
              <Text fw={600} mb="sm">Resumo</Text>
              <Paper
                p="lg"
                radius="md"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  minHeight: '200px'
                }}
              >
                <Text size="sm" color="dimmed">
                  Aqui você pode colocar cards de estatísticas, alertas ou métricas.
                </Text>
              </Paper>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  )
}

import { Navbar, Avatar, Text, Stack, UnstyledButton } from '@mantine/core'
import { IconGauge, IconUsers, IconLogout } from '@mantine/icons'
import { useNavigate } from 'react-router-dom'


export default function AppSidebar({ onLogout }) {
    const navigate = useNavigate()
    return (
        <Navbar width={{ base: 80, sm: 200 }} height="100%" p="md">
            <Navbar.Section>
                <Avatar src="/assets/logo.png" radius="md" />
            </Navbar.Section>
            <Navbar.Section grow mt="xl">
                <Stack spacing="sm">
                    <UnstyledButton onClick={() => navigate('/dashboard')}>
                        <IconGauge size={20} />
                        <Text>Dashboard</Text>
                    </UnstyledButton>
                    <UnstyledButton>
                        <IconUsers size={20} />
                        <Text>Usuários</Text>
                    </UnstyledButton>
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <UnstyledButton onClick={onLogout}>
                    <IconLogout />
                    <Text>Logout</Text>
                </UnstyledButton>
            </Navbar.Section>
        </Navbar>
    )
}
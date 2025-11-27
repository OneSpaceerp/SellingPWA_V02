import { Card, Text, Title, Group, Stack, Badge, Divider, SimpleGrid } from '@mantine/core';
import { IconUser, IconBriefcase, IconMail, IconCalendar } from '@tabler/icons-react';
import { authService } from '../services/authService';

export function MyProfilePage() {
    const user = authService.getLoggedInUser();

    return (
        <div className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
            {/* Header */}
            <div
                className="glass animate-fade-in"
                style={{
                    background: 'var(--primary-gradient)',
                    padding: 'var(--space-xl)',
                    borderRadius: 'var(--radius-2xl)',
                    marginBottom: 'var(--space-xl)',
                    color: 'white',
                    boxShadow: 'var(--shadow-xl)',
                    textAlign: 'center',
                }}
            >
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '4px solid rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-lg)',
                    color: 'white',
                }}>
                    <IconUser size={48} />
                </div>

                <Title order={2} c="white" mb="xs">
                    {user || 'User'}
                </Title>
                <Text size="sm" style={{ opacity: 0.9 }}>
                    Sales Representative
                </Text>
            </div>

            {/* Profile Info */}
            <Card className="animate-slide-in" shadow="sm" padding="xl" radius="xl" mb="lg">
                <Title order={3} mb="lg">Profile Information</Title>

                <Stack gap="lg">
                    <div>
                        <Group gap="sm" mb="xs">
                            <IconUser size={20} style={{ color: 'var(--violet-500)' }} />
                            <Text fw={600} size="sm" c="dimmed">Username</Text>
                        </Group>
                        <Text size="lg" fw={600}>{user || 'Not logged in'}</Text>
                    </div>

                    <Divider />

                    <div>
                        <Group gap="sm" mb="xs">
                            <IconBriefcase size={20} style={{ color: 'var(--violet-500)' }} />
                            <Text fw={600} size="sm" c="dimmed">Role</Text>
                        </Group>
                        <Badge size="lg" variant="light" color="violet">
                            Sales Representative
                        </Badge>
                    </div>

                    <Divider />

                    <div>
                        <Group gap="sm" mb="xs">
                            <IconMail size={20} style={{ color: 'var(--violet-500)' }} />
                            <Text fw={600} size="sm" c="dimmed">Email</Text>
                        </Group>
                        <Text size="md">{user}@company.com</Text>
                    </div>

                    <Divider />

                    <div>
                        <Group gap="sm" mb="xs">
                            <IconCalendar size={20} style={{ color: 'var(--violet-500)' }} />
                            <Text fw={600} size="sm" c="dimmed">Member Since</Text>
                        </Group>
                        <Text size="md">January 2024</Text>
                    </div>
                </Stack>
            </Card>

            {/* Stats Card */}
            <Card className="animate-slide-in" shadow="sm" padding="xl" radius="xl">
                <Title order={3} mb="lg">Quick Stats</Title>

                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg">
                    <div style={{ textAlign: 'center' }}>
                        <Text size="2xl" fw={700} className="text-gradient" mb="xs">
                            0
                        </Text>
                        <Text size="sm" c="dimmed">Orders Today</Text>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Text size="2xl" fw={700} className="text-gradient" mb="xs">
                            0
                        </Text>
                        <Text size="sm" c="dimmed">This Week</Text>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Text size="2xl" fw={700} className="text-gradient" mb="xs">
                            0
                        </Text>
                        <Text size="sm" c="dimmed">This Month</Text>
                    </div>
                </SimpleGrid>
            </Card>
        </div>
    );
}

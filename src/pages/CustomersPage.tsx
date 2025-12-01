import { useState } from 'react';
import { Card, Text, Title, Group, Stack, Badge, Button, TextInput, SimpleGrid } from '@mantine/core';
import { IconSearch, IconUser, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';

export function CustomersPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const customers = useDataStore((state) => state.customers);

    const filteredCustomers = customers.filter(customer =>
        customer.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.customer_group?.toLowerCase().includes(search.toLowerCase())
    );

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
                }}
            >
                <Group justify="space-between" mb="lg" wrap="nowrap">
                    <div>
                        <Title order={2} c="white" mb="xs">
                            Customers
                        </Title>
                        <Text size="sm" style={{ opacity: 0.9 }}>
                            View and manage your customers
                        </Text>
                    </div>

                    <div
                        className="glass"
                        style={{
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                            minWidth: '100px',
                        }}
                    >
                        <Text size="xs" c="white" fw={500} mb={4}>Total</Text>
                        <Text size="xl" c="white" fw={700}>{customers.length}</Text>
                    </div>
                </Group>

                {/* Search */}
                <TextInput
                    placeholder="Search customers by name or group..."
                    leftSection={<IconSearch size={18} stroke={2} />}
                    size="md"
                    radius="md"
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    styles={{
                        input: {
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            fontWeight: 500,
                            '&:focus': {
                                background: 'white',
                                boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.3)',
                            },
                        },
                    }}
                />
            </div>

            {/* Customers Grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" className="animate-slide-in">
                {filteredCustomers.map((customer) => (
                    <Card
                        key={customer.name}
                        className="hover-lift"
                        shadow="sm"
                        padding="lg"
                        radius="xl"
                        style={{
                            border: '1px solid var(--gray-200)',
                            background: 'var(--surface-card)',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/edit-customer/${encodeURIComponent(customer.name)}`)}
                    >
                        {/* Customer Icon */}
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 'var(--space-md)',
                            color: 'white',
                            fontSize: '1.5rem',
                        }}>
                            <IconUser size={28} />
                        </div>

                        {/* Customer Info */}
                        <Title order={4} mb="xs">{customer.customer_name}</Title>
                        <Text size="xs" c="dimmed" mb="sm">{customer.name}</Text>

                        {customer.customer_group && (
                            <Badge
                                variant="light"
                                color="violet"
                                mb="md"
                                radius="md"
                            >
                                {customer.customer_group}
                            </Badge>
                        )}

                        {/* Details */}
                        <Stack gap="xs">
                            {customer.mobile_no && (
                                <Group gap="xs">
                                    <IconPhone size={14} style={{ color: 'var(--gray-500)' }} />
                                    <Text size="xs" c="dimmed">{customer.mobile_no}</Text>
                                </Group>
                            )}
                            {customer.email_id && (
                                <Group gap="xs">
                                    <IconMail size={14} style={{ color: 'var(--gray-500)' }} />
                                    <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                                        {customer.email_id}
                                    </Text>
                                </Group>
                            )}
                            {customer.territory && (
                                <Group gap="xs">
                                    <IconMapPin size={14} style={{ color: 'var(--gray-500)' }} />
                                    <Text size="xs" c="dimmed">{customer.territory}</Text>
                                </Group>
                            )}
                        </Stack>

                        <Button
                            fullWidth
                            variant="light"
                            mt="md"
                            radius="md"
                        >
                            View Details
                        </Button>
                    </Card>
                ))}
            </SimpleGrid>

            {filteredCustomers.length === 0 && (
                <Card className="animate-fade-in" shadow="sm" padding="xl" radius="xl" style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
                    <div style={{ fontSize: '4rem', opacity: 0.3, marginBottom: 'var(--space-md)' }}>
                        🔍
                    </div>
                    <Title order={3} c="dimmed" mb="xs">No customers found</Title>
                    <Text c="dimmed">Try adjusting your search terms</Text>
                </Card>
            )}
        </div>
    );
}

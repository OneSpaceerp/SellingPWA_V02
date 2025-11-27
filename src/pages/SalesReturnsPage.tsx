import { Card, Text, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function SalesReturnsPage() {
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
                <Title order={2} c="white" mb="xs">
                    Sales Returns
                </Title>
                <Text size="sm" style={{ opacity: 0.9 }}>
                    Process return orders and manage refunds
                </Text>
            </div>

            {/* Coming Soon Card */}
            <Card className="animate-fade-in" shadow="sm" padding="xl" radius="xl" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: 'var(--space-lg)' }}>
                    🔄
                </div>
                <Title order={3} mb="md">Sales Returns Module</Title>
                <Text c="dimmed" size="lg" mb="xl">
                    This feature is coming soon!
                </Text>

                <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                    The sales returns module will allow you to process return orders, track returned items, and manage refunds efficiently.
                </Alert>
            </Card>
        </div>
    );
}

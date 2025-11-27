import { Card, Text, Group, Stack, ThemeIcon, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { 
  IconUsers, 
  IconUser, 
  IconCalendar, 
  IconSettings, 
  IconLogout, 
  IconChevronRight,
  IconReceipt2
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function MorePage() {
  const navigate = useNavigate();
  const user = authService.getLoggedInUser();

  const handleLogout = () => {
    authService.logout();
    notifications.show({
      title: 'Logged Out',
      message: 'You have been successfully logged out',
      color: 'blue',
    });
    window.location.href = '/';
  };

  const menuItems = [
    {
      icon: IconUsers,
      label: 'Customers',
      description: 'Manage your customers',
      path: '/customers',
      color: '#8b5cf6',
    },
    {
      icon: IconUser,
      label: 'My Profile',
      description: 'View your profile and stats',
      path: '/my-profile',
      color: '#6366f1',
    },
    {
      icon: IconCalendar,
      label: 'Customer Visits',
      description: 'Plan and track visits',
      path: '/service-plan',
      color: '#10b981',
    },
    {
      icon: IconReceipt2,
      label: 'Sales Returns',
      description: 'Process return orders',
      path: '/sales-returns',
      color: '#f59e0b',
    },
    {
      icon: IconSettings,
      label: 'Settings',
      description: 'App preferences',
      path: '/settings',
      color: '#6b7280',
    },
  ];

  return (
    <div style={{ 
      padding: '1rem', 
      minHeight: 'calc(100vh - 150px)',
      background: 'var(--gray-50)'
    }}>
      {/* User Info Card */}
      <Card
        className="animate-fade-in glass"
        style={{
          marginBottom: '1.5rem',
          background: 'var(--primary-gradient)',
          color: 'white',
          border: 'none'
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Text size="sm" style={{ opacity: 0.9 }}>Logged in as</Text>
            <Text size="xl" fw={700}>{user || 'User'}</Text>
          </Stack>
          <ThemeIcon 
            size={60} 
            radius="xl" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <IconUser size={32} />
          </ThemeIcon>
        </Group>
      </Card>

      {/* Menu Items */}
      <Stack gap="md">
        {menuItems.map((item, index) => (
          <Card
            key={item.path}
            className="animate-fade-in hover-lift"
            style={{
              cursor: 'pointer',
              animationDelay: `${index * 50}ms`
            }}
            onClick={() => navigate(item.path)}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="md" wrap="nowrap">
                <ThemeIcon 
                  size={48} 
                  radius="md" 
                  style={{ 
                    background: `${item.color}15`,
                    color: item.color
                  }}
                >
                  <item.icon size={24} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text fw={600} size="md">{item.label}</Text>
                  <Text size="sm" c="dimmed">{item.description}</Text>
                </Stack>
              </Group>
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                size="lg"
                aria-label={`Navigate to ${item.label}`}
              >
                <IconChevronRight size={20} />
              </ActionIcon>
            </Group>
          </Card>
        ))}

        {/* Logout Button */}
        <Card
          className="animate-fade-in"
          style={{
            cursor: 'pointer',
            animationDelay: `${menuItems.length * 50}ms`,
            borderColor: 'var(--danger-500)',
            marginTop: '1rem'
          }}
          onClick={handleLogout}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="md" wrap="nowrap">
              <ThemeIcon 
                size={48} 
                radius="md" 
                color="red"
                variant="light"
              >
                <IconLogout size={24} />
              </ThemeIcon>
              <Stack gap={4}>
                <Text fw={600} size="md" c="red">Logout</Text>
                <Text size="sm" c="dimmed">Sign out of your account</Text>
              </Stack>
            </Group>
            <ActionIcon 
              variant="subtle" 
              color="red" 
              size="lg"
              aria-label="Logout"
            >
              <IconChevronRight size={20} />
            </ActionIcon>
          </Group>
        </Card>
      </Stack>
    </div>
  );
}

import { AppShell, Group, Tabs, Title, Badge } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconShoppingCart, IconListDetails, IconReceipt, IconDots } from '@tabler/icons-react';
import { useCartStore } from '../store/cartStore';

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());

  // Map pathname to active tab, handling sub-routes
  const getActiveTab = () => {
    const path = location.pathname;

    // Direct matches
    if (path === '/') return '/';
    if (path === '/catalog') return '/catalog';
    if (path === '/cart') return '/cart';
    if (path === '/orders') return '/orders';
    if (path === '/more') return '/more';

    // Sub-routes that should activate More tab
    const morePaths = [
      '/customers',
      '/my-profile',
      '/service-plan',
      '/sales-returns',
      '/settings',
      '/new-visit'
    ];
    if (morePaths.some(p => path.startsWith(p))) {
      return '/more';
    }

    // Sub-routes related to main tabs
    if (path.startsWith('/select-customer') || path.startsWith('/new-customer') || path.startsWith('/edit-customer')) {
      return '/cart';
    }
    if (path.startsWith('/checkout') || path.startsWith('/payment')) {
      return '/orders';
    }

    return '/';
  };

  const activeTab = getActiveTab();

  return (
    <AppShell
      header={{ height: 70 }}
      footer={{ height: 80 }}
      padding={0}
      style={{ margin: 0, padding: 0, position: 'relative' }}
    >
      {/* Modern Header */}
      <AppShell.Header
        className="glass-strong"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-fixed)',
          background: 'var(--primary-gradient)',
          borderBottom: 'none',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Group h="100%" justify="space-between" style={{ padding: '0 1rem' }}>
          <Group gap="sm" align="center">
            <div
              className="hover-scale"
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              NS
            </div>
            <Title
              order={3}
              c="white"
              style={{
                fontWeight: '700',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              Nest Selling
            </Title>
          </Group>

          {/* Cart Badge in Header */}
          {totalItems > 0 && (
            <Badge
              size="lg"
              variant="filled"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: 700
              }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </Group>
      </AppShell.Header>

      {/* Main Content */}
      <AppShell.Main style={{
        paddingTop: '70px',
        paddingBottom: '80px',
        minHeight: '100vh',
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0,
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        background: 'var(--gray-50)'
      }}>
        <Outlet />
      </AppShell.Main>

      {/* Modern Bottom Navigation */}
      <AppShell.Footer
        className="glass-strong"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-fixed)',
          background: 'var(--surface-elevated)',
          borderTop: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-2xl)',
          padding: '0.5rem 0.75rem'
        }}
      >
        <Tabs value={activeTab} onChange={(value) => navigate(value || '/')}>
          <Tabs.List grow>
            {/* Home Tab */}
            <Tabs.Tab value="/">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IconHome size="1.3rem" stroke={2} />
                <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Home</span>
              </div>
            </Tabs.Tab>

            {/* Catalog Tab */}
            <Tabs.Tab value="/catalog">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IconListDetails size="1.3rem" stroke={2} />
                <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Catalog</span>
              </div>
            </Tabs.Tab>

            {/* Cart Tab with Badge */}
            <Tabs.Tab value="/cart">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                position: 'relative'
              }}>
                <div style={{ position: 'relative' }}>
                  <IconShoppingCart size="1.3rem" stroke={2} />
                  {totalItems > 0 && (
                    <Badge
                      size="xs"
                      circle
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-8px',
                        background: 'var(--danger-gradient)',
                        border: '2px solid white',
                        minWidth: '18px',
                        height: '18px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.65rem'
                      }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Cart</span>
              </div>
            </Tabs.Tab>

            {/* Orders Tab */}
            <Tabs.Tab value="/orders">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IconReceipt size="1.3rem" stroke={2} />
                <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Orders</span>
              </div>
            </Tabs.Tab>

            {/* More Tab */}
            <Tabs.Tab value="/more">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <IconDots size="1.3rem" stroke={2} />
                <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>More</span>
              </div>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </AppShell.Footer>
    </AppShell>
  );
}

import { useState, useEffect } from 'react';
import { apiService, type Item } from '../services/apiService';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { notifications } from '@mantine/notifications';
import { Title, TextInput, SimpleGrid, Card, Text, Button, Center, Loader, Badge, Group, Stack } from '@mantine/core';
import { IconSearch, IconShoppingCart, IconPackage } from '@tabler/icons-react';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem: addItemToCart } = useCartStore();
  const { currency, posProfile } = useSettingsStore();

  useEffect(() => {
    if (posProfile) {
      setIsLoading(true);
      const itemGroups = posProfile.item_groups.map(g => g.item_group);
      const priceList = posProfile.selling_price_list || posProfile.price_list;
      apiService.getItems(itemGroups, priceList)
        .then(data => {
          setItems(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          notifications.show({
            title: 'Error',
            message: 'Failed to load products',
            color: 'red',
          });
          setIsLoading(false);
        });
    }
  }, [posProfile]);

  const handleAddToCart = (item: Item) => {
    addItemToCart(item);
    notifications.show({
      title: 'Added to Cart',
      message: `${item.item_name} added successfully`,
      color: 'green',
      icon: <IconShoppingCart />,
      autoClose: 2000,
    });
  };

  const filteredItems = items.filter(item =>
    item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center style={{ height: '50vh' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" type="dots" color="violet" />
            <Text c="dimmed" size="sm">Loading products...</Text>
          </Stack>
        </Center>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <Center style={{ height: '50vh' }}>
          <Stack align="center" gap="md">
            <div style={{
              fontSize: '4rem',
              opacity: 0.3
            }}>
              🔍
            </div>
            <Text size="lg" fw={600} c="dimmed">No products found</Text>
            <Text size="sm" c="dimmed">Try adjusting your search terms</Text>
          </Stack>
        </Center>
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {filteredItems.map((item) => (
          <Card
            key={item.name}
            className="hover-lift animate-fade-in"
            shadow="sm"
            padding="lg"
            radius="xl"
            style={{
              border: '1px solid var(--gray-200)',
              background: 'var(--surface-card)',
            }}
          >
            {/* Product Image/Icon */}
            <div style={{
              background: 'var(--primary-gradient)',
              height: '120px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-md)',
              color: 'white',
              fontSize: '3rem',
            }}>
              📦
            </div>

            {/* Product Info */}
            <Stack gap="xs" mb="md">
              <Text fw={700} size="lg" lineClamp={2}>
                {item.item_name}
              </Text>

              <Text size="xs" c="dimmed">
                SKU: {item.name}
              </Text>

              <Group gap="xs">
                <Badge
                  variant="light"
                  color="violet"
                  size="sm"
                  radius="md"
                >
                  {item.item_group}
                </Badge>

                {(item.actual_qty !== undefined && item.actual_qty !== null) && (
                  <Badge
                    variant="light"
                    color={(item.actual_qty || 0) > 10 ? 'green' : (item.actual_qty || 0) > 0 ? 'yellow' : 'red'}
                    size="sm"
                    radius="md"
                  >
                    <IconPackage size={12} style={{ marginRight: 4 }} />
                    {item.actual_qty} in stock
                  </Badge>
                )}
              </Group>
            </Stack>

            {/* Price and Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto'
            }}>
              <Text
                size="xl"
                fw={700}
                className="text-gradient"
              >
                {currency} {(item.standard_rate || 0).toFixed(2)}
              </Text>

              <Button
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape', deg: 135 }}
                size="sm"
                radius="md"
                leftSection={<IconShoppingCart size={16} />}
                onClick={() => handleAddToCart(item)}
              >
                Add
              </Button>
            </div>
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
      {/* Modern Header */}
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
              Product Catalog
            </Title>
            <Text size="sm" style={{ opacity: 0.9 }}>
              Browse and add items to your cart
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
            <Text size="xs" c="white" fw={500} mb={4}>Products</Text>
            <Text size="xl" c="white" fw={700}>{items.length}</Text>
          </div>
        </Group>

        {/* Search Bar */}
        <TextInput
          placeholder="Search products by name or SKU..."
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

      {/* Products Grid */}
      <div className="animate-slide-in">
        {renderContent()}
      </div>
    </div>
  );
}

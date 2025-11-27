import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useDataStore } from '../store/dataStore';
import { apiService } from '../services/apiService';
import { Title, Button, Group, Text, SimpleGrid, NumberInput, ActionIcon, Badge, Card, Select, Stack, Divider, Alert } from '@mantine/core';
import { IconTrash, IconUser, IconMapPin, IconShoppingCart, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

export function CartPage() {
  const navigate = useNavigate();
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const items = useCartStore((state) => state.items);
  const customer = useCartStore((state) => state.customer);
  const customerAddress = useCartStore((state) => state.customerAddress);
  const grandTotal = useCartStore((state) => state.grandTotal);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateRate = useCartStore((state) => state.updateRate);
  const setItemDiscount = useCartStore((state) => state.setItemDiscount);
  const setAdditionalDiscount = useCartStore((state) => state.setAdditionalDiscount);
  const setCustomer = useCartStore((state) => state.setCustomer);
  const setCustomerAddress = useCartStore((state) => state.setCustomerAddress);
  const additionalDiscountType = useCartStore((state) => state.additionalDiscountType);
  const additionalDiscountValue = useCartStore((state) => state.additionalDiscountValue);
  const subTotal = useCartStore((state) => state.subTotal);
  const totalDiscountAmount = useCartStore((state) => state.totalDiscountAmount);
  const clearCart = useCartStore((state) => state.clearCart);

  const currency = useSettingsStore((state) => state.currency);
  const customers = useDataStore((state) => state.customers);

  // Load customer addresses when customer is selected
  useEffect(() => {
    if (customer && typeof customer === 'object') {
      setLoadingAddresses(true);
      apiService.getCustomerAddresses(customer.name)
        .then(addresses => {
          setCustomerAddresses(addresses);
          if (addresses.length === 1) {
            // Auto-select if only one address
            setCustomerAddress(addresses[0].name);
          }
          setLoadingAddresses(false);
        })
        .catch(err => {
          console.error('Failed to load addresses:', err);
          setCustomerAddresses([]);
          setLoadingAddresses(false);
        });
    } else {
      setCustomerAddresses([]);
      setCustomerAddress(null);
    }
  }, [customer, setCustomerAddress]);

  const handleSelectCustomer = (customerName: string) => {
    const selectedCustomer = customers.find(c => c.name === customerName);
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
      notifications.show({
        title: 'Customer Selected',
        message: `${selectedCustomer.customer_name} has been selected`,
        color: 'green',
        icon: <IconCheck />,
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-2xl)' }}>
        <Card
          className="glass animate-fade-in"
          shadow="xl"
          padding="xl"
          radius="xl"
          style={{
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <div style={{
            fontSize: '5rem',
            marginBottom: 'var(--space-lg)'
          }}>
            🛒
          </div>
          <Title order={2} mb="md">Your Cart is Empty</Title>
          <Text size="lg" c="dimmed" mb="xl">
            Add items from the catalog to get started
          </Text>
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 135 }}
            leftSection={<IconShoppingCart size={20} />}
            onClick={() => navigate('/catalog')}
          >
            Browse Catalog
          </Button>
        </Card>
      </div>
    );
  }

  const canCheckout = customer && customerAddress;

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
              Shopping Cart
            </Title>
            <Text size="sm" style={{ opacity: 0.9 }}>
              Review items, select customer, and checkout
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
            <Text size="xs" c="white" fw={500} mb={4}>Items</Text>
            <Text size="xl" c="white" fw={700}>{items.length}</Text>
          </div>
        </Group>

        <Group gap="md">
          <Button
            variant="white"
            color="red"
            onClick={clearCart}
            leftSection={<IconTrash size={16} />}
          >
            Clear Cart
          </Button>
          <Button
            variant="white"
            onClick={() => navigate('/catalog')}
            leftSection={<IconShoppingCart size={16} />}
          >
            Continue Shopping
          </Button>
        </Group>
      </div>

      {/* Customer Selection Section */}
      <Card
        className="animate-slide-in hover-lift"
        shadow="sm"
        padding="lg"
        radius="xl"
        mb="xl"
        style={{
          border: customer ? '2px solid var(--success-500)' : '2px dashed var(--gray-300)',
          background: customer ? 'var(--surface-card)' : 'var(--gray-50)',
        }}
      >
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: customer ? 'var(--success-gradient)' : 'var(--gray-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <IconUser size={20} />
            </div>
            <div>
              <Text fw={600} size="lg">Customer</Text>
              <Text size="xs" c="dimmed">Step 1: Select a customer</Text>
            </div>
          </Group>
          {customer && (
            <Badge size="lg" color="green" variant="filled">
              <IconCheck size={14} style={{ marginRight: 4 }} />
              Selected
            </Badge>
          )}
        </Group>

        {customer ? (
          <Group justify="space-between">
            <div>
              <Text fw={600} size="md">
                {typeof customer === 'object' ? (customer.customer_name || customer.name) : customer}
              </Text>
              {typeof customer === 'object' && customer.customer_group && (
                <Text size="sm" c="dimmed">{customer.customer_group}</Text>
              )}
            </div>
            <Button
              variant="light"
              onClick={() => navigate('/select-customer')}
            >
              Change
            </Button>
          </Group>
        ) : (
          <Group gap="md">
            <Select
              placeholder="Select existing customer..."
              data={customers.map(c => ({ value: c.name, label: c.customer_name || c.name }))}
              searchable
              onChange={(value) => value && handleSelectCustomer(value)}
              style={{ flex: 1 }}
              leftSection={<IconUser size={16} />}
            />
            <Button
              variant="light"
              onClick={() => navigate('/new-customer')}
            >
              Add New
            </Button>
          </Group>
        )}
      </Card>

      {/* Address Selection Section */}
      <Card
        className="animate-slide-in hover-lift"
        shadow="sm"
        padding="lg"
        radius="xl"
        mb="xl"
        style={{
          border: customerAddress ? '2px solid var(--success-500)' : '2px dashed var(--gray-300)',
          background: customerAddress ? 'var(--surface-card)' : 'var(--gray-50)',
          opacity: !customer ? 0.5 : 1,
          pointerEvents: !customer ? 'none' : 'auto',
        }}
      >
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: customerAddress ? 'var(--success-gradient)' : 'var(--gray-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <IconMapPin size={20} />
            </div>
            <div>
              <Text fw={600} size="lg">Delivery Address</Text>
              <Text size="xs" c="dimmed">Step 2: Select delivery address</Text>
            </div>
          </Group>
          {customerAddress && (
            <Badge size="lg" color="green" variant="filled">
              <IconCheck size={14} style={{ marginRight: 4 }} />
              Selected
            </Badge>
          )}
        </Group>

        {!customer ? (
          <Alert icon={<IconAlertCircle size={16} />} color="gray">
            Please select a customer first
          </Alert>
        ) : loadingAddresses ? (
          <Text c="dimmed">Loading addresses...</Text>
        ) : customerAddresses.length === 0 ? (
          <Alert icon={<IconAlertCircle size={16} />} color="yellow">
            No addresses found for this customer. Please add an address in ERPNext.
          </Alert>
        ) : (
          <Select
            placeholder="Select delivery address..."
            data={customerAddresses.map(addr => ({
              value: addr.name,
              label: `${addr.address_line1}, ${addr.city || ''}`
            }))}
            value={customerAddress}
            onChange={(value) => setCustomerAddress(value)}
            leftSection={<IconMapPin size={16} />}
          />
        )}
      </Card>

      {/* Cart Items */}
      <Card className="animate-slide-in" shadow="sm" padding="xl" radius="xl" mb="xl">
        <Title order={3} mb="lg">Cart Items</Title>

        <Stack gap="md">
          {items.map(item => (
            <Card
              key={item.name}
              className="hover-lift"
              padding="md"
              radius="lg"
              style={{
                border: '1px solid var(--gray-200)',
                background: 'var(--gray-50)',
              }}
            >
              <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Text fw={600} size="md" mb={4}>{item.item_name}</Text>
                  <Text size="xs" c="dimmed" mb="md">{item.name}</Text>

                  <Group gap="md" wrap="wrap">
                    <div>
                      <Text size="xs" c="dimmed" mb={4}>Price</Text>
                      <NumberInput
                        value={item.standard_rate}
                        onChange={(value) => updateRate(item.name, value === '' ? item.standard_rate : Number(value))}
                        prefix={`${currency} `}
                        min={0}
                        step={0.01}
                        style={{ width: '120px' }}
                        size="xs"
                      />
                    </div>

                    <div>
                      <Text size="xs" c="dimmed" mb={4}>Quantity</Text>
                      <NumberInput
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.name, value === '' ? undefined : Number(value))}
                        min={1}
                        step={1}
                        style={{ width: '80px' }}
                        size="xs"
                      />
                    </div>

                    <div>
                      <Text size="xs" c="dimmed" mb={4}>Discount</Text>
                      <Group gap={4}>
                        <NumberInput
                          value={item.itemDiscountValue || 0}
                          onChange={(value) => setItemDiscount(item.name, item.itemDiscountType || 'Percentage', Number(value))}
                          min={0}
                          step={0.01}
                          style={{ width: '70px' }}
                          size="xs"
                        />
                        <Select
                          value={item.itemDiscountType || 'Percentage'}
                          onChange={(value) => setItemDiscount(item.name, value as 'Percentage' | 'Amount', item.itemDiscountValue || 0)}
                          data={[
                            { value: 'Percentage', label: '%' },
                            { value: 'Amount', label: currency }
                          ]}
                          style={{ width: '60px' }}
                          size="xs"
                        />
                      </Group>
                    </div>
                  </Group>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Text size="lg" fw={700} className="text-gradient" mb="xs">
                    {currency} {(() => {
                      const itemTotal = (item.standard_rate || 0) * item.quantity;
                      if (item.itemDiscountType && item.itemDiscountValue) {
                        let discount = 0;
                        if (item.itemDiscountType === 'Percentage') {
                          discount = (itemTotal * item.itemDiscountValue) / 100;
                        } else {
                          discount = item.itemDiscountValue * item.quantity;
                        }
                        return (itemTotal - discount).toFixed(2);
                      }
                      return itemTotal.toFixed(2);
                    })()}
                  </Text>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeItem(item.name)}
                    aria-label={`Remove ${item.item_name}`}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </div>
              </Group>
            </Card>
          ))}
        </Stack>
      </Card>

      {/* Discount & Summary */}
      <Card className="animate-slide-in" shadow="sm" padding="lg" radius="xl" mb="md">
        <Title order={4} mb="md">Order Discount</Title>

        <Group gap="md" mb="lg">
          <NumberInput
            label="Discount Amount"
            value={additionalDiscountValue}
            onChange={(value) => setAdditionalDiscount(additionalDiscountType, Number(value))}
            min={0}
            step={0.01}
            style={{ flex: 1 }}
          />
          <Select
            label="Type"
            value={additionalDiscountType}
            onChange={(value) => setAdditionalDiscount(value as 'Percentage' | 'Amount', additionalDiscountValue)}
            data={[
              { value: 'Percentage', label: 'Percentage (%)' },
              { value: 'Amount', label: `Amount (${currency})` }
            ]}
            style={{ width: '150px' }}
          />
        </Group>

        <Divider mb="md" />

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Subtotal</Text>
            <Text fw={600}>{currency} {subTotal().toFixed(2)}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">Total Discount</Text>
            <Text fw={600} c="red">-{currency} {totalDiscountAmount().toFixed(2)}</Text>
          </Group>
        </Stack>
      </Card>

      {/* Checkout Button */}
      <Card
        className="glass animate-slide-in"
        style={{
          background: canCheckout ? 'var(--success-gradient)' : 'var(--gray-gradient)',
          color: 'white',
          padding: 'var(--space-xl)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-2xl)',
        }}
      >
        <Group justify="space-between" align="center">
          <div>
            <Text size="sm" style={{ opacity: 0.9 }} mb={4}>Grand Total</Text>
            <Title order={1} c="white" style={{ fontSize: '2.5rem' }}>
              {currency} {grandTotal().toFixed(2)}
            </Title>
          </div>
          <Button
            size="xl"
            variant="white"
            disabled={!canCheckout}
            onClick={() => navigate('/checkout')}
            style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '1rem 2rem',
            }}
          >
            Proceed to Checkout
          </Button>
        </Group>

        {!canCheckout && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="rgba(255,255,255,0.2)"
            mt="md"
            styles={{
              root: { color: 'white' },
              message: { color: 'white' }
            }}
          >
            Please select both customer and delivery address to proceed
          </Alert>
        )}
      </Card>
    </div>
  );
}

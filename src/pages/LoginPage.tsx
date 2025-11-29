import { useState } from 'react';
import { authService } from '../services/authService';
import { Title, TextInput, Button, Paper, Group, PasswordInput, Alert, Switch, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [useApiKey, setUseApiKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (useApiKey) {
      // For API Key login, we just save it and verify
      localStorage.setItem('erpnext-api-key', `${apiKey}:${apiSecret}`);
      // We need to set a dummy user in session storage to pass isAuthenticated check
      // Ideally we should fetch the user info, but for now let's assume it works if the key is valid
      // We can try to fetch the logged in user to verify the key
      try {
        const response = await fetch('/api/method/frappe.auth.get_logged_user', {
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('erpnext-user', data.message);
          result = { success: true };
        } else {
          result = { success: false, error: 'Invalid API Key or Secret' };
        }
      } catch (e) {
        result = { success: false, error: 'Connection failed' };
      }
    } else {
      result = await authService.login(email, password);
    }

    setLoading(false);
    if (result.success) {
      window.location.reload();
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Group justify="center" align="center" style={{ height: '100vh' }}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ width: '400px' }}>
        <Title order={2} mb="xl" ta="center">Login</Title>

        <Group justify="flex-end" mb="md">
          <Switch
            label="Use API Key"
            checked={useApiKey}
            onChange={(event) => setUseApiKey(event.currentTarget.checked)}
          />
        </Group>

        <form onSubmit={handleSubmit}>
          {!useApiKey ? (
            <>
              <TextInput
                label="Email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                mt="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <TextInput
                label="API Key"
                placeholder="Enter your API Key"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
              />
              <PasswordInput
                label="API Secret"
                placeholder="Enter your API Secret"
                required
                mt="md"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                disabled={loading}
              />
              <Text size="xs" c="dimmed" mt="xs">
                Generate keys in ERPNext: User &gt; API Access
              </Text>
            </>
          )}

          {error && (
            <Alert color="red" title="Login Error" icon={<IconAlertCircle />} mt="md">
              {error}
            </Alert>
          )}
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Login
          </Button>
        </form>
      </Paper>
    </Group>
  );
}

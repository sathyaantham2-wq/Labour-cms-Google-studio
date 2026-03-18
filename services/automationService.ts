import { api } from './api';

export const triggerAutomationWebhook = async (event: string, data: unknown): Promise<void> => {
  let n8nUrl = '';
  let makeUrl = '';

  try {
    const settings = await api.getSettings();
    n8nUrl = settings['n8n_webhook_url'] || '';
    makeUrl = settings['make_webhook_url'] || '';
  } catch {
    // Settings unavailable – skip webhook
    return;
  }

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  if (n8nUrl) {
    fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('n8n webhook error:', err));
  }

  if (makeUrl) {
    fetch(makeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('Make.com webhook error:', err));
  }
};

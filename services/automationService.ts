
export const triggerAutomationWebhook = async (event: string, data: any) => {
  const n8nUrl = localStorage.getItem('n8n_webhook_url');
  const makeUrl = localStorage.getItem('make_webhook_url');

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  // Trigger n8n if configured
  if (n8nUrl) {
    try {
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(err => console.error('n8n Webhook failed:', err));
    } catch (e) {
      console.error('n8n fetch error:', e);
    }
  }

  // Trigger Make if configured
  if (makeUrl) {
    try {
      fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(err => console.error('Make Webhook failed:', err));
    } catch (e) {
      console.error('Make fetch error:', e);
    }
  }
};

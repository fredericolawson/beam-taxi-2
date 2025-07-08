# ngrok Playbook for Local Webhook Testing

## 🎯 **What is ngrok?**

ngrok creates a secure tunnel from the internet to your local development server, allowing external services (like Telegram) to send webhooks to your localhost.

## 🛠️ **Installation**

### Install via Homebrew (macOS):

```bash
brew install ngrok
```

### Verify Installation:

```bash
ngrok --version
```

## 🚀 **Local Webhook Testing Setup**

### **Step 1: Start Your Development Server**

```bash
npm run dev
```

- Starts Next.js on `http://localhost:3000`
- Keep this running in the background

### **Step 2: Start ngrok Tunnel**

```bash
ngrok http 3000
```

- Creates secure HTTPS tunnel to localhost:3000
- **Keep this running** - do not close this terminal
- You'll see output like:

```
Forwarding https://abc123.ngrok-free.app -> http://localhost:3000
```

### **Step 3: Get Your ngrok URL**

```bash
curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url'
```

- Returns your public ngrok URL (e.g., `https://abc123.ngrok-free.app`)
- This URL changes each time you restart ngrok

### **Step 4: Update Telegram Webhook**

```bash
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_NGROK_URL/api/telegram/webhook",
    "allowed_updates": ["message", "callback_query"]
  }'
```

- Replace `{BOT_TOKEN}` with your actual bot token
- Replace `YOUR_NGROK_URL` with the URL from Step 3

### **Step 5: Verify Webhook Setup**

```bash
curl "https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo"
```

- Should show your ngrok URL in the response

## 🧪 **Testing Your Webhook**

### **Method 1: Simple Test**

```bash
curl -X POST https://YOUR_NGROK_URL/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

- Should return `{"success":true}`

### **Method 2: Test Callback Query**

```bash
curl -X POST https://YOUR_NGROK_URL/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "callback_query": {
      "id": "test123",
      "from": {"id": 6749327457, "first_name": "Test Driver"},
      "message": {"message_id": 123},
      "data": "accept_test-trip-id"
    }
  }'
```

### **Method 3: Use Test Page**

- Navigate to: `http://localhost:3000/test/trip`
- Click "Send Trip Request"
- Check webhook receives real Telegram callback

## 📊 **Monitoring & Debugging**

### **ngrok Web Interface**

- Visit: `http://127.0.0.1:4040`
- See all HTTP requests to your tunnel
- View request/response details

### **Console Logs**

- Check your Next.js dev server console
- Add `console.log()` statements in webhook handler
- See real-time webhook data

### **Common Issues**

**❌ Connection Refused Error:**

```
dial tcp [::1]:8080: connect: connection refused
```

- **Solution:** ngrok pointing to wrong port
- **Fix:** Use `ngrok http 3000` (not 8080)

**❌ DNS Resolution Error:**

```
Failed to resolve host: Temporary failure in name resolution
```

- **Solution:** Telegram can't reach your URL
- **Fix:** Use ngrok tunnel instead of domain

**❌ 500 Internal Server Error:**

- **Solution:** Check Next.js console for error details
- **Common causes:** Database connection, missing environment variables

## 🔄 **Reset to Production**

### **When Finished Testing:**

```bash
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-production-domain.com/api/telegram/webhook",
    "allowed_updates": ["message", "callback_query"]
  }'
```

### **Stop ngrok:**

- Press `Ctrl+C` in ngrok terminal
- Or: `pkill ngrok`

## 💡 **Pro Tips**

### **Keep URLs Handy:**

```bash
# Get current ngrok URL quickly
ngrok_url() {
  curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url'
}
```

### **Update Webhook Script:**

```bash
#!/bin/bash
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')
curl -X POST "https://api.telegram.org/bot{BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$NGROK_URL/api/telegram/webhook\", \"allowed_updates\": [\"message\", \"callback_query\"]}"
```

### **Environment Variables:**

- ngrok uses your local `.env.local` file
- Ensure Supabase credentials are correct
- Database operations use local environment

## 🔐 **Security Notes**

- ngrok URLs are publicly accessible
- Don't share ngrok URLs publicly
- URLs expire when ngrok restarts
- Use HTTPS endpoints only for Telegram webhooks

## 📋 **Quick Reference**

| Command                                                                       | Purpose                        |
| ----------------------------------------------------------------------------- | ------------------------------ |
| `ngrok http 3000`                                                             | Start tunnel to localhost:3000 |
| `curl -s http://127.0.0.1:4040/api/tunnels \| jq -r '.tunnels[0].public_url'` | Get ngrok URL                  |
| `pkill ngrok`                                                                 | Stop ngrok                     |
| `http://127.0.0.1:4040`                                                       | ngrok web interface            |
| `npm run dev`                                                                 | Start Next.js dev server       |

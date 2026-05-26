<div align="center">
  <img src="web/img/MondayRelayBanner.png" alt="Monday Discord Relay by Pigeon Studios" width="2000" />
</div>

<div align="center">
  <h1>Monday Discord Relay</h1>
</div>

<div align="center">
  <strong>Production-ready Monday.com → Discord deployment relay with dynamic embeds, Render hosting support, duplicate protection, and live GraphQL board integration.</strong><br>
  Built for professional development workflows and deployment pipelines.
</div>

---

## 🔍 Repository Information

| Field | Value |
|------|------|
| **Repository Name** | monday-discord-relay |
| **Language** | Node.js |
| **Category** | Automation / Deployment Pipeline |
| **Runtime** | Express.js |
| **Hosting Platform** | Render |
| **API Integration** | Monday.com GraphQL API |
| **Notification System** | Discord Webhooks |
| **Original Author / Studio** | Pigeon Studios |
| **Status** | Production Stable |

---

## 🧩 Overview

Monday Discord Relay is a production-ready automation service designed to bridge Monday.com deployment workflows directly into Discord.

When an item is moved into a configured deployment group within Monday.com, the relay automatically:

- Retrieves live item metadata using the Monday GraphQL API
- Resolves board information dynamically
- Generates professional deployment embeds
- Sends deployment notifications into Discord
- Prevents duplicate webhook executions
- Supports role pings and configurable embed layouts
- Provides health monitoring endpoints
- Supports fully environment-driven configuration

Designed specifically for organised development teams and production deployment pipelines.

---

## 🚀 Core Features

### Monday.com Integration
- Live Monday GraphQL API integration
- Dynamic board lookups
- Dynamic item resolution
- Automatic account slug detection
- Group transition tracking

### Discord Integration
- Rich deployment embeds
- Role mention support
- Dynamic webhook usernames
- Professional deployment formatting
- Configurable embed styling

### Production Features
- Duplicate webhook protection
- Health monitoring endpoint
- Render deployment support
- Environment-driven configuration
- Debug field support
- Safe field validation
- Timestamp formatting
- Request timeout handling

### Infrastructure
- Zero database dependencies
- Stateless architecture
- Lightweight deployment footprint
- Fully cloud deployable
- Production-safe webhook handling

---

## 🔄 System Flow

```text
Monday.com
    ↓
Webhook Trigger
    ↓
Render Web Service
    ↓
Monday GraphQL API
    ↓
Discord Webhook Delivery
```

---

## 📁 Repository Structure

| Path | Description |
|------|-------------|
| server.js | Main relay application |
| examples/.env.example | Example environment configuration |
| web/img/ | Repository banner and branding assets |
| README.md | Repository documentation |
| LICENSE | Repository licensing |
| package.json | Node.js dependency manifest |

---

## ⚙️ Dependencies

Required:
- express
- axios
- dotenv

External Services:
- Monday.com
- Discord
- Render

---

# 🌐 Render Deployment Guide

## 1) Create a GitHub Repository

Push the repository to GitHub.

Example:
```bash
git init
git add .
git commit -m "Initial production deployment"
git push
```

---

## 2) Create a Free Render Account

Website:
https://render.com

Sign in using GitHub.

---

## 3) Create a New Web Service

Inside Render:

- New +
- Web Service
- Connect your GitHub repository
- Select `monday-discord-relay`

---

## 4) Configure Render Settings

| Setting | Value |
|------|------|
| Runtime | Node |
| Build Command | npm install |
| Start Command | node server.js |

---

## 5) Configure Environment Variables

Inside Render → Environment:

Add the variables from:
```text
examples/.env.example
```

---

## 6) Deploy Service

Click:
```text
Deploy Web Service
```

Once deployed, Render will provide a public URL:

```text
https://your-service.onrender.com
```

---

# 📌 Monday.com Setup

## 1) Generate Monday API Token

Inside Monday.com:

- Avatar
- Administration
- Connections
- API
- Generate Token

Copy the token into:

```env
MONDAY_API_TOKEN=
```

---

## 2) Create Automation

Inside your Monday board:

```text
When an item moves to group, send webhook
```

Webhook URL:
```text
https://your-service.onrender.com/monday
```

---

## 3) Configure Deployment Group

Example:
```env
TARGET_GROUP_NAME=Ready for Deployment
```

When an item enters this group, the relay will trigger.

---

# 🔔 Discord Webhook Setup

## 1) Create Webhook

Inside Discord:

- Edit Channel
- Integrations
- Webhooks
- New Webhook

Copy webhook URL into:

```env
DISCORD_WEBHOOK_URL=
```

---

## 2) Optional Role Ping

Enable deployment role pings:

```env
DISCORD_ROLE_ID=
```

Example:
```env
DISCORD_ROLE_ID=123456789012345678
```

---

# 🛠 Environment Variables

| Variable | Required | Description |
|------|------|------|
| DISCORD_WEBHOOK_URL | Yes | Discord webhook endpoint |
| MONDAY_API_TOKEN | Yes | Monday GraphQL API token |
| TARGET_GROUP_NAME | Yes | Deployment trigger group |
| DISCORD_ROLE_ID | No | Role to ping on deployment |
| TEST_ROUTE_ENABLED | No | Enables /test-discord route |
| EMBED_TITLE | No | Embed title |
| EMBED_STATUS | No | Embed status text |
| EMBED_FOOTER | No | Embed footer |
| EMBED_COLOR | No | Embed hex/integer color |
| SHOW_DEBUG_FIELDS | No | Shows debug fields inside embeds |

---

# 🧪 Health Endpoints

## Root
```text
/
```

Returns:
```text
Relay online confirmation
```

---

## Health Check
```text
/health
```

Returns:
```json
{
  "status": "ok"
}
```

---

## Monday Endpoint
```text
/monday
```

Webhook endpoint used by Monday.com.

---

## Discord Test Route
```text
/test-discord
```

Only enabled when:

```env
TEST_ROUTE_ENABLED=true
```

---

# 📋 Example Deployment Embed

```text
✔ Ready for Deployment

Vehicle Inventory Rewrite is now ready for deployment.

Status: Ready for Deployment
Board: CaliWorld Development
Moved To: Ready for Deployment
Moved From: In Development
Triggered By: Monday User
Moved At: Today at 10:42
```

---

# 🔐 Security Notes

- Never commit real API tokens
- Never commit Discord webhooks
- Keep `.env` private
- Use Render environment variables
- Rotate compromised tokens immediately

---

# 🚦 Production Recommendations

Recommended:
- Private GitHub repository
- Render environment variables only
- Disabled debug fields
- Disabled public test route
- Dedicated deployment Discord channel

---

# 🛠 Troubleshooting

## Webhook Not Triggering
- Verify Monday automation is active
- Verify Render service is online
- Verify webhook URL is correct

## Unknown Item / Board
- Verify MONDAY_API_TOKEN
- Verify token permissions

## Discord Webhook Fails
- Verify Discord webhook URL
- Verify webhook still exists

## Duplicate Messages
Duplicate protection is automatically enabled.

---

# 📄 Licensing & Usage

Copyright © Pigeon Studios

This repository and all associated source code remain the property of Pigeon Studios.

Redistribution, resale, relicensing, or public redistribution without explicit written permission is prohibited.

Licensed deployments are restricted to authorised environments only.

---

# 🤝 Credits

Developed by Pigeon Studios  
Built for professional deployment workflows and production infrastructure.
<div align="center">
  <img src="web/img/MondayRelayBanner.png" alt="Monday Discord Relay by Pigeon Studios" width="2000" />
</div>

<div align="center">
  <h1>Monday Discord Relay</h1>
</div>

<div align="center">

[![Version](https://img.shields.io/github/v/release/WelshPigeon/monday-discord-relay?style=for-the-badge&color=7A3FFF)](https://github.com/WelshPigeon/monday-discord-relay/releases)
[![License](https://img.shields.io/badge/License-Pigeon%20Studios%20Proprietary-7A3FFF?style=for-the-badge)](https://github.com/WelshPigeon/monday-discord-relay/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/WelshPigeon/monday-discord-relay?style=for-the-badge&color=7A3FFF)](https://github.com/WelshPigeon/monday-discord-relay/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/WelshPigeon/monday-discord-relay?style=for-the-badge&color=7A3FFF)](https://github.com/WelshPigeon/monday-discord-relay)
![Node.js](https://img.shields.io/badge/Node.js-20+-black?style=for-the-badge&logo=node.js&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-black?style=for-the-badge&logo=render&logoColor=white)

</div>

<div align="center">
  <strong>
    Production-ready Monday.com to Discord deployment relay with dynamic embeds,
    Render hosting support, duplicate protection, and live GraphQL board integration.
  </strong>
  <br>
  Built for professional development workflows, deployment pipelines, and organised infrastructure management.
</div>

---

> ⚠️ This repository is actively maintained and production deployed.

---

# 🔍 Repository Information

| Field | Value |
|------|------|
| **Repository Name** | monday-discord-relay |
| **Language** | Node.js |
| **Category** | Automation / Deployment Pipeline |
| **Runtime** | Express.js |
| **Hosting Platform** | Render |
| **API Integration** | Monday.com GraphQL API |
| **Notification System** | Discord Webhooks |
| **Architecture** | Stateless Webhook Relay |
| **Deployment Model** | Cloud Hosted |
| **Original Author / Studio** | Pigeon Studios |
| **Status** | Production Stable |

---

# 🧩 Overview

Monday Discord Relay is a production-ready webhook automation service designed to bridge Monday.com deployment workflows directly into Discord.

When an item is moved into a configured deployment group within Monday.com, the relay automatically:

- Retrieves live item metadata using the Monday GraphQL API
- Resolves board information dynamically
- Detects deployment group transitions
- Generates professional deployment embeds
- Sends deployment notifications into Discord
- Prevents duplicate webhook executions
- Supports role pings and configurable embed layouts
- Provides health monitoring endpoints
- Supports fully environment-driven configuration

Designed specifically for organised development teams, deployment pipelines, and production infrastructure workflows.

---

# ⚡ Quick Start

```bash
git clone https://github.com/WelshPigeon/monday-discord-relay
cd monday-discord-relay

npm install

cp examples/.env.example .env

node server.js
```

---

# 🚀 Core Features

## Monday.com Integration

| Feature | Included |
|---|---|
| Live GraphQL API Integration | ✅ |
| Dynamic Item Resolution | ✅ |
| Dynamic Board Lookups | ✅ |
| Automatic Account Slug Detection | ✅ |
| Group Transition Tracking | ✅ |
| Dynamic Webhook Metadata | ✅ |

---

## Discord Integration

| Feature | Included |
|---|---|
| Rich Deployment Embeds | ✅ |
| Role Mention Support | ✅ |
| Dynamic Webhook Usernames | ✅ |
| Configurable Embed Styling | ✅ |
| Deployment Status Tracking | ✅ |
| Professional Notification Formatting | ✅ |

---

## Production Features

| Feature | Included |
|---|---|
| Duplicate Webhook Protection | ✅ |
| Stateless Architecture | ✅ |
| Health Monitoring Endpoint | ✅ |
| Render Deployment Support | ✅ |
| Environment-Driven Configuration | ✅ |
| Timestamp Formatting | ✅ |
| Safe Field Validation | ✅ |
| Request Timeout Handling | ✅ |
| Debug Mode Support | ✅ |

---

## Infrastructure

| Feature | Included |
|---|---|
| Zero Database Dependencies | ✅ |
| Lightweight Runtime | ✅ |
| Cloud Deployable | ✅ |
| PM2 Compatible | ✅ |
| Docker Compatible | ✅ |
| Production-Safe Webhook Handling | ✅ |

---

# 🔄 System Flow

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

# ☁️ Supported Platforms

- Render
- Railway
- VPS / Dedicated Hosting
- PM2 Environments
- Docker Deployments
- Node.js Cloud Services

---

# 📁 Repository Structure

| Path | Description |
|------|-------------|
| .github/ISSUE_TEMPLATE/ | GitHub issue templates |
| .github/workflows/ | GitHub Actions CI workflows |
| .github/CODEOWNERS | Repository ownership configuration |
| .github/pull_request_template.md | Pull request template |
| examples/.env.example | Example environment configuration |
| web/img/ | Repository branding, banners, and social preview assets |
| server.js | Main relay application |
| README.md | Primary repository documentation |
| CONTRIBUTING.md | Contribution guidelines and workflow standards |
| CHANGELOG.md | Repository version and release tracking |
| LICENSE | Plain-text GitHub-recognised proprietary license |
| LICENSE.md | Fully formatted enterprise license agreement |
| package.json | Node.js dependency manifest |
| package-lock.json | Dependency lockfile |

---

# ⚙️ Dependencies

## Required

- express
- axios
- dotenv

---

## External Services

- Monday.com
- Discord
- Render

---

# 📦 Versioning

This repository follows semantic versioning.

| Version Type | Description |
|---|---|
| Major | Breaking changes |
| Minor | New features and functionality |
| Patch | Fixes, optimisations, and improvements |

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

```text
https://render.com
```

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

Add all variables from:

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

When an item enters this group, the relay will trigger automatically.

---

# 🔔 Discord Webhook Setup

## 1) Create Webhook

Inside Discord:

- Edit Channel
- Integrations
- Webhooks
- New Webhook

Copy the webhook URL into:

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
- Never publicly expose `.env` files
- Use Render environment variables only
- Rotate compromised tokens immediately
- Keep deployment channels restricted
- Disable debug routes in production

---

# 🚦 Production Recommendations

Recommended configuration:

- Private GitHub repository
- Protected branches enabled
- Render environment variables only
- Disabled debug fields
- Disabled public test route
- Dedicated deployment Discord channel
- Separate staging and development branches
- Versioned releases and deployment tags

---

# 🛠 Troubleshooting

## Webhook Not Triggering

- Verify Monday automation is active
- Verify Render service is online
- Verify webhook URL is correct
- Verify deployment group matches `TARGET_GROUP_NAME`

---

## Unknown Item / Board

- Verify `MONDAY_API_TOKEN`
- Verify token permissions
- Verify board access permissions

---

## Discord Webhook Fails

- Verify Discord webhook URL
- Verify webhook still exists
- Verify Discord channel permissions

---

## Duplicate Messages

Duplicate protection is automatically enabled and handled internally.

---

# 🆘 Support

For deployment issues, bug reports, or infrastructure assistance:

- Open a GitHub Issue
- Submit a Feature Request
- Review the troubleshooting section
- Contact Pigeon Studios

---

# 📄 Licensing & Usage

Copyright © Pigeon Studios

This repository and all associated source code remain the exclusive property of Pigeon Studios.

Redistribution, resale, sublicensing, relicensing, public mirroring, or unauthorised commercial usage without explicit written permission from Pigeon Studios is strictly prohibited.

Licensed deployments are restricted to authorised environments only.

Refer to the `LICENSE` file for full proprietary licensing terms.

---

# 🤝 Credits

Developed by Pigeon Studios

Built for professional deployment workflows, production infrastructure, and organised development operations.

---
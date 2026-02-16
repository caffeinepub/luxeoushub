# Custom Domain Setup for luxeoushub.com

This document provides instructions for configuring the custom domain `luxeoushub.com` for your Luxeoushub application.

## Overview

To use `luxeoushub.com` as your custom domain, you need to:
1. Configure DNS records with your domain registrar
2. Map the custom domain in your hosting platform settings
3. Verify the domain is properly configured

## DNS Configuration

### Required DNS Records

Configure the following DNS records with your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare):

#### Option A: Using CNAME Records (Recommended)

If your DNS provider supports CNAME flattening (ALIAS or ANAME records) for the apex domain:

| Record Type | Host/Name | Value/Target | TTL |
|-------------|-----------|--------------|-----|
| CNAME (or ALIAS/ANAME) | @ or luxeoushub.com | luxeoushub.com.icp1.io | 3600 |
| TXT | _canister-id.luxeoushub.com | [YOUR_CANISTER_ID] | 3600 |
| CNAME | _acme-challenge.luxeoushub.com | _acme-challenge.luxeoushub.com.icp2.io | 3600 |

**Note:** Cloudflare, Namecheap (ALIAS), and some other providers support CNAME flattening for apex domains.

#### Option B: Using A Records (If CNAME Not Supported for Apex)

If your DNS provider (e.g., GoDaddy) does not support CNAME for the apex domain, use A and AAAA records:

| Record Type | Host/Name | Value/Target | TTL |
|-------------|-----------|--------------|-----|
| A | @ | 193.118.63.173 | 3600 |
| A | @ | 193.118.63.174 | 3600 |
| AAAA | @ | 2a0b:21c0:b002:2:5000:59ff:fead:c233 | 3600 |
| AAAA | @ | 2a0b:21c0:b002:2:5000:5aff:fe9e:5e | 3600 |
| TXT | _canister-id | [YOUR_CANISTER_ID] | 3600 |
| CNAME | _acme-challenge | _acme-challenge.luxeoushub.com.icp2.io | 3600 |

**Important:** Replace `[YOUR_CANISTER_ID]` with your actual backend canister ID.

### DNS Provider-Specific Instructions

#### Cloudflare
1. Log into your Cloudflare dashboard
2. Select your domain
3. Go to DNS settings
4. Add the CNAME records as specified above
5. Ensure "Proxy status" is set to "DNS only" (gray cloud icon)

#### Namecheap
1. Log into your Namecheap account
2. Go to Domain List → Manage
3. Select "Advanced DNS" tab
4. Add ALIAS record for @ pointing to luxeoushub.com.icp1.io
5. Add TXT and CNAME records as specified

#### GoDaddy
1. Log into your GoDaddy account
2. Go to My Products → DNS
3. Add A and AAAA records as specified in Option B
4. Add TXT and CNAME records as specified

## Platform Configuration

### Step 1: Create the ic-domains File

In your canister, create a file at `.well-known/ic-domains` containing:


# ThinkGym - EmailJS Setup Instructions

The booking form uses EmailJS to send form submissions via email. Follow these steps to set it up:

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month on free tier)

## Step 2: Create an Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.) and connect it
4. Copy your **Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New ThinkGym Session Request

Hello,

You have received a new ThinkGym session request:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Session Type: {{session_type}}
Preferred Date & Time: {{preferred_date}}

Topic/Issue:
{{topic}}

Best regards,
ThinkGym
```

4. Copy your **Template ID** (e.g., `template_xxxxxxx`)

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `xxxxxxxxxxxxx`)

## Step 5: Update the Code

Open `script.js` and replace these placeholders:

1. **YOUR_PUBLIC_KEY** - Replace with your Public Key (appears twice)
2. **YOUR_SERVICE_ID** - Replace with your Service ID
3. **YOUR_TEMPLATE_ID** - Replace with your Template ID
4. **YOUR_EMAIL@example.com** - Replace with your actual email address (optional, if you want to receive a copy)

### Example:

```javascript
emailjs.init("abcd1234xyz"); // Your Public Key

emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

## Step 6: Test

1. Fill out the booking form on your website
2. Submit it
3. Check your email inbox for the form submission

---

## Alternative: Using Formspree (Even Simpler)

If you prefer an even simpler option, you can use Formspree:

1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up and create a form
3. Get your form endpoint URL
4. Update the form action in `index.html`:

```html
<form class="booking-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Remove the JavaScript form handler and let Formspree handle it natively.




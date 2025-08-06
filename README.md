# MyCCBA Infobip WhatsApp Flow

A Node.js webhook server for handling WhatsApp Flow interactions via Infobip's platform. This application provides a comprehensive beverage ordering system with customer management, product catalog, and order processing capabilities.

## Features

- WhatsApp Flow webhook handling
- Customer management and authentication
- Product catalog (Sports drinks, Soft drinks, Energy drinks)
- Shopping cart functionality
- Order processing and history
- Account balance and credit management
- Rewards and loyalty system
- Customer statistics and analytics

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd myccba-infobip
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create a `.env` file):
```env
INFOBIP_API_KEY=your_infobip_api_key
WHATSAPP_SENDER_NUMBER=your_whatsapp_sender_number
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

- `POST /webhook/whatsapp-flow` - Main webhook endpoint for WhatsApp Flow
- `GET /health` - Health check endpoint
- `GET /debug/data` - Debug endpoint to view dummy data

## Deployment to Vercel

### Prerequisites

- Vercel account
- Vercel CLI (optional)

### Deployment Steps

1. **Install Vercel CLI (optional):**
```bash
npm i -g vercel
```

2. **Deploy using Vercel Dashboard:**
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Vercel
   - Vercel will automatically detect it's a Node.js app

3. **Deploy using Vercel CLI:**
```bash
vercel
```

4. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `INFOBIP_API_KEY` - Your Infobip API key
     - `WHATSAPP_SENDER_NUMBER` - Your WhatsApp sender number

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `INFOBIP_API_KEY` | Your Infobip API key for sending messages | Yes |
| `WHATSAPP_SENDER_NUMBER` | Your WhatsApp sender number | Yes |
| `PORT` | Port for the server (Vercel sets this automatically) | No |

## Project Structure

```
myccba-infobip/
├── index.js          # Main application file
├── package.json      # Dependencies and scripts
├── vercel.json       # Vercel configuration
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Testing

The application includes dummy data for testing:

- **Test Customers:**
  - Siyaya Trading (+27123456789)
  - Metro Corner Shop (+27987654321)
  - Sunshine Retailers (+27111222333)

- **Test Products:**
  - Sports drinks (Powerade variants)
  - Soft drinks (Coca-Cola, Sprite, Fanta)
  - Energy drinks (Monster, Red Bull)

## Support

For issues and questions, please contact the MyCCBA development team. 
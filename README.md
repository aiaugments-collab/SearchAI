# SearchAI

A powerful AI-powered search engine with an intelligent generative UI.

![SearchAI Screenshot](/public/screenshot-2025-05-04.png)

## Overview

SearchAI combines advanced AI capabilities with a modern, intuitive interface to deliver intelligent search results and interactive responses.

## ✨ Key Features

### 🧠 AI-Powered Search

- Natural language question understanding
- Intelligent response generation with interactive UI
- Multiple AI model support with real-time switching
- Reasoning models with visible thought processes

### 🔐 User Authentication

- Secure user authentication system
- Email/Password registration and login
- Google Social Login integration

### 💬 Chat & History

- Persistent chat history
- Shareable search results
- Redis-powered session management

### 🔍 Advanced Search

- Multiple search provider integration (Tavily, SearXNG, Exa)
- URL-specific search capabilities
- Video search support
- Customizable search depth and filtering
- Safe search options with time range filtering

### 🤖 AI Model Support

- OpenAI (GPT-4, GPT-3.5)
- Google Generative AI
- Azure OpenAI
- Anthropic Claude
- Ollama (Local models)
- Groq
- DeepSeek
- Fireworks
- xAI (Grok)
- OpenAI Compatible APIs

## 🛠 Technology Stack

### Frontend & Backend

- **Next.js** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **Vercel AI SDK** - Streaming and Generative UI components

### Authentication & Database

- **Supabase** - Authentication and backend services

### Search & AI

- **OpenAI** - Primary AI provider
- **Tavily AI** - Default search provider
- **SearXNG** - Self-hosted search option
- **Exa** - Neural search capabilities

### Storage & Caching

- **Upstash Redis** - Serverless Redis for production
- **Redis** - Local development option

### UI & Design

- **Tailwind CSS** - Modern utility-first styling
- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Consistent icon system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API key
- Tavily API key (for search functionality)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ai_search_engine
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Environment Setup**

```bash
cp .env.local.example .env.local
```

Configure your environment variables in `.env.local`:

```bash
# Required API Keys
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key

# Optional: Additional AI providers
GOOGLE_GENERATIVE_AI_API_KEY=
ANTHROPIC_API_KEY=
# ... see .env.local.example for all options
```

4. **Run the application**

```bash
bun dev
# or
npm run dev
```

Visit `http://localhost:3000` to start using SearchAI.

### Docker Deployment

```bash
docker compose up -d
```

## 🎯 Usage

1. **Ask Questions**: Type natural language questions in the search box
2. **Interactive Results**: Get AI-generated responses with interactive components
3. **Model Selection**: Switch between different AI models from the UI
4. **Chat History**: Access your previous searches and conversations
5. **Share Results**: Share interesting search results with others

## ⚙️ Configuration

For detailed configuration options including Redis setup, additional AI providers, and search customization, see the [Configuration Guide](docs/CONFIGURATION.md).

## 📝 Notes

- This project uses `pnpm` as the package manager
- Environment variables must be properly configured for full functionality
- Some features require additional API keys and services

---

_SearchAI - Intelligent search powered by AI_

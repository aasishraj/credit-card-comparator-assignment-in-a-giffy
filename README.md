# 🏦 CreditCard Comparator - AI-Powered Credit Card Comparison

A comprehensive credit card comparison web application built with **Next.js**, **AI SDK**, and **Bun**. This app helps users find and compare the best credit cards in India using both traditional filters and AI-powered natural language queries.

## ✨ Features

### 🔍 **Smart Search & Filtering**
- Advanced filtering by bank, category, features (lounge access, fuel cashback)
- Search by card name, bank, or benefits
- Annual fee filtering and sorting options

### 🤖 **AI-Powered Assistant**
- Natural language queries like "Best cards with airport lounge access and low annual fee"
- Intelligent card comparison suggestions
- AI-generated pros and cons analysis for each card
- Semantic search using OpenAI GPT-4

### 📊 **Comprehensive Comparison**
- Side-by-side comparison table for up to 4 cards
- Detailed feature comparison with visual indicators
- Benefits breakdown and analysis

### 💳 **Detailed Card Information**
- Individual card detail pages with complete specifications
- Real-time AI analysis of pros and cons
- Benefits, eligibility, and reward structure details

### 🏛️ **Indian Banks Coverage**
- HDFC Bank, ICICI Bank, Axis Bank, State Bank of India
- Premium, Mid-tier, Entry-level, and Cashback categories
- 10+ comprehensive credit card profiles

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Package Manager**: Bun
- **AI Integration**: OpenAI API via AI SDK
- **Styling**: Tailwind CSS + Custom CSS Variables
- **UI Components**: Custom components built with Radix UI primitives
- **TypeScript**: Full type safety throughout the application
- **Data**: JSON-based mock dataset (easily replaceable with database)

## 🚀 Getting Started

### Prerequisites
- Bun installed on your system
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credit-card-comparator
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
credit-card-comparator/
├── app/                          # Next.js App Router
│   ├── api/ai-query/            # AI query API endpoint
│   ├── cards/[id]/              # Dynamic card detail pages
│   ├── globals.css              # Global styles with CSS variables
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── ai-chat.tsx              # AI chat interface
│   ├── comparison-table.tsx     # Card comparison component
│   └── credit-card-grid.tsx     # Card grid display
├── data/                        # Mock data
│   └── credit-cards.json        # Credit card dataset
├── lib/                         # Utility libraries
│   ├── ai-service.ts            # OpenAI integration
│   ├── types.ts                 # TypeScript interfaces
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 💬 AI Features

### Natural Language Queries
The AI assistant supports various query types:

- **Search**: "Show me cards with fuel cashback"
- **Compare**: "Compare HDFC Infinia vs Axis Magnus"
- **Recommend**: "Best cards for online shopping under ₹2000 annual fee"
- **Filter**: "Premium cards with lounge access from HDFC Bank"

### AI Analysis
Each credit card includes AI-generated analysis:
- **Pros**: Key advantages and benefits
- **Cons**: Potential drawbacks and limitations
- **Recommendations**: Personalized suggestions based on user preferences

## 🎯 Usage Examples

### 1. **Using Filters**
- Select banks, categories, and features
- Set maximum annual fee limits
- Search by keywords

### 2. **AI Chat Interface**
```
User: "Best travel cards with airport lounge access"
AI: "I found 4 excellent travel cards with lounge access. Here are the top recommendations..."
```

### 3. **Card Comparison**
- Add cards to comparison from search results
- View side-by-side feature comparison
- Analyze benefits and eligibility criteria

## 🔧 Customization

### Adding New Cards
Update `data/credit-cards.json` with new card information:

```json
{
  "id": "unique-card-id",
  "name": "Card Name",
  "bank": "Bank Name",
  "category": "Premium",
  "annualFee": 0,
  "benefits": ["Benefit 1", "Benefit 2"],
  // ... other properties
}
```

### Modifying AI Behavior
Edit `lib/ai-service.ts` to customize:
- Query parsing logic
- Response generation
- Card analysis criteria

### UI Customization
- Modify CSS variables in `app/globals.css`
- Update component styles in `components/ui/`
- Customize Tailwind configuration

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Environment Variables

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for future integrations)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_connection_string
```

## 📊 Dataset Information

The current dataset includes:
- **10 credit cards** from major Indian banks
- **Complete feature specifications** including fees, rewards, and benefits
- **Categorized data** for easy filtering and comparison
- **Realistic data** based on actual credit card offerings

## 🔄 Future Enhancements

- [ ] Real-time data integration with bank APIs
- [ ] User accounts and personalized recommendations
- [ ] Credit score integration
- [ ] Mobile app development
- [ ] Vector database for enhanced semantic search
- [ ] User reviews and ratings system
- [ ] EMI calculator integration
- [ ] Card application tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Vercel** for Next.js framework
- **Tailwind CSS** for styling system
- **Radix UI** for accessible components
- **Lucide** for beautiful icons

---

**Built with ❤️ using Next.js, AI SDK, and Bun**

# VIZI - AI-Powered Data Storyteller

VIZI is a sophisticated data visualization platform that transforms raw CSV data into interactive, insightful dashboards instantly. Powered by Google Gemini AI, VIZI narrates the story behind your data, highlights correlations, and provides intelligent chart summaries.

## 🚀 Features

- **Instant Visualization**: Drag and drop CSV files to generate beautiful, interactive charts.
- **AI Analytical Narrative**: Get a high-level summary of your dataset's trends and insights using Gemini AI.
- **Multi-CSV Merging**: Combine multiple CSV files into a single unified dataset with automatic sorting and header alignment.
- **Intelligent Chart Summaries**: Generate 2-sentence AI summaries for every individual chart to understand specific data points.
- **Column Profiling**: Deep dive into your data's distribution, unique values, and statistical summaries.
- **Interactive Dashboards**: Draggable and resizable chart layouts for a personalized workspace.
- **Dark/Light Mode**: Premium design aesthetics tailored for both high-focus and easy-reading environments.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion, Shadcn UI
- **Visualization**: Recharts
- **Backend/Auth**: Supabase
- **AI Engine**: Google Gemini API (Flash & Pro)
- **Data Parsing**: PapaParse

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/vizi.git
   cd vizi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 📜 Terms and Conditions

For information regarding the usage of this platform, please refer to the [Terms and Conditions](http://localhost:8080/terms) page in the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

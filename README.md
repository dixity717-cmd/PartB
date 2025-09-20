# Meta MoM Performance Dashboard

A React-based dashboard for visualizing Meta (Facebook) campaign performance metrics month-over-month.  
**Made by Gagan Arora**

## Features

- Interactive filters for Month, Platform, and Campaign
- KPI summary cards (Spend, Impressions, Clicks, Leads, CTR, CPC, CPM, CVR)
- Charts for Spend, Clicks, and CTR by Month
- Detailed data table with export to CSV
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm

### Installation

1. Clone this repository or download the source code.
2. Install dependencies:

   ```bash
   npm install
   npm install recharts react-csv
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

- `src/App.js` - Main dashboard component
- `src/sampleData.json` - Sample campaign data (edit/add your own data)
- `src/App.css` - Styles for the dashboard

## Usage

- Use the dropdown filters to view data for specific months, platforms, or campaigns.
- View key metrics in summary cards.
- Explore visualizations in the charts section.
- Export filtered data to CSV using the "Export CSV" button.

## Customization

- To use your own data, edit `src/sampleData.json` with your campaign records.

## License

This project is for educational/demo purposes.

---

**Made by Gagan Arora**

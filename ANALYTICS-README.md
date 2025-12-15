# 📊 Utilo Analytics System

## Overview

Utilo now features a comprehensive analytics tracking system that monitors tool usage and search patterns to display **trending tools** based on actual user behavior.

## Features

### 🔥 Trending Tools Display
- **Dynamic Ranking**: Tools are ranked by a scoring algorithm that combines:
  - **Views**: Number of times a tool page was visited
  - **Searches**: Number of times the tool appeared in search results
  - **Recency**: Recent activity is weighted more heavily (7-day decay period)

### 📈 What's Tracked

1. **Tool Views**: Every time a user visits a tool page
2. **Search Queries**: Terms users search for on the homepage
3. **Search Matches**: Which tools matched each search query

### 🎯 Analytics Dashboard

Access the analytics dashboard at `/analytics` to view:
- Total tool views and searches
- Top trending tools with rankings
- Popular search terms
- Raw analytics data
- Export and clear analytics options

## How It Works

### Scoring Algorithm

```
baseScore = (views × 2) + searches
decayFactor = max(0.1, 1 - (daysSinceUse / 7) × 0.5)
finalScore = baseScore × decayFactor
```

- **Views are weighted 2x** more than searches (actual usage matters more)
- **Recency bonus**: Tools used recently get higher scores
- **Decay period**: After 7 days, scores gradually decrease

### Data Storage

- All analytics data is stored in **browser localStorage**
- Privacy-friendly: No server-side tracking
- User-specific: Each browser has its own analytics
- Persistent: Data survives page refreshes

### Automatic Tracking

**Tool Views** are tracked automatically when:
- A user navigates to any tool page
- Uses the `trackToolView(toolId, slug)` function

**Search Tracking** occurs when:
- A user searches for tools on the homepage
- Uses the `trackSearch(query, matchedSlugs)` function

## Usage

### For Users

1. **View Trending Tools**: The homepage displays trending tools in a dedicated section
2. **See Analytics**: Visit `/analytics` to see detailed statistics
3. **Privacy**: All data is local to your browser

### For Developers

#### Track a Tool View

```typescript
import { trackToolView } from '@/lib/analytics';

// When user visits a tool
trackToolView(toolId, slug);
```

#### Track a Search

```typescript
import { trackSearch } from '@/lib/analytics';

// When user searches with matches
const matchedSlugs = filteredTools.map(tool => tool.slug);
trackSearch(searchQuery, matchedSlugs);
```

#### Get Trending Tools

```typescript
import { getTrendingTools } from '@/lib/analytics';

// Get top 10 trending tools
const trending = getTrendingTools(10);
```

#### Get Popular Searches

```typescript
import { getPopularSearches } from '@/lib/analytics';

// Get top 10 search terms
const searches = getPopularSearches(10);
```

## API Reference

### `trackToolView(toolId: number, slug: string): void`
Records a tool page view.

### `trackSearch(query: string, matchedSlugs: string[]): void`
Records a search query and which tools matched.

### `getTrendingTools(limit?: number): ToolAnalytics[]`
Returns the top trending tools, sorted by score.

### `getToolAnalytics(slug: string): ToolAnalytics | null`
Gets analytics data for a specific tool.

### `getPopularSearches(limit?: number): Array<{term: string, count: number}>`
Returns the most popular search terms.

### `clearAnalytics(): void`
Clears all analytics data from localStorage.

### `exportAnalytics(): string`
Exports analytics data as JSON string.

## Data Structure

### ToolAnalytics
```typescript
interface ToolAnalytics {
  toolId: number;
  slug: string;
  views: number;
  searches: number;
  lastUsed: string;
  score: number;
}
```

### AnalyticsData
```typescript
interface AnalyticsData {
  tools: Record<string, ToolAnalytics>;
  searches: Record<string, number>;
  lastUpdated: string;
}
```

## Visual Indicators

### Homepage Trending Section
- 🔥 Fire emoji with "Trending Tools" heading
- Top 3 tools get special badges: "#1 HOT", "#2 HOT", "#3 HOT"
- View counts displayed on cards
- Search counts and scores shown
- Gradient "Try Now" buttons (orange to red)
- Hover effects with scale animation

### Analytics Dashboard
- 📊 Real-time statistics
- Numbered rankings with circular badges
- View and search icons with counts
- Export and clear functionality
- Raw data preview

## Future Enhancements

Possible improvements:
- Server-side analytics aggregation
- Time-based trending (daily, weekly, monthly)
- Category-specific trending
- User-specific recommendations
- A/B testing for tool placement
- Performance metrics (tool completion rates)

## Privacy & Data

- **No personal information** is collected
- **No external services** are used
- **Browser-local only**: Data never leaves the user's device
- **User control**: Users can clear analytics anytime
- **Transparent**: Raw data is viewable in the dashboard

## Testing the Feature

1. **Search for tools** on the homepage (e.g., "QR code", "password")
2. **Visit several tool pages** to generate view data
3. **Go to `/analytics`** to see the dashboard
4. **Check trending section** on homepage for updated rankings

## Notes

- Initial load shows default trending tools (marked in `tools-data.ts`)
- After user interaction, real analytics take over
- Scores update in real-time as users interact
- Best viewed after generating some usage data

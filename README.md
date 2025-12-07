# Expense Tracker

A React Native app built with Expo Router for tracking personal expenses. Features local storage, category filters, search, and charts.

## Features
- **Recent Expenses**: View expenses from the last 7 days.
- **All Expenses**: Browse all expenses with search and filters.
- **Add/Edit Expenses**: Modal form with category selection and date picker.
- **Local Storage**: Uses AsyncStorage for offline persistence.
- **Category Filters**: Filter by Food, Transport, Bills, Shopping, Subscriptions, Others.
- **Monthly Totals & Charts**: Pie chart for category breakdown.
- **Search**: Find expenses by title or notes.

## Setup
1. Install dependencies: `npm install`
2. Start the app: `npx expo start`
3. Run on device/simulator.

## Project Structure
- `app/`: Screens and layouts (Expo Router).
- `components/`: Reusable UI components.
- `hooks/`: Custom hooks (e.g., useExpenses).
- `utils/`: Storage helpers.
- `types/`: TypeScript interfaces.
- `constants/`: App constants (e.g., categories).

## Technologies
- React Native
- Expo Router
- AsyncStorage
- react-native-chart-kit
- TypeScript

## Future Enhancements
- SQLite for advanced storage.
- Export data to CSV.
- Dark mode toggle.
- Push notifications for reminders.
# ADA Accessibility Map

This application shows accessibility information for various locations in New York City.

## Setup

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Fill in your environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox access token

3. Run the development server:
```bash
npm run dev
```

The application will automatically create the necessary database table and sample data on first run.

## Features

- Interactive map showing accessibility information
- Color-coded markers indicating accessibility levels
- Detailed information popups for each location
- Filter and search capabilities (coming soon)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
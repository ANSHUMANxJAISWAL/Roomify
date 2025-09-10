# RoomiFy Frontend

A modern React frontend for the RoomiFy roommate management platform, built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Modern React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **React Router DOM** for client-side routing
- **React Query** for server state management
- **Axios** for HTTP requests with interceptors
- **React Hook Form** with Zod validation
- **Lucide React** for beautiful icons
- **Framer Motion** for smooth animations
- **React Hot Toast** for notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── ui/            # Basic UI components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   └── auth/          # Authentication pages
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=RoomiFy
```

### API Integration

The frontend communicates with the Spring Boot backend through the `apiService` in `src/services/api.ts`. The service includes:

- Automatic JWT token management
- Request/response interceptors
- Error handling
- Token refresh logic

### State Management

- **AuthContext**: Manages user authentication state
- **DashboardContext**: Manages dashboard data and state
- **React Query**: Handles server state and caching

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable component classes in `src/index.css`
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Key Components

### Layout Components

- **Layout**: Main layout wrapper with sidebar and header
- **Header**: Top navigation with search, notifications, and user menu
- **Sidebar**: Left navigation with main menu items
- **MobileNav**: Mobile-responsive navigation overlay

### Authentication

- **Login**: User login form
- **Register**: User registration form
- **AuthContext**: Authentication state management

### Dashboard

- **Dashboard**: Main dashboard with stats, recent activities, and quick actions
- **Stats Cards**: Overview of expenses, chores, reminders, and members
- **Recent Activities**: Latest user activities and updates

## API Endpoints

The frontend expects the following API structure from the backend:

- `/api/auth/*` - Authentication endpoints
- `/api/expenses/*` - Expense management
- `/api/chores/*` - Chore management
- `/api/reminders/*` - Reminder management
- `/api/households/*` - Household management
- `/api/dashboard/*` - Dashboard data
- `/api/notifications/*` - Notification management

## Deployment

### Build

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deployment Options

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your repository for automatic deployments
- **AWS S3**: Upload the `dist` folder to an S3 bucket
- **Traditional Hosting**: Upload files to your web server

### Environment Configuration

Ensure your production environment has the correct API base URL configured.

## Contributing

1. Follow the existing code style and structure
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test responsive design on mobile devices
5. Update documentation for new features

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change the port in `vite.config.ts`
2. **API connection**: Check the proxy configuration in `vite.config.ts`
3. **Build errors**: Ensure all dependencies are installed
4. **Type errors**: Run `npm run lint` to identify issues

### Development Tips

- Use React DevTools for debugging
- Check the browser console for API errors
- Use the Network tab to monitor API requests
- Test on different screen sizes for responsive design

## License

This project is part of the RoomiFy platform. See the main project README for license information.



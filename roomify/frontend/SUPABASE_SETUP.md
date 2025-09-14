# Supabase Integration Guide

This guide will help you set up Supabase for the Roomify application.

## Prerequisites

1. Node.js (v14 or later)
2. npm or yarn
3. A Supabase account (https://supabase.com/)

## Setup Instructions

### 1. Create a new Supabase project

1. Go to https://supabase.com/ and sign in or create an account
2. Click on "New Project"
3. Fill in your project details and database password
4. Wait for your new database to launch

### 2. Configure Environment Variables

1. Copy the `.env.example` file to a new file called `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and update the following variables with your Supabase project credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   You can find these values in your Supabase project settings:
   - Go to Project Settings > API
   - Copy the "URL" and "anon" public key

### 3. Install Dependencies

Make sure you have all the required dependencies installed:

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-react
```

### 4. Database Setup

1. In your Supabase dashboard, go to the SQL editor
2. Run the following SQL to set up the necessary tables and RLS (Row Level Security) policies:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Set up auth.users table
create table if not exists auth.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  username text unique,
  first_name text,
  last_name text,
  phone text,
  bio text,
  avatar_url text,
  roles text[] default '{user}',
  status text default 'active',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS on auth.users
alter table auth.users enable row level security;

-- Create a function to handle new user signups
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, username, first_name, last_name, roles, status)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    ARRAY['user']::text[],
    'active'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  first_name text,
  last_name text,
  phone text,
  bio text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using (true);

create policy "Users can insert their own profile."
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update
  using (auth.uid() = id);
```

### 5. Authentication Setup

1. In your Supabase dashboard, go to Authentication > URL Configuration
2. Add your application's URL to the "Site URL" field (e.g., http://localhost:3000)
3. Add http://localhost:3000/auth/callback to the "Redirect URLs"

### 6. Email Templates (Optional)

Customize the email templates in the Supabase dashboard under Authentication > Templates if needed.

## Available Authentication Methods

The following authentication methods are available out of the box:

- Email/Password
- Magic Link
- Social Logins (Google, GitHub, etc.)

## Usage

### Sign Up a New User

```typescript
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      username: 'johndoe',
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
```

### Sign In a User

```typescript
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Sign Out a User

```typescript
const { error } = await supabase.auth.signOut();
```

### Get the Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

## Security Considerations

1. Always use environment variables for sensitive information
2. Never expose your Supabase service role key in client-side code
3. Use Row Level Security (RLS) policies to secure your data
4. Regularly audit your authentication logs in the Supabase dashboard

## Troubleshooting

- If you're experiencing CORS issues, make sure to add your domain to the CORS settings in the Supabase dashboard
- Check the browser's developer console for any error messages
- Verify that your environment variables are correctly set in the `.env` file
- Make sure your Supabase project is running and accessible

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Reference](https://supabase.com/docs/reference/javascript/initializing)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

# Quickstart: Admin Panel Backend

## 1. Supabase Project Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Note your **Project URL** and **Anon Key**.
3. Create a `.env.local` in your root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Keep this private
   ```

## 2. Initialize Database Tables
Run the SQL from `specs/005-admin-panel-backend/data-model.md` in the Supabase SQL Editor:
- **Categories Table**: `CREATE TABLE categories (...)`
- **Products Table**: `CREATE TABLE products (...)`
- **Enable RLS**: `ALTER TABLE categories ENABLE ROW LEVEL SECURITY;`
- **Setup Policies**: `CREATE POLICY "Public Read" ON categories FOR SELECT USING (true);`

## 3. Storage Setup
1. Go to **Storage** in Supabase and create a bucket named `product-images`.
2. Set it to **Public**.
3. Add a policy under **Storage > product-images > Policies**:
   - **Action**: Select
   - **Target**: public
   - **Policy**: `true`
   - **Action**: Insert, Update, Delete
   - **Target**: authenticated
   - **Policy**: `auth.role() = 'authenticated'`

## 4. Admin Auth
1. Go to **Authentication > Users** and manually create your admin user.
2. Note the email and password for the dashboard login.

## 5. Development Connection
Run the following to generate TypeScript types (optional but recommended):
```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
```
Then start the dev server:
```bash
npm run dev
```
Navigate to `/admin/login` to begin managing your catalog.

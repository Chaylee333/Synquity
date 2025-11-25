# My Feed Page - Database Setup Guide

This guide explains the additional SQL queries and database policies needed to support the My Feed page functionality.

## 📋 Overview

The My Feed page requires access to the following database tables:

1. **`profiles`** - User profile information
2. **`posts`** - User's created posts
3. **`comments`** - User's comments on posts
4. **`creator_performance_metrics`** - Performance stats (P&L, Sharpe Ratio, etc.)
5. **`post_likes`** - Like counts on user's posts
6. **`comment_likes`** - Like counts on user's comments
7. **`follows`** - Follower/following relationships (future use)
8. **`saved_posts`** - Bookmarked posts (future use)

## 🔐 Row Level Security (RLS) Policies

The SQL file `supabase-myfeed-policies.sql` contains all necessary RLS policies to enable:

### ✅ What's Enabled:

1. **User Profile Access**
   - Users can view their own profile
   - Users can update their own profile

2. **Post Management**
   - Users can view their own posts
   - Users can create new posts
   - Users can update their own posts
   - Users can delete their own posts

3. **Comment Management**
   - Users can view their own comments
   - Users can create comments
   - Users can update their own comments
   - Users can delete their own comments

4. **Performance Metrics**
   - Users can view their own performance metrics
   - Users can update their own metrics
   - System can insert metrics (via service role)

5. **Engagement Tracking**
   - Users can view likes on their posts
   - Users can view likes on their comments
   - Proper counting for activity stats

6. **Social Features** (Future)
   - Users can save/unsave posts
   - Users can follow/unfollow other users
   - Users can view their follower/following lists

## 🚀 How to Run the SQL

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Create a new query
4. Copy the entire contents of `supabase-myfeed-policies.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Cmd/Ctrl + Enter`
7. You should see a success message

### Option 2: Command Line (if you have Supabase CLI)

```bash
supabase db push --file supabase-myfeed-policies.sql
```

## 📊 What Gets Created

### RLS Policies Created:

```
posts table:
  ✓ Users can view their own posts
  ✓ Users can insert their own posts
  ✓ Users can update their own posts
  ✓ Users can delete their own posts

comments table:
  ✓ Users can view their own comments
  ✓ Users can insert their own comments
  ✓ Users can update their own comments
  ✓ Users can delete their own comments

creator_performance_metrics table:
  ✓ Users can view their own performance metrics
  ✓ Users can insert their own performance metrics
  ✓ Users can update their own performance metrics

post_likes table:
  ✓ Users can view likes on their own posts

comment_likes table:
  ✓ Users can view likes on their own comments

profiles table:
  ✓ Users can view their own profile
  ✓ Users can update their own profile

saved_posts table:
  ✓ Users can view their saved posts
  ✓ Users can save posts
  ✓ Users can unsave posts

follows table:
  ✓ Users can view their followers and following
  ✓ Users can follow others
  ✓ Users can unfollow others

post_performance_tracking table:
  ✓ Users can view performance of their own posts
```

### Indexes Created (for performance):

```
✓ idx_posts_author_created - Fast lookup of user's posts by date
✓ idx_comments_author_created - Fast lookup of user's comments by date
✓ idx_post_likes_post_id - Fast counting of post likes
✓ idx_comment_likes_comment_id - Fast counting of comment likes
✓ idx_creator_metrics_user_id - Fast lookup of performance metrics
✓ idx_follows_follower - Fast follower queries
✓ idx_follows_following - Fast following queries
```

### Helper View Created:

**`user_feed_stats`** - A view that aggregates:
- Total posts count
- Total comments count
- Total likes on posts
- Total likes on comments

This view can be used for quick stats queries without counting manually.

## 🔍 Testing the Policies

After running the SQL, test that the My Feed page works correctly:

### 1. Create a Post
- Go to My Feed
- Fill out the post form
- Click "Post" button
- Verify the post appears in your feed below

### 2. View Your Stats
- Check that your post count increments
- Verify comments count shows correctly
- See if performance metrics display (if you ran the seed script)

### 3. Check Database Directly (Optional)

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check your profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Check your posts
SELECT * FROM posts WHERE author_id = auth.uid() ORDER BY created_at DESC;

-- Check your comments
SELECT * FROM comments WHERE author_id = auth.uid() ORDER BY created_at DESC;

-- Check your performance metrics
SELECT * FROM creator_performance_metrics WHERE user_id = auth.uid();

-- Count likes on your posts
SELECT p.id, p.title, COUNT(pl.user_id) as likes
FROM posts p
LEFT JOIN post_likes pl ON pl.post_id = p.id
WHERE p.author_id = auth.uid()
GROUP BY p.id, p.title;
```

## 🔒 Security Notes

### What These Policies Protect:

1. **User Isolation** - Users can only see/modify their own data
2. **Data Integrity** - Prevents unauthorized edits to other users' content
3. **Privacy** - Metrics and stats are only visible to the user themselves

### What's Still Open (by design):

1. **Public Posts** - Other policies (in `supabase-rls-policies.sql`) allow public viewing of posts
2. **Public Profiles** - Other users can view your profile (read-only)
3. **Public Metrics** - Performance metrics may be visible on Creators page

## 🆘 Troubleshooting

### Error: "Policy already exists"
- This is normal if you're re-running the script
- The script includes `DROP POLICY IF EXISTS` to handle this
- Just re-run the entire script

### Error: "Permission denied"
- Make sure you're logged in with your Supabase account
- Verify you have admin access to the database
- Use the service role key if running from scripts

### Posts/Comments Not Showing
1. Check browser console for errors
2. Verify you're logged in
3. Run the test queries above to check data exists
4. Ensure RLS is enabled: `ALTER TABLE posts ENABLE ROW LEVEL SECURITY;`

### Performance Metrics Not Showing
1. Run the seed script: `npm run seed:metrics`
2. Check the table: `SELECT * FROM creator_performance_metrics WHERE user_id = auth.uid();`
3. Verify the RLS policy is active

## 📈 Future Enhancements

These tables are ready for future features:

1. **Saved Posts** - Bookmark functionality
2. **Follows** - Follow other creators
3. **Post Performance** - Track how your stock picks performed
4. **User Settings** - Notification preferences

## ✅ Verification Checklist

After running the SQL, verify:

- [ ] Can view My Feed page without errors
- [ ] Can see profile information correctly
- [ ] Can see posts and comments counts
- [ ] Can create a new post successfully
- [ ] New post appears in feed immediately
- [ ] Performance metrics show (if seeded)
- [ ] No console errors in browser
- [ ] All database indexes created
- [ ] RLS policies are active

## 🎉 Done!

Once the SQL is run successfully, your My Feed page is fully backed by the database and secure! All user data is properly isolated and protected by Row Level Security policies.

For any issues, check the Supabase logs:
1. Go to Supabase Dashboard
2. Click **Database** → **Logs**
3. Look for any RLS policy errors


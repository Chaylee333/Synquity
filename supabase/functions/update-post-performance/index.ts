// Supabase Edge Function: update-post-performance
// This function updates the "Since posted" performance for all posts
// Schedule: Daily at 9 PM UTC (4 PM ET) on weekdays

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔄 Starting post performance update...')

    // Call the PostgreSQL function to update all post performances
    const { data, error } = await supabase.rpc('update_post_performance')

    if (error) {
      console.error('❌ Error updating post performance:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get count of updated posts for logging
    const { count } = await supabase
      .from('post_performance_tracking')
      .select('*', { count: 'exact', head: true })

    console.log(`✅ Post performance update completed. ${count} posts tracked.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Post performance updated successfully',
        postsTracked: count,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: err.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})


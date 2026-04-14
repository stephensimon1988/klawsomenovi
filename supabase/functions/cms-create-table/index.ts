import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESERVED_NAMES = new Set([
  'site_settings', 'store_hours', 'homepage_content', 'homepage_steps',
  'token_tiers', 'news_articles', 'birthdays_content', 'party_options',
  'faq_items', 'invite_templates', 'job_listings', 'business_sections',
  'business_pricing_tiers', 'business_how_steps', 'page_sections',
  'custom_blocks', 'section_content_blocks', 'cms_custom_tables',
]);

const TYPE_MAP: Record<string, string> = {
  text: "text NOT NULL DEFAULT ''",
  textarea: "text NOT NULL DEFAULT ''",
  number: 'numeric',
  bool: 'boolean NOT NULL DEFAULT false',
  array: "text[] NOT NULL DEFAULT '{}'",
  image_url: "text NOT NULL DEFAULT ''",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { password, table_name, label, columns } = body;

    // Auth
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    if (!adminPassword || password !== adminPassword) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // Validate table name
    if (!table_name || !/^[a-z][a-z0-9_]{1,58}$/.test(table_name)) {
      return json({ error: 'Table name must be lowercase letters, numbers, underscores. Start with a letter. 2-59 chars.' }, 400);
    }
    if (RESERVED_NAMES.has(table_name)) {
      return json({ error: 'That table name is reserved' }, 400);
    }

    // Validate columns
    if (!Array.isArray(columns) || columns.length === 0) {
      return json({ error: 'At least one column is required' }, 400);
    }
    for (const col of columns) {
      if (!col.key || !/^[a-z][a-z0-9_]*$/.test(col.key)) {
        return json({ error: `Invalid column name: ${col.key}` }, 400);
      }
      if (!TYPE_MAP[col.type]) {
        return json({ error: `Invalid type "${col.type}" for column "${col.key}"` }, 400);
      }
    }

    if (!label) {
      return json({ error: 'Label is required' }, 400);
    }

    // Build column definitions
    const colDefs = columns
      .map((col: { key: string; type: string }) => `"${col.key}" ${TYPE_MAP[col.type]}`)
      .join(', ');

    // Execute SQL via direct postgres connection
    const pgUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!pgUrl) {
      return json({ error: 'Database URL not configured' }, 500);
    }

    // Use the built-in Deno postgres driver
    const { Client } = await import("https://deno.land/x/postgres@v0.19.3/mod.ts");
    const client = new Client(pgUrl);
    await client.connect();

    try {
      // Create table
      await client.queryArray(
        `CREATE TABLE IF NOT EXISTS public."${table_name}" (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          sort_order integer NOT NULL DEFAULT 0,
          ${colDefs}
        )`
      );

      // Enable RLS
      await client.queryArray(
        `ALTER TABLE public."${table_name}" ENABLE ROW LEVEL SECURITY`
      );

      // Create read policy (ignore if exists)
      try {
        await client.queryArray(
          `CREATE POLICY "Public read ${table_name}" ON public."${table_name}" FOR SELECT TO public USING (true)`
        );
      } catch (_policyErr) {
        // Policy may already exist, that's fine
        console.log('Policy may already exist:', _policyErr);
      }
    } finally {
      await client.end();
    }

    // Register in cms_custom_tables via service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { error: insertErr } = await supabase
      .from('cms_custom_tables')
      .insert({
        table_name,
        label,
        columns: columns.map((c: any) => ({
          key: c.key,
          label: c.label || c.key,
          type: c.type,
          required: c.required || false,
        })),
      });

    if (insertErr) {
      return json({ error: insertErr.message }, 500);
    }

    return json({ success: true, table_name });
  } catch (e: any) {
    console.error('cms-create-table error:', e);
    return json({ error: e.message || 'Failed to create table' }, 500);
  }
});

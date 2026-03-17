import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface ProjectConfig {
  twitter_url: string;
  telegram_url: string;
  community_url: string;
  dexscreener_url: string;
  contract_address: string;
  buy_platform: string;
  chart_platform: string;
  title: string;
  description: string;
  connection_status: string;
}

export function useProjectConfig() {
  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
          .from('project_configs')
          .select('*, melly_projects!inner(slug)')
          .eq('melly_projects.slug', process.env.NEXT_PUBLIC_PROJECT_SLUG)
          .single();
        
        if (error) throw error;
        setConfig(data);
      } catch (err) {
        console.error("Error fetching config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  return { config, loading };
}

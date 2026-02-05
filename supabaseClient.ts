import { createClient } from '@supabase/supabase-js';

const PROJECT_URL = 'https://xrpsvleodzlydlcdxpdq.supabase.co';
const PROJECT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycHN2bGVvZHpseWRsY2R4cGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTM0MDUsImV4cCI6MjA4NTg4OTQwNX0.wk1CPfGNvKBjiwlFPfC7fQXOYI8LjCMYCRND0mv5_Us';

export const supabase = createClient(PROJECT_URL, PROJECT_KEY);

export const isConfigured = () => {
  return true; // Tenemos valores por defecto
};

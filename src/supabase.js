import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qlcfxifzusjobkhpgway.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2Z4aWZ6dXNqb2JraHBnd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyODAwNjMsImV4cCI6MjA1MTg1NjA2M30.BNMpou6EijySSsISAbHT6I7QxW29FQhwMG2l_rZL060";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rdaekinbqpaibncwimbg.supabase.co"; // finner du i Supabase-dashbordet
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYWVraW5icXBhaWJuY3dpbWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NTQ0MDksImV4cCI6MjA1NzQzMDQwOX0.Ebl8ZCtUl29kJaC9U9eBVaqJ2I7p7DhDO8yId958JqM"; // API-key fra Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
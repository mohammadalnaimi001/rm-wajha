-- =====================================================================
-- DEMO / SEED DATA — safe to run once after schema.sql.
-- These are example service catalog rows only. NO demo employees or
-- auth accounts are created here — employee accounts must always go
-- through Supabase Auth (see the "admin-users" Edge Function / README).
-- Feel free to edit prices/names before running, or skip this file
-- entirely and enter your real services from Admin > Settings instead.
-- =====================================================================

insert into public.services (name, category, description, price, active) values
  ('Website',            'Website',          'Marketing website or landing page', 150.00, true),
  ('Booking System',     'Booking',          'Online booking / reservation system', 75.00, true),
  ('SEO',                'SEO',              'Search engine optimization package', 100.00, true),
  ('Logo & Brand Kit',   'Digital Identity', 'Logo, colors, typography, brand guide', 120.00, true),
  ('Analytics Setup',    'Analytics',        'Tracking, dashboards, reporting setup', 90.00, true),
  ('AI Chatbot',         'AI',               'Custom AI chatbot integration', 200.00, true),
  ('Workflow Automation','Automation',       'Business process automation', 130.00, true),
  ('Mobile App (Basic)', 'Mobile',           'Cross-platform mobile app, basic scope', 350.00, true);
-- Re-running this file will insert duplicate rows (no unique constraint on
-- name by design, since two employees' quotations may reference services
-- with the same name over time). Run it once, or clear the table first.

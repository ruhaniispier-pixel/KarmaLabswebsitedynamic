KARMA LABS — DYNAMIC STEP 1

This is the current Karma Labs website with a Vercel backend added.

WHAT THIS VERSION DOES
- Keeps the current live website design.
- Form submits to /api/lead.
- /api/lead validates the enquiry.
- Enquiry is stored in the Supabase public.leads table.
- Includes a basic honeypot spam trap.
- Shows proper success/error messages.

VERCEL ENVIRONMENT VARIABLES REQUIRED
SUPABASE_URL
SUPABASE_SECRET_KEY

NEXT STEP AFTER DEPLOYMENT
1. Submit a test enquiry on the live website.
2. Open Supabase > Table Editor > leads.
3. Confirm the test enquiry appears.
4. After that, add email notifications.

-- Fix: lgpd_consents needs a unique constraint on (user_id, terms_version)
-- for the upsert in lgpd-actions.ts to work correctly.
-- Without this, the onConflict: 'user_id,terms_version' clause fails.

alter table jusflow.lgpd_consents
  add constraint lgpd_consents_user_version_uq
  unique (user_id, terms_version);

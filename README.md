# Fiel

Tarjetas de fidelidad digitales para negocios en Venezuela.

## Base de datos (Supabase)
- Proyecto: `fiel` (us-east-1)
- Tablas: profiles, stores, store_members, cards, stamps, rewards, payments, tickets, ticket_messages, ideas, audit_log, app_config
- Todas con seguridad por filas (RLS). Sellar y canjear solo con funciones seguras:
  `stamp_customers`, `check_reward`, `deliver_reward`.

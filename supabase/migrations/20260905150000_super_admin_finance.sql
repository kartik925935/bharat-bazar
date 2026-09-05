-- Migration for Super Admin Finance

CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    seller_name TEXT NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    orders_count INT DEFAULT 0,
    amount NUMERIC DEFAULT 0,
    commission NUMERIC DEFAULT 0,
    net_amount NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    base_rate NUMERIC NOT NULL,
    tier_multipliers JSONB NOT NULL DEFAULT '{"bronze": 1, "silver": 0.9, "gold": 0.8, "platinum": 0.7}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS finance_revenue_trend (
    date TEXT PRIMARY KEY,
    gmv NUMERIC DEFAULT 0,
    commission NUMERIC DEFAULT 0,
    refunds NUMERIC DEFAULT 0
);

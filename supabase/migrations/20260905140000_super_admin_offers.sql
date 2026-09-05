-- Migration for Super Admin Offers

CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL,
    applies_to TEXT NOT NULL,
    products_count INT DEFAULT 0,
    revenue_generated NUMERIC DEFAULT 0,
    orders_generated INT DEFAULT 0,
    discount_cost NUMERIC DEFAULT 0,
    roi NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

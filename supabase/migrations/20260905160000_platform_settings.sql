-- Migration to alter global platform settings table

-- Rename commission_rate if necessary (or drop and recreate)
ALTER TABLE platform_settings RENAME COLUMN commission_rate TO commission_rate_default;

ALTER TABLE platform_settings
    ADD COLUMN IF NOT EXISTS max_products_per_seller INT NOT NULL DEFAULT 1000,
    ADD COLUMN IF NOT EXISTS min_product_images INT NOT NULL DEFAULT 2,
    ADD COLUMN IF NOT EXISTS product_completeness_threshold INT NOT NULL DEFAULT 80,
    ADD COLUMN IF NOT EXISTS order_acceptance_sla_hours INT NOT NULL DEFAULT 24,
    ADD COLUMN IF NOT EXISTS dispatch_sla_hours INT NOT NULL DEFAULT 48,
    ADD COLUMN IF NOT EXISTS max_cod_order_value NUMERIC NOT NULL DEFAULT 5000,
    ADD COLUMN IF NOT EXISTS seller_auto_suspend_after_days INT NOT NULL DEFAULT 90,

    ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS maintenance_message TEXT NOT NULL DEFAULT 'The platform is undergoing scheduled maintenance.',
    ADD COLUMN IF NOT EXISTS maintenance_scheduled_end TIMESTAMPTZ,

    ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '{
        "googleOAuthEnabled": true,
        "codEnabled": true,
        "guestCheckoutEnabled": true,
        "reviewsEnabled": true,
        "wishlistEnabled": true,
        "sellerStoriesEnabled": true,
        "flashSaleEnabled": false,
        "referralProgramEnabled": false,
        "bulkImportEnabled": true
    }',

    ADD COLUMN IF NOT EXISTS notifications JSONB NOT NULL DEFAULT '{
        "sendEmailOnOrderConfirm": true,
        "sendEmailOnShipment": true,
        "sendEmailOnDelivery": true,
        "sendSmsOnDelivery": false,
        "sendSellerPayoutEmail": true
    }',

    ADD COLUMN IF NOT EXISTS terms_version TEXT NOT NULL DEFAULT 'v1.0',
    ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT NOT NULL DEFAULT 'v1.0';


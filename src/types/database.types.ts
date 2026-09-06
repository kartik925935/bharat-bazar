export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string | null
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string | null
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string | null
          phone?: string
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_activity_log: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action: string
          action_code: string
          actor_id: string
          actor_name: string
          actor_role: string
          category: string
          id: string
          ip_address: string | null
          metadata: Json | null
          severity: string
          target_entity_id: string | null
          target_entity_label: string | null
          target_entity_type: string | null
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          action: string
          action_code: string
          actor_id: string
          actor_name: string
          actor_role: string
          category: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity: string
          target_entity_id?: string | null
          target_entity_label?: string | null
          target_entity_type?: string | null
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          action_code?: string
          actor_id?: string
          actor_name?: string
          actor_role?: string
          category?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string
          target_entity_id?: string | null
          target_entity_label?: string | null
          target_entity_type?: string | null
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          after_state: Json | null
          before_state: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          ifsc_code: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          ifsc_code: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          ifsc_code?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          saved_for_later: boolean
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          saved_for_later?: boolean
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          saved_for_later?: boolean
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          max_fee_cap: number | null
          min_fee_cap: number | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          take_rate: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_fee_cap?: number | null
          min_fee_cap?: number | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          take_rate?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_fee_cap?: number | null
          min_fee_cap?: number | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          take_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          commission_amount: number
          commission_amount_paise: number | null
          commission_rate: number
          created_at: string
          id: string
          order_amount: number
          order_amount_paise: number | null
          order_item_id: string
          seller_id: string
          seller_net_amount: number
          seller_net_amount_paise: number | null
          settlement_status: string
        }
        Insert: {
          commission_amount: number
          commission_amount_paise?: number | null
          commission_rate: number
          created_at?: string
          id?: string
          order_amount: number
          order_amount_paise?: number | null
          order_item_id: string
          seller_id: string
          seller_net_amount: number
          seller_net_amount_paise?: number | null
          settlement_status?: string
        }
        Update: {
          commission_amount?: number
          commission_amount_paise?: number | null
          commission_rate?: number
          created_at?: string
          id?: string
          order_amount?: number
          order_amount_paise?: number | null
          order_item_id?: string
          seller_id?: string
          seller_net_amount?: number
          seller_net_amount_paise?: number | null
          settlement_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usages: {
        Row: {
          coupon_id: string
          id: string
          order_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          order_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          order_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usages_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          coupon_type: string
          created_at: string
          discount_type: string
          discount_value: number
          discount_value_paise: number | null
          id: string
          is_active: boolean
          max_discount_paise: number | null
          min_order_value: number
          min_order_value_paise: number | null
          seller_id: string | null
          usage_limit: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          code: string
          coupon_type: string
          created_at?: string
          discount_type: string
          discount_value: number
          discount_value_paise?: number | null
          id?: string
          is_active?: boolean
          max_discount_paise?: number | null
          min_order_value?: number
          min_order_value_paise?: number | null
          seller_id?: string | null
          usage_limit?: number | null
          valid_from?: string
          valid_until: string
        }
        Update: {
          code?: string
          coupon_type?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          discount_value_paise?: number | null
          id?: string
          is_active?: boolean
          max_discount_paise?: number | null
          min_order_value?: number
          min_order_value_paise?: number | null
          seller_id?: string | null
          usage_limit?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          created_at: string
          delivery_address: Json
          delivery_partner_id: string | null
          estimated_delivery_date: string | null
          id: string
          order_id: string
          pickup_address: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_address: Json
          delivery_partner_id?: string | null
          estimated_delivery_date?: string | null
          id?: string
          order_id: string
          pickup_address: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_address?: Json
          delivery_partner_id?: string | null
          estimated_delivery_date?: string | null
          id?: string
          order_id?: string
          pickup_address?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_delivery_partner_id_fkey"
            columns: ["delivery_partner_id"]
            isOneToOne: false
            referencedRelation: "delivery_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_partners: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          user_id: string
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          user_id: string
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_status_history: {
        Row: {
          created_at: string
          delivery_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          delivery_id: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          created_at?: string
          delivery_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_status_history_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_revenue_trend: {
        Row: {
          commission: number | null
          date: string
          gmv: number | null
          refunds: number | null
        }
        Insert: {
          commission?: number | null
          date: string
          gmv?: number | null
          refunds?: number | null
        }
        Update: {
          commission?: number | null
          date?: string
          gmv?: number | null
          refunds?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          low_stock_threshold: number
          product_id: string
          quantity_available: number
          quantity_reserved: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          id?: string
          low_stock_threshold?: number
          product_id: string
          quantity_available?: number
          quantity_reserved?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          id?: string
          low_stock_threshold?: number
          product_id?: string
          quantity_available?: number
          quantity_reserved?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          discount_value_paise: number | null
          id: string
          is_active: boolean
          title: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          discount_value_paise?: number | null
          id?: string
          is_active?: boolean
          title: string
          valid_from?: string
          valid_until: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          discount_value_paise?: number | null
          id?: string
          is_active?: boolean
          title?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          commission_rate: number | null
          created_at: string
          id: string
          image_url: string | null
          item_status: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          seller_id: string
          seller_name: string | null
          sku: string | null
          subtotal: number
          subtotal_paise: number | null
          unit_price: number
          unit_price_paise: number | null
          variant_id: string | null
          variant_label: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          item_status?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          seller_id: string
          seller_name?: string | null
          sku?: string | null
          subtotal: number
          subtotal_paise?: number | null
          unit_price: number
          unit_price_paise?: number | null
          variant_id?: string | null
          variant_label?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          image_url?: string | null
          item_status?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          seller_id?: string
          seller_name?: string | null
          sku?: string | null
          subtotal?: number
          subtotal_paise?: number | null
          unit_price?: number
          unit_price_paise?: number | null
          variant_id?: string | null
          variant_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string
          delivery_charge: number
          delivery_charge_paise: number | null
          discount_amount: number
          discount_amount_paise: number | null
          id: string
          order_number: string
          shipping_address: Json
          status: string
          subtotal: number
          subtotal_paise: number | null
          total_amount: number
          total_amount_paise: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          delivery_charge?: number
          delivery_charge_paise?: number | null
          discount_amount?: number
          discount_amount_paise?: number | null
          id?: string
          order_number: string
          shipping_address: Json
          status?: string
          subtotal: number
          subtotal_paise?: number | null
          total_amount: number
          total_amount_paise?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          delivery_charge?: number
          delivery_charge_paise?: number | null
          discount_amount?: number
          discount_amount_paise?: number | null
          id?: string
          order_number?: string
          shipping_address?: Json
          status?: string
          subtotal?: number
          subtotal_paise?: number | null
          total_amount?: number
          total_amount_paise?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          key_hash: string
          last_used_at: string | null
          name: string
          revoked_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          last_used_at?: string | null
          name: string
          revoked_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          amount_paise: number | null
          created_at: string
          currency: string
          gateway: string
          gateway_signature: string | null
          id: string
          idempotency_key: string | null
          order_id: string
          raw_webhook_payload: Json | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          webhook_verified: boolean
        }
        Insert: {
          amount: number
          amount_paise?: number | null
          created_at?: string
          currency?: string
          gateway?: string
          gateway_signature?: string | null
          id?: string
          idempotency_key?: string | null
          order_id: string
          raw_webhook_payload?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          webhook_verified?: boolean
        }
        Update: {
          amount?: number
          amount_paise?: number | null
          created_at?: string
          currency?: string
          gateway?: string
          gateway_signature?: string | null
          id?: string
          idempotency_key?: string | null
          order_id?: string
          raw_webhook_payload?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          webhook_verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          auto_approve_products: boolean | null
          auto_approve_sellers: boolean | null
          cod_enabled: boolean | null
          commission_rate_default: number
          dispatch_sla_hours: number
          features: Json
          id: number
          maintenance_message: string
          maintenance_mode: boolean | null
          maintenance_scheduled_end: string | null
          max_cod_order_value: number
          max_products_per_seller: number | null
          min_product_images: number
          min_settlement_amount: number
          notifications: Json
          order_acceptance_sla_hours: number
          privacy_policy_version: string
          product_completeness_threshold: number
          razorpay_enabled: boolean | null
          return_window_days: number
          seller_auto_suspend_after_days: number
          seller_registration_fee: number
          settlement_cycle_days: number
          terms_version: string
          updated_at: string
          updated_by: string | null
          upi_enabled: boolean | null
        }
        Insert: {
          auto_approve_products?: boolean | null
          auto_approve_sellers?: boolean | null
          cod_enabled?: boolean | null
          commission_rate_default?: number
          dispatch_sla_hours?: number
          features?: Json
          id?: number
          maintenance_message?: string
          maintenance_mode?: boolean | null
          maintenance_scheduled_end?: string | null
          max_cod_order_value?: number
          max_products_per_seller?: number | null
          min_product_images?: number
          min_settlement_amount?: number
          notifications?: Json
          order_acceptance_sla_hours?: number
          privacy_policy_version?: string
          product_completeness_threshold?: number
          razorpay_enabled?: boolean | null
          return_window_days?: number
          seller_auto_suspend_after_days?: number
          seller_registration_fee?: number
          settlement_cycle_days?: number
          terms_version?: string
          updated_at?: string
          updated_by?: string | null
          upi_enabled?: boolean | null
        }
        Update: {
          auto_approve_products?: boolean | null
          auto_approve_sellers?: boolean | null
          cod_enabled?: boolean | null
          commission_rate_default?: number
          dispatch_sla_hours?: number
          features?: Json
          id?: number
          maintenance_message?: string
          maintenance_mode?: boolean | null
          maintenance_scheduled_end?: string | null
          max_cod_order_value?: number
          max_products_per_seller?: number | null
          min_product_images?: number
          min_settlement_amount?: number
          notifications?: Json
          order_acceptance_sla_hours?: number
          privacy_policy_version?: string
          product_completeness_threshold?: number
          razorpay_enabled?: boolean | null
          return_window_days?: number
          seller_auto_suspend_after_days?: number
          seller_registration_fee?: number
          settlement_cycle_days?: number
          terms_version?: string
          updated_at?: string
          updated_by?: string | null
          upi_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          display_order: number
          id: string
          image_url: string
          is_primary: boolean
          product_id: string
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_primary?: boolean
          product_id: string
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_primary?: boolean
          product_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          compare_at_price_paise: number | null
          id: string
          is_default: boolean
          label: string | null
          price_adjustment: number
          price_paise: number
          product_id: string
          sku: string | null
          stock_quantity: number
          variant_name: string
          variant_value: string
        }
        Insert: {
          compare_at_price_paise?: number | null
          id?: string
          is_default?: boolean
          label?: string | null
          price_adjustment?: number
          price_paise?: number
          product_id: string
          sku?: string | null
          stock_quantity?: number
          variant_name: string
          variant_value: string
        }
        Update: {
          compare_at_price_paise?: number | null
          id?: string
          is_default?: boolean
          label?: string | null
          price_adjustment?: number
          price_paise?: number
          product_id?: string
          sku?: string | null
          stock_quantity?: number
          variant_name?: string
          variant_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          completeness_score: number
          created_at: string
          description: string | null
          dimensions: Json | null
          featured_by_admin: boolean
          free_shipping: boolean
          gi_tagged: boolean
          handmade: boolean
          id: string
          mrp: number
          name: string
          rating: number
          rejection_notes: string | null
          review_count: number
          search_vector: unknown
          seller_id: string
          selling_price: number
          shop_id: string
          sku: string | null
          slug: string
          specifications: Json
          status: string
          stock_quantity: number
          story: string | null
          tags: string[]
          updated_at: string
          views: number
          weight: number | null
          wishlist_count: number
        }
        Insert: {
          category_id?: string | null
          completeness_score?: number
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          featured_by_admin?: boolean
          free_shipping?: boolean
          gi_tagged?: boolean
          handmade?: boolean
          id?: string
          mrp: number
          name: string
          rating?: number
          rejection_notes?: string | null
          review_count?: number
          search_vector?: unknown
          seller_id: string
          selling_price: number
          shop_id: string
          sku?: string | null
          slug: string
          specifications?: Json
          status?: string
          stock_quantity?: number
          story?: string | null
          tags?: string[]
          updated_at?: string
          views?: number
          weight?: number | null
          wishlist_count?: number
        }
        Update: {
          category_id?: string | null
          completeness_score?: number
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          featured_by_admin?: boolean
          free_shipping?: boolean
          gi_tagged?: boolean
          handmade?: boolean
          id?: string
          mrp?: number
          name?: string
          rating?: number
          rejection_notes?: string | null
          review_count?: number
          search_vector?: unknown
          seller_id?: string
          selling_price?: number
          shop_id?: string
          sku?: string | null
          slug?: string
          specifications?: Json
          status?: string
          stock_quantity?: number
          story?: string | null
          tags?: string[]
          updated_at?: string
          views?: number
          weight?: number | null
          wishlist_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          status: Database["public"]["Enums"]["account_status"]
          two_fa_enabled: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          two_fa_enabled?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          two_fa_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          amount_paise: number | null
          created_at: string
          gateway_refund_id: string | null
          id: string
          order_id: string
          payment_id: string
          razorpay_refund_id: string | null
          reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          amount_paise?: number | null
          created_at?: string
          gateway_refund_id?: string | null
          id?: string
          order_id: string
          payment_id: string
          razorpay_refund_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          amount_paise?: number | null
          created_at?: string
          gateway_refund_id?: string | null
          id?: string
          order_id?: string
          payment_id?: string
          razorpay_refund_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          description: string | null
          evidence_photo_url: string
          id: string
          order_item_id: string
          reason: string
          refund_amount_paise: number | null
          refund_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          evidence_photo_url: string
          id?: string
          order_item_id: string
          reason: string
          refund_amount_paise?: number | null
          refund_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          evidence_photo_url?: string
          id?: string
          order_item_id?: string
          reason?: string
          refund_amount_paise?: number | null
          refund_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_refund_id_fkey"
            columns: ["refund_id"]
            isOneToOne: false
            referencedRelation: "refunds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          review_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          review_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          is_approved: boolean
          moderation_status: Database["public"]["Enums"]["review_status"]
          order_item_id: string
          product_id: string
          rating: number
          review_text: string | null
          title: string | null
          user_id: string
          verified_purchase_item_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_approved?: boolean
          moderation_status?: Database["public"]["Enums"]["review_status"]
          order_item_id: string
          product_id: string
          rating: number
          review_text?: string | null
          title?: string | null
          user_id: string
          verified_purchase_item_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_approved?: boolean
          moderation_status?: Database["public"]["Enums"]["review_status"]
          order_item_id?: string
          product_id?: string
          rating?: number
          review_text?: string | null
          title?: string | null
          user_id?: string
          verified_purchase_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_verified_purchase_item_id_fkey"
            columns: ["verified_purchase_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: number
          role_id: number
        }
        Insert: {
          permission_id: number
          role_id: number
        }
        Update: {
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          is_system_role: boolean
          level: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          is_system_role?: boolean
          level: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          is_system_role?: boolean
          level?: number
          name?: string
        }
        Relationships: []
      }
      seller_documents: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string
          file_url: string | null
          id: string
          seller_id: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type: string
          file_url?: string | null
          id?: string
          seller_id: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string
          file_url?: string | null
          id?: string
          seller_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "seller_documents_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_performance: {
        Row: {
          avg_rating: number
          calculated_at: string
          cancellation_rate: number
          id: string
          on_time_dispatch_rate: number
          performance_score: number
          return_rate: number
          seller_id: string
          total_sales: number
        }
        Insert: {
          avg_rating?: number
          calculated_at?: string
          cancellation_rate?: number
          id?: string
          on_time_dispatch_rate?: number
          performance_score?: number
          return_rate?: number
          seller_id: string
          total_sales?: number
        }
        Update: {
          avg_rating?: number
          calculated_at?: string
          cancellation_rate?: number
          id?: string
          on_time_dispatch_rate?: number
          performance_score?: number
          return_rate?: number
          seller_id?: string
          total_sales?: number
        }
        Relationships: [
          {
            foreignKeyName: "seller_performance_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          created_at: string
          current_tier: string
          description: string | null
          display_name: string
          district: string | null
          id: string
          kyc_status: string
          legal_name: string
          password_hash: string | null
          reapply_after: string | null
          registration_fee_paid: boolean
          registration_fee_waived: boolean
          rejected_at: string | null
          seller_id: string
          seller_type: string
          state: string | null
          updated_at: string
          user_id: string
          username: string
          village: string | null
        }
        Insert: {
          created_at?: string
          current_tier?: string
          description?: string | null
          display_name: string
          district?: string | null
          id?: string
          kyc_status?: string
          legal_name: string
          password_hash?: string | null
          reapply_after?: string | null
          registration_fee_paid?: boolean
          registration_fee_waived?: boolean
          rejected_at?: string | null
          seller_id: string
          seller_type: string
          state?: string | null
          updated_at?: string
          user_id: string
          username: string
          village?: string | null
        }
        Update: {
          created_at?: string
          current_tier?: string
          description?: string | null
          display_name?: string
          district?: string | null
          id?: string
          kyc_status?: string
          legal_name?: string
          password_hash?: string | null
          reapply_after?: string | null
          registration_fee_paid?: boolean
          registration_fee_waived?: boolean
          rejected_at?: string | null
          seller_id?: string
          seller_type?: string
          state?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sellers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          seller_id: string
          status: string
          total_amount: number
          total_amount_paise: number | null
          transaction_ref: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          seller_id: string
          status?: string
          total_amount: number
          total_amount_paise?: number | null
          transaction_ref?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          seller_id?: string
          status?: string
          total_amount?: number
          total_amount_paise?: number | null
          transaction_ref?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          banner_url: string | null
          business_location: string | null
          created_at: string
          id: string
          logo_url: string | null
          seller_id: string
          shop_name: string
          shop_slug: string
          shop_story: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          business_location?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          seller_id: string
          shop_name: string
          shop_slug: string
          shop_story?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          business_location?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          seller_id?: string
          shop_name?: string
          shop_slug?: string
          shop_story?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shops_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_delivery_partner_id: { Args: never; Returns: string }
      current_seller_id: { Args: never; Returns: string }
      get_dashboard_stats: { Args: never; Returns: Json }
      get_sales_analytics: { Args: { days_back: number }; Returns: Json }
      has_role: { Args: { role_name: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_delivery_partner: { Args: never; Returns: boolean }
      is_seller: { Args: never; Returns: boolean }
      owns_cart: { Args: { cart_uuid: string }; Returns: boolean }
      owns_delivery: { Args: { delivery_uuid: string }; Returns: boolean }
      owns_order: { Args: { order_uuid: string }; Returns: boolean }
      owns_product: { Args: { product_uuid: string }; Returns: boolean }
      owns_seller_order: { Args: { order_uuid: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      account_status: "active" | "suspended" | "blocked"
      order_status:
        | "pending_payment"
        | "confirmed"
        | "processing"
        | "packed"
        | "shipped"
        | "in_transit"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "returned"
        | "refunded"
      payment_status:
        | "created"
        | "authorized"
        | "captured"
        | "failed"
        | "refunded"
        | "partially_refunded"
      product_status:
        | "draft"
        | "pending_review"
        | "active"
        | "changes_required"
        | "rejected"
        | "delisted"
        | "archived"
      return_reason:
        | "defective"
        | "wrong_item"
        | "not_as_described"
        | "size_issue"
        | "quality_issue"
        | "other"
      return_status:
        | "requested"
        | "under_review"
        | "approved"
        | "rejected"
        | "pickup_scheduled"
        | "picked_up"
        | "received"
        | "refunded"
      review_status: "pending" | "published" | "removed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "suspended", "blocked"],
      order_status: [
        "pending_payment",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      payment_status: [
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      product_status: [
        "draft",
        "pending_review",
        "active",
        "changes_required",
        "rejected",
        "delisted",
        "archived",
      ],
      return_reason: [
        "defective",
        "wrong_item",
        "not_as_described",
        "size_issue",
        "quality_issue",
        "other",
      ],
      return_status: [
        "requested",
        "under_review",
        "approved",
        "rejected",
        "pickup_scheduled",
        "picked_up",
        "received",
        "refunded",
      ],
      review_status: ["pending", "published", "removed"],
    },
  },
} as const

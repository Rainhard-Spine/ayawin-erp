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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string
          check_out: string | null
          company_id: string
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          check_in: string
          check_out?: string | null
          company_id: string
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          check_in?: string
          check_out?: string | null
          company_id?: string
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          company_id: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          company_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          company_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          deal_id: string | null
          id: string
          notes: string
          subject: string | null
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deal_id?: string | null
          id?: string
          notes: string
          subject?: string | null
          type?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          deal_id?: string | null
          id?: string
          notes?: string
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          default_currency: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          subscription_plan: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          default_currency?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          default_currency?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_default_currency_fkey"
            columns: ["default_currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      currencies: {
        Row: {
          code: string
          exchange_rate: number
          is_active: boolean
          name: string
          symbol: string
          updated_at: string
        }
        Insert: {
          code: string
          exchange_rate?: number
          is_active?: boolean
          name: string
          symbol: string
          updated_at?: string
        }
        Update: {
          code?: string
          exchange_rate?: number
          is_active?: boolean
          name?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          company_id: string
          company_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          company_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          actual_close_date: string | null
          company_id: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          expected_close_date: string | null
          id: string
          notes: string | null
          probability: number | null
          stage: string
          status: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          actual_close_date?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          stage?: string
          status?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          actual_close_date?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          probability?: number | null
          stage?: string
          status?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_queue: {
        Row: {
          attempts: number
          body: string
          company_id: string
          created_at: string
          error_message: string | null
          id: string
          max_attempts: number
          scheduled_for: string
          sent_at: string | null
          status: string
          subject: string
          template_data: Json | null
          template_name: string | null
          to_email: string
        }
        Insert: {
          attempts?: number
          body: string
          company_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          subject: string
          template_data?: Json | null
          template_name?: string | null
          to_email: string
        }
        Update: {
          attempts?: number
          body?: string
          company_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_data?: Json | null
          template_name?: string | null
          to_email?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          avatar_url: string | null
          company_id: string
          created_at: string
          department: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_number: string
          employment_status: string
          full_name: string
          hire_date: string
          id: string
          phone: string | null
          position: string
          salary: number
          salary_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          company_id: string
          created_at?: string
          department?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_number: string
          employment_status?: string
          full_name: string
          hire_date: string
          id?: string
          phone?: string | null
          position: string
          salary?: number
          salary_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          department?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_number?: string
          employment_status?: string
          full_name?: string
          hire_date?: string
          id?: string
          phone?: string | null
          position?: string
          salary?: number
          salary_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          company_id: string
          created_at: string
          created_by: string | null
          currency_code: string | null
          description: string | null
          expense_date: string
          id: string
          notes: string | null
          payment_method: string
          receipt_url: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          company_id: string
          created_at?: string
          created_by?: string | null
          currency_code?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method: string
          receipt_url?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          currency_code?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string
          receipt_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      export_logs: {
        Row: {
          company_id: string
          created_at: string
          export_type: string
          file_url: string | null
          id: string
          status: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          export_type: string
          file_url?: string | null
          id?: string
          status?: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          export_type?: string
          file_url?: string | null
          id?: string
          status?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_id: string
          created_at: string
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      module_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          created_at: string
          id: string
          module: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          module: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          module?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      notifications: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          priority: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          priority?: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          priority?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          basic_salary: number
          bonuses: number
          company_id: string
          created_at: string
          deductions: number
          employee_id: string
          id: string
          net_salary: number
          notes: string | null
          pay_period_end: string
          pay_period_start: string
          payment_date: string | null
          payment_status: string
          updated_at: string
        }
        Insert: {
          basic_salary?: number
          bonuses?: number
          company_id: string
          created_at?: string
          deductions?: number
          employee_id: string
          id?: string
          net_salary?: number
          notes?: string | null
          pay_period_end: string
          pay_period_start: string
          payment_date?: string | null
          payment_status?: string
          updated_at?: string
        }
        Update: {
          basic_salary?: number
          bonuses?: number
          company_id?: string
          created_at?: string
          deductions?: number
          employee_id?: string
          id?: string
          net_salary?: number
          notes?: string | null
          pay_period_end?: string
          pay_period_start?: string
          payment_date?: string | null
          payment_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category: string | null
          company_id: string
          cost: number | null
          created_at: string
          currency_code: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_stock_level: number | null
          name: string
          price: number
          quantity: number
          sku: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          company_id: string
          cost?: number | null
          created_at?: string
          currency_code?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock_level?: number | null
          name: string
          price?: number
          quantity?: number
          sku: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category?: string | null
          company_id?: string
          cost?: number | null
          created_at?: string
          currency_code?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock_level?: number | null
          name?: string
          price?: number
          quantity?: number
          sku?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email_notifications: boolean
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email_notifications?: boolean
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email_notifications?: boolean
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          po_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          po_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          po_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery: string | null
          company_id: string
          created_at: string
          created_by: string | null
          expected_delivery: string | null
          id: string
          notes: string | null
          order_date: string
          po_number: string
          status: string
          subtotal: number
          supplier_id: string
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number: string
          status?: string
          subtotal?: number
          supplier_id: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          po_number?: string
          status?: string
          subtotal?: number
          supplier_id?: string
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          sale_id: string
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          sale_id: string
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          product_sku?: string
          quantity?: number
          sale_id?: string
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          currency_code: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount: number
          id: string
          notes: string | null
          payment_method: string
          payment_status: string
          sale_number: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          currency_code?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount?: number
          id?: string
          notes?: string | null
          payment_method: string
          payment_status?: string
          sale_number: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          currency_code?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount?: number
          id?: string
          notes?: string | null
          payment_method?: string
          payment_status?: string
          sale_number?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_currency_code_fkey"
            columns: ["currency_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      saved_reports: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          filters: Json
          id: string
          is_active: boolean
          last_generated_at: string | null
          name: string
          report_type: string
          schedule: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          filters?: Json
          id?: string
          is_active?: boolean
          last_generated_at?: string | null
          name: string
          report_type: string
          schedule?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          filters?: Json
          id?: string
          is_active?: boolean
          last_generated_at?: string | null
          name?: string
          report_type?: string
          schedule?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          company_id: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_id: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["app_role"]
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_po_number: { Args: { company_uuid: string }; Returns: string }
      generate_sale_number: { Args: { company_uuid: string }; Returns: string }
      get_user_company: { Args: { _user_id: string }; Returns: string }
      has_module_permission: {
        Args: { _module: string; _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "company_admin" | "manager" | "cashier" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["super_admin", "company_admin", "manager", "cashier", "user"],
    },
  },
} as const

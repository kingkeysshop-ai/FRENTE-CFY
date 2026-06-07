// Temporary shims to keep project on Medusa v1 types
// These provide minimal `any`-based definitions so TypeScript won't error
// while the codebase uses v1 `Store*` types and a custom `client.fetch`.

declare module "@medusajs/types" {
  // Augment the HttpTypes namespace with v1 Store* interfaces used across the app.
  // Keep them permissive (any) to avoid blocking compilation; replace with concrete
  // typings when upgrading or auditing types.
  export namespace HttpTypes {
    interface StoreRegion {
      [key: string]: any
    }

    interface StoreCollection {
      [key: string]: any
    }

    interface StoreCart {
      [key: string]: any
    }

    interface StoreCartResponse {
      cart: StoreCart
    }

    interface StoreUpdateCart {
      [key: string]: any
    }

    interface StoreInitializePaymentSession {
      [key: string]: any
    }

    interface StoreCustomer {
      [key: string]: any
    }

    interface StoreCartShippingOption {
      [key: string]: any
    }

    interface StorePrice {
      [key: string]: any
    }

    interface StoreOrder {
      [key: string]: any
    }

    interface StoreProduct {
      [key: string]: any
    }

    interface StoreProductCategory {
      [key: string]: any
    }

    interface StoreProductCategoryListResponse {
      product_categories: StoreProductCategory[]
    }

    interface FindParams {
      [key: string]: any
    }

    interface StoreProductListParams {
      [key: string]: any
    }

    interface StoreProductParams {
      [key: string]: any
    }
  }

    // Also augment internal dist/http module paths in case TypeScript resolves
    // `@medusajs/types` to internal files under `dist/http`.
    declare module "@medusajs/types/dist/http" {
      export namespace HttpTypes {
        interface StoreRegion { [key: string]: any }
        interface StoreCollection { [key: string]: any }
        interface StoreCart { [key: string]: any }
        interface StoreCustomer { [key: string]: any }
        interface StoreCartShippingOption { [key: string]: any }
        interface StorePrice { [key: string]: any }
        interface StoreOrder { [key: string]: any }
        interface StoreProduct { [key: string]: any }
        interface StoreProductCategory { [key: string]: any }
      }
    }

    declare module "@medusajs/types/dist/http/index" {
      export namespace HttpTypes {
        interface StoreRegion { [key: string]: any }
        interface StoreCollection { [key: string]: any }
        interface StoreCart { [key: string]: any }
        interface StoreCustomer { [key: string]: any }
        interface StoreCartShippingOption { [key: string]: any }
        interface StorePrice { [key: string]: any }
        interface StoreOrder { [key: string]: any }
        interface StoreProduct { [key: string]: any }
        interface StoreProductCategory { [key: string]: any }
      }
    }
}

// Extend medusa-js Client to include the custom `fetch` added at runtime
declare module "@medusajs/medusa-js" {
  interface Client {
    fetch<T = any>(input: string, init?: any): Promise<T>
  }

  interface Medusa {
    store: any
  }
}

export {}

// Provide a global HttpTypes namespace fallback so files that reference
// `HttpTypes.StoreRegion` (without importing) compile correctly.
declare global {
  namespace HttpTypes {
    interface StoreRegion { [key: string]: any }
    interface StoreCollection { [key: string]: any }
    interface StoreCart { [key: string]: any }
    interface StoreCustomer { [key: string]: any }
    interface StoreCartShippingOption { [key: string]: any }
    interface StorePrice { [key: string]: any }
    interface StoreOrder { [key: string]: any }
    interface StoreProduct { [key: string]: any }
    interface StoreProductCategory { [key: string]: any }
  }
}

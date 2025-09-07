// lib/vendure/queries.ts

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      totalItems
      items {
        id
        name
        slug
        featuredAsset {
          preview
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
      items {
        productId
        productName
        slug
        productAsset {
          preview
        }
        priceWithTax {
          ... on SinglePrice {
            value
          }
          ... on PriceRange {
            min
            max
          }
        }
        currencyCode
      }
    }
  }
`;

export const GET_COLLECTIONS = /* GraphQL */ `
  query GetCollections {
    collections {
      items {
        id
        name
        slug
      }
    }
  }
`;

export const GET_FACETS = /* GraphQL */ `
  query GetFacets {
    facets {
      items {
        id
        name
        code
        values {
          id
          name
          code
        }
      }
      totalItems
    }
  }
`;

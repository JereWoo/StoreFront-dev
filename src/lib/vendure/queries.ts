// lib/vendure/queries.ts

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
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

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const API_URL = "https://fakestoreapi.com";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getSearchSuggestions = async (
  query: string
): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) return [];

    // Get matches from title, category, and description
    return products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5); // Limit to 5 suggestions
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    return [];
  }
};

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  thumbnail: string;
  images: string[];
  stock: number;
  rating: number;
  discountPercentage: number;
  tags?: string[];
}

const API_URL = "https://dummyjson.com";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.products;
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
    console.log("Fetching products for category:", category);
    const response = await fetch(
      `${API_URL}/products/category/${category.toLowerCase()}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${category}`);
    }
    const data = await response.json();
    console.log("Category products response:", data);

    if (!data.products || !Array.isArray(data.products)) {
      console.error("Invalid products response:", data);
      return [];
    }

    return data.products;
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
    const data = await response.json();

    // Extract category names from the response
    if (Array.isArray(data)) {
      return data
        .map((category) => {
          if (typeof category === "string") return category;
          if (typeof category === "object" && category !== null) {
            return category.name || category.value || category.id || "";
          }
          return "";
        })
        .filter(Boolean);
    }

    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/search?q=${query}`);
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getSearchSuggestions = async (
  query: string
): Promise<Product[]> => {
  try {
    if (!query.trim()) return [];

    const response = await fetch(
      `${API_URL}/products/search?q=${query}&limit=5`
    );
    if (!response.ok) {
      throw new Error("Failed to get search suggestions");
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    return [];
  }
};

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  fetchProducts,
  searchProducts,
  Product,
  fetchProductsByCategory,
} from "../services/api";
import ProductFilters from "../components/ProductFilters";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const location = useLocation();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const minPrice = Number(searchParams.get("minPrice")) || priceRange.min;
    const maxPrice = Number(searchParams.get("maxPrice")) || priceRange.max;
    const sort = searchParams.get("sort") || "default";

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (query) {
          data = await searchProducts(query);
        } else if (category && category !== "all") {
          data = await fetchProductsByCategory(category);
        } else {
          data = await fetchProducts();
        }

        if (!Array.isArray(data)) {
          setProducts([]);
          return;
        }

        if (data.length === 0) {
          setProducts([]);
          return;
        }

        // Calculate price range from all products before filtering
        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const newPriceRange = {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
          };
          setPriceRange(newPriceRange);

          // Only apply price filter if it's explicitly set in the URL
          if (searchParams.has("minPrice") || searchParams.has("maxPrice")) {
            data = data.filter(
              (product) =>
                product.price >= minPrice && product.price <= maxPrice
            );
          }
        }

        // Apply sorting
        switch (sort) {
          case "price_asc":
            data.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            data.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            data.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // Keep original order
            break;
        }

        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [location.search]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main content - Product Grid */}
        <Grid item xs={12} md={9}>
          {location.search && (
            <Typography variant="h6" gutterBottom>
              {products.length} Results{" "}
              {new URLSearchParams(location.search).get("q") &&
                `for "${new URLSearchParams(location.search).get("q")}"`}
            </Typography>
          )}

          {products.length === 0 ? (
            <Alert severity="info">
              No products found matching your criteria.
            </Alert>
          ) : (
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    {product.discountPercentage > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: "error.main",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          zIndex: 1,
                        }}
                      >
                        -{Math.round(product.discountPercentage)}% OFF
                      </Box>
                    )}
                    <CardMedia
                      component="img"
                      sx={{
                        pt: "56.25%",
                        objectFit: "contain",
                        bgcolor: "white",
                      }}
                      image={product.thumbnail}
                      alt={product.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {product.brand}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        noWrap
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          mb: 2,
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Box>
                          {product.discountPercentage > 0 ? (
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                ${product.price.toFixed(2)}
                              </Typography>
                              <Typography variant="h6" color="error.main">
                                $
                                {(
                                  product.price *
                                  (1 - product.discountPercentage / 100)
                                ).toFixed(2)}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" color="primary">
                              ${product.price.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating
                            value={product.rating}
                            precision={0.1}
                            size="small"
                            readOnly
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={
                            product.stock > 0 ? "success.main" : "error.main"
                          }
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <ProductFilters
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;

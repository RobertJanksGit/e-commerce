import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
  Snackbar,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useCart, CartItem } from "../context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  rating: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      description: product.description,
    };
    addItem(cartItem);
    setOpenSnackbar(true);
  };

  // Temporary sample products for development
  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 99.99,
      description: "High-quality wireless headphones with noise cancellation",
      imageUrl: "https://via.placeholder.com/200",
      rating: 4.5,
    },
    {
      id: "2",
      name: "Smartphone",
      price: 699.99,
      description: "Latest model smartphone with advanced features",
      imageUrl: "https://via.placeholder.com/200",
      rating: 4.8,
    },
    // Add more sample products as needed
  ];

  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {(products.length > 0 ? products : sampleProducts).map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                sx={{ height: 200, objectFit: "contain", p: 2 }}
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Rating value={product.rating} precision={0.5} readOnly />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Item added to cart"
      />
    </Container>
  );
};

export default Home;

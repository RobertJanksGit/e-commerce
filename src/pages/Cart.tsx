import { useCart } from "../context/CartContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Box,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (items.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Your cart is empty
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={isMobile ? 4 : 3}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: "100%",
                        height: isMobile ? 80 : 100,
                        objectFit: "contain",
                      }}
                      image={item.image}
                      alt={item.title}
                    />
                  </Grid>
                  <Grid item xs={isMobile ? 8 : 5}>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      gutterBottom
                      sx={{
                        fontSize: isMobile ? "0.9rem" : undefined,
                        mb: isMobile ? 0.5 : 1,
                      }}
                    >
                      {item.title}
                    </Typography>
                    {!isMobile && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ mt: isMobile ? 1 : 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isMobile ? "flex-start" : "center",
                      }}
                    >
                      <IconButton
                        size={isMobile ? "small" : "medium"}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <RemoveIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton
                        size={isMobile ? "small" : "medium"}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isMobile ? "space-between" : "center",
                        mt: isMobile ? 1 : 0,
                      }}
                    >
                      <Typography
                        variant={isMobile ? "subtitle2" : "subtitle1"}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                        size={isMobile ? "small" : "medium"}
                      >
                        <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1">Subtotal</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">
                      ${getTotal().toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6">Total</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      ${getTotal().toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                onClick={() => {
                  // TODO: Implement checkout
                  alert("Checkout functionality coming soon!");
                }}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;

import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    getCartTotal,
  } = useCart();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        {cartItems.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item, index) => (
                <Box key={item.id}>
                  <ListItem>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ width: 50, height: 50, marginRight: 16 }}
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={`$${item.price.toFixed(2)}`}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => removeItem(item.id)}
                        sx={{ ml: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            <Box sx={{ mt: 4, p: 2, bgcolor: "background.default" }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Total: ${getCartTotal().toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => {
                  // Implement checkout logic
                  alert("Checkout functionality coming soon!");
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Cart;

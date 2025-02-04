import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
} from "@mui/material";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <Typography variant="h6" component="div">
            Amazon Clone
          </Typography>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <>
              <Typography variant="body1">
                Hello, {user.email?.split("@")[0]}
              </Typography>
              <Link to="/cart" style={{ color: "white" }}>
                <IconButton color="inherit">
                  <Badge badgeContent={getItemCount()} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

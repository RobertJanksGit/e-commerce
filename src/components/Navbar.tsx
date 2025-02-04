import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getSearchSuggestions, Product } from "../services/api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  CircularProgress,
  Box,
  alpha,
  Autocomplete,
  TextField,
  Paper,
} from "@mui/material";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const results = await getSearchSuggestions(searchQuery);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (product?: Product | null) => {
    if (product) {
      setSearchQuery(product.title);
      navigate(`/?q=${encodeURIComponent(product.title)}`);
    } else if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <CircularProgress color="inherit" size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <Typography variant="h6" component="div" sx={{ flexShrink: 0 }}>
            E-Commerce
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1, maxWidth: 600, mx: 2 }}>
          <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title
            }
            loading={loadingSuggestions}
            filterOptions={(x) => x}
            value={searchQuery}
            onChange={(_, value) => handleSearch(value as Product)}
            onInputChange={(_, value) => setSearchQuery(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder="Search products..."
                sx={{
                  bgcolor: alpha("#fff", 0.15),
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingSuggestions ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <IconButton
                          onClick={() => handleSearch()}
                          sx={{ color: "inherit" }}
                        >
                          <SearchIcon />
                        </IconButton>
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Paper
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                }}
              >
                <img
                  src={option.image}
                  alt={option.title}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                  }}
                />
                <Box>
                  <Typography variant="body1" noWrap>
                    {option.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {option.category} - ${option.price}
                  </Typography>
                </Box>
              </Paper>
            )}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
          {user ? (
            <>
              <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

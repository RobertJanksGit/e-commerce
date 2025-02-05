import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getSearchSuggestions, Product } from "../services/api";
import { getUserProfile, type UserProfile } from "../services/userProfile";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
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
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };
    loadUserProfile();
  }, [user]);

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
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMobileMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        {user ? (
          <>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={userProfile?.photoURL}
                sx={{ width: 40, height: 40 }}
              >
                {userProfile?.displayName?.[0]?.toUpperCase() ||
                  user.email?.[0].toUpperCase()}
              </Avatar>
              <Typography noWrap>
                {userProfile?.displayName || user.email?.split("@")[0]}
              </Typography>
            </Box>
            <Divider />
            <List>
              <ListItem
                button
                onClick={() => handleMobileMenuClick("/profile")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={() => handleMobileMenuClick("/cart")}>
                <ListItemIcon>
                  <Badge badgeContent={getItemCount()} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Cart" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
        ) : (
          <List>
            <ListItem button onClick={() => handleMobileMenuClick("/login")}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => handleMobileMenuClick("/signup")}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );

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
      <Toolbar sx={{ gap: { xs: 1, md: 2 } }}>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexShrink: 0,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            E-Commerce
          </Typography>
        </Link>

        <Box
          sx={{
            flexGrow: 1,
            maxWidth: { sm: "100%", md: 600 },
            mx: { xs: 0, md: 2 },
            order: { xs: 3, md: 2 },
            width: { xs: "100%", md: "auto" },
          }}
        >
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            ml: "auto",
            order: { xs: 2, md: 3 },
          }}
        >
          {isMobile ? (
            <>
              {user && (
                <Link to="/cart" style={{ color: "white" }}>
                  <IconButton color="inherit" size="small">
                    <Badge badgeContent={getItemCount()} color="secondary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Link>
              )}
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                size="small"
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Avatar
                      src={userProfile?.photoURL}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "secondary.main",
                        fontSize: "1rem",
                      }}
                    >
                      {userProfile?.displayName?.[0]?.toUpperCase() ||
                        user.email?.[0].toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "nowrap",
                        display: { xs: "none", lg: "block" },
                      }}
                    >
                      {userProfile?.displayName || user.email?.split("@")[0]}
                    </Typography>
                  </Link>
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
            </>
          )}
        </Box>
      </Toolbar>
      {mobileMenu}
    </AppBar>
  );
};

export default Navbar;

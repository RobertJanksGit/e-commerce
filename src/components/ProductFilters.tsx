import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCategories } from "../services/api";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  TextField,
  SelectChangeEvent,
} from "@mui/material";

interface ProductFiltersProps {
  minPrice: number;
  maxPrice: number;
}

const ProductFilters = ({ minPrice, maxPrice }: ProductFiltersProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<string[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get("category") || "all";

  const [filters, setFilters] = useState({
    category: "all", // Start with "all" and update after categories load
    priceRange: [
      Number(searchParams.get("minPrice")) || minPrice,
      Number(searchParams.get("maxPrice")) || maxPrice,
    ],
    sort: searchParams.get("sort") || "default",
  });

  // Separate state for the price slider to prevent constant URL updates
  const [sliderValue, setSliderValue] = useState<number[]>(filters.priceRange);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        // Filter out empty or invalid categories
        const validCategories = data.filter(
          (category) =>
            category && typeof category === "string" && category.trim() !== ""
        );
        setCategories(validCategories);

        // Only set the category from URL if it exists in the fetched categories
        if (
          initialCategory !== "all" &&
          validCategories.includes(initialCategory)
        ) {
          setFilters((prev) => ({
            ...prev,
            category: initialCategory,
          }));
        }
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, [initialCategory]);

  // Update slider value when filters change (e.g., from URL)
  useEffect(() => {
    setSliderValue(filters.priceRange);
  }, [filters.priceRange]);

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(location.search);

    if (newFilters.category && newFilters.category !== "all") {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    if (newFilters.priceRange[0] !== minPrice) {
      params.set("minPrice", newFilters.priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }

    if (newFilters.priceRange[1] !== maxPrice) {
      params.set("maxPrice", newFilters.priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }

    if (newFilters.sort !== "default") {
      params.set("sort", newFilters.sort);
    } else {
      params.delete("sort");
    }

    navigate({ search: params.toString() });
  };

  const formatCategoryForDisplay = (category: string): string => {
    if (!category || category === "all") return "All Categories";
    return category; // Categories from API are already properly formatted
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const selectedCategory = event.target.value;
    const newFilters = {
      ...filters,
      category: selectedCategory,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  // Handle real-time slider updates without updating URL
  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number[]);
  };

  // Update URL only when the user finishes dragging
  const handlePriceChangeCommitted = (
    _: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    const newFilters = {
      ...filters,
      priceRange: newValue as number[],
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const newFilters = {
      ...filters,
      sort: event.target.value,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={categories.length > 0 ? filters.category : "all"}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem key="all" value="all">
              All Categories
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {formatCategoryForDisplay(category)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sort}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Best Rating</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={sliderValue}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceChangeCommitted}
            valueLabelDisplay="auto"
            min={minPrice}
            max={maxPrice}
            step={1}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Min"
              value={sliderValue[0]}
              InputProps={{
                readOnly: true,
                startAdornment: <Typography>$</Typography>,
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Max"
              value={sliderValue[1]}
              InputProps={{
                readOnly: true,
                startAdornment: <Typography>$</Typography>,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductFilters;

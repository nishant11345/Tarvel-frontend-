import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Grid, Card, CardContent, CardMedia, Typography, MenuItem, Select, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import './App.css'; // Custom CSS for background and other styling

const App = () => {
  const [city, setCity] = useState('');
  const [destinations, setDestinations] = useState([]);
  console.log(destinations);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const cardsPerPage = 21;

  const fetchDestinations = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/destinations?keyword=${city}`);
      const data = response.data;

      const uniqueCategories = [...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories);
      setDestinations(data);
      setTotalPages(Math.ceil(data.length / cardsPerPage));
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
    setLoading(false);
  };

  const filteredDestinations = selectedCategory
    ? destinations.filter((destination) => destination.category === selectedCategory)
    : destinations;

  const paginatedDestinations = filteredDestinations.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="app-background">
      <Box className="hero-container">
        <Typography variant="h2" align="center" className="hero-headline">
          YOUR PERFECT TRIP
        </Typography>
        <Typography variant="h6" align="center" className="hero-subtitle">
          Explore the world with a tool that recommends the perfect Destination for you.
        </Typography>
      </Box>

      <Container sx={{ marginTop: '-50px' }}>  {/* Adjusted positioning for the search input */}
        <Box className="search-box">
          <TextField
            label="Enter city name"
            variant="outlined"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchDestinations()}
            sx={{
              marginBottom: '20px',
              background: 'white',
              borderRadius: '4px',
              '&:hover .MuiOutlinedInput-root': {
                borderColor: 'black', // Change the border color on hover
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                borderColor: 'black', // Change the border color when focused
              },
            }}
          />

          <FormControl fullWidth sx={{ marginBottom: '20px', background: 'white', borderRadius: '4px' }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={fetchDestinations}
            sx={{ marginBottom: '30px' }}
          >
            SEARCH
          </Button>
        </Box>

        <Grid container spacing={4}>
          {loading ? (
            <Box display="flex" justifyContent="center" width="100%" marginTop="20px">
              <CircularProgress />
            </Box>
          ) : (
            paginatedDestinations.map((destination) => (
              <Grid item key={destination.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    maxWidth: 345,
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.image || 'https://www.newdelhiairport.in/media/2160/top-travel-destinations-to-visit-before-turning-40.jpg'}
                    alt={destination.name}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {destination.name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {destination.category || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latitude: {destination.geoCode.latitude}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Longitude: {destination.geoCode.longitude}
                    </Typography>
                    {destination.rating && (
                      <Typography variant="body2" color="text.secondary">
                        Rating: {destination.rating}
                      </Typography>
                    )}
                    {destination.description && (
                      <Typography variant="body2" color="text.secondary">
                        {destination.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        />
      </Container>
    </div>
  );
};

export default App;

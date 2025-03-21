import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const TripForm = () => {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.current_location || !formData.pickup_location || !formData.dropoff_location || !formData.current_cycle_used) {
      setSnackbarMessage('Please fill out all fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/trips/', formData);
      console.log('Trip created:', response.data);

      // Show success message
      setSnackbarMessage('Trip created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Redirect to the map page after a short delay
      setTimeout(() => {
        navigate('/map');
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.error('Error creating trip:', error);

      // Show error message
      setSnackbarMessage('Failed to create trip. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Trip Details</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Location"
          value={formData.current_location}
          onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Pickup Location"
          value={formData.pickup_location}
          onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Dropoff Location"
          value={formData.dropoff_location}
          onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Current Cycle Used (Hrs)"
          value={formData.current_cycle_used}
          onChange={(e) => setFormData({ ...formData, current_cycle_used: e.target.value })}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Submit
        </Button>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TripForm;
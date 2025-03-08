import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Grid, Card, CardContent, 
  List, ListItem, ListItemText, Divider, Button, 
  CircularProgress, Box, Chip
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';

const FoodOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    averagePreparationTime: 0
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: '1',
          teamName: 'Engineering',
          food: ['Burger', 'Fries', 'Soda'],
          price: 25.99,
          timestamp: new Date(Date.now() - 15 * 60000),
          status: 'pending'
        },
        {
          id: '2',
          teamName: 'Marketing',
          food: ['Pizza', 'Garlic Bread', 'Salad'],
          price: 32.50,
          timestamp: new Date(Date.now() - 30 * 60000),
          status: 'preparing'
        },
        {
          id: '3',
          teamName: 'HR',
          food: ['Pasta', 'Breadsticks'],
          price: 18.75,
          timestamp: new Date(Date.now() - 5 * 60000),
          status: 'pending'
        }
      ];
      
      setOrders(mockOrders);
      setStats({
        totalOrders: mockOrders.length,
        pendingOrders: mockOrders.filter(order => order.status === 'pending').length,
        averagePreparationTime: 22 // minutes
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getWaitingTime = (timestamp) => {
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    return diffInMinutes;
  };

  const markAsDelivered = (id) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        return {...order, status: 'delivered'};
      }
      return order;
    }));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingOrders: prev.pendingOrders - 1
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading food orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Food Orders Dashboard
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h3">{stats.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff8e1' }}>
            <Typography variant="h6">Pending Orders</Typography>
            <Typography variant="h3">{stats.pendingOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6">Avg. Preparation Time</Typography>
            <Typography variant="h3">{stats.averagePreparationTime} min</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Orders List */}
      <Typography variant="h5" component="h2" gutterBottom>
        Current Orders
      </Typography>
      
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card 
              elevation={3} 
              sx={{ 
                mb: 2, 
                border: order.status === 'pending' ? '2px solid #ff9800' : 'none',
                position: 'relative'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <GroupIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{order.teamName}</Typography>
                  </Box>
                  <Chip 
                    label={order.status.toUpperCase()} 
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>
                
                <List dense>
                  {order.food.map((item, index) => (
                    <ListItem key={index}>
                      <FastfoodIcon fontSize="small" sx={{ mr: 1 }} />
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    ${order.price.toFixed(2)}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      Waiting: {getWaitingTime(order.timestamp)} min
                    </Typography>
                  </Box>
                </Box>
                
                {order.status !== 'delivered' && (
                  <Button 
                    variant="contained" 
                    color="success" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => markAsDelivered(order.id)}
                  >
                    Mark as Delivered
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {orders.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography variant="h6">No orders found</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default FoodOrders;

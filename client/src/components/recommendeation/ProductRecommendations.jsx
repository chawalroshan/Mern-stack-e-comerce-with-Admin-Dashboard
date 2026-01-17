import React, { useEffect } from 'react';
import { useProductRecommendations } from '../../hooks/useRecommendations';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, Chip, Rating } from '@mui/material';
import { ShoppingCart, Favorite, Visibility } from '@mui/icons-material';

const ProductRecommendations = ({ productId, currentProduct }) => {
    const { similarProducts, frequentlyBought, loading } = useProductRecommendations(productId);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="mt-12">
            {/* Similar Products Section */}
            {similarProducts.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Similar Products
                        </h2>
                        <Chip 
                            label="Based on category & tags" 
                            color="primary" 
                            size="small" 
                        />
                    </div>
                    
                    <Grid container spacing={3}>
                        {similarProducts.slice(0, 4).map((product) => (
                            <Grid item xs={12} sm={6} md={3} key={product._id}>
                                <Link to={`/product/${product._id}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                        <div className="relative">
                                            <img 
                                                src={product.images?.[0] || '/placeholder.jpg'} 
                                                alt={product.name}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            {product.rating && (
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                                    <Rating value={product.rating} size="small" readOnly />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent>
                                            <Typography variant="h6" className="font-semibold truncate">
                                                {product.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" className="mb-2">
                                                {product.category?.name || 'Uncategorized'}
                                            </Typography>
                                            <div className="flex items-center justify-between">
                                                <Typography variant="h6" color="primary" className="font-bold">
                                                    Rs. {product.price?.toFixed(2)}
                                                </Typography>
                                                {product.stock > 0 ? (
                                                    <Chip label="In Stock" size="small" color="success" />
                                                ) : (
                                                    <Chip label="Out of Stock" size="small" color="error" />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}

            {/* Frequently Bought Together Section */}
            {frequentlyBought.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Frequently Bought Together
                        </h2>
                        <Chip 
                            label="Based on purchase patterns" 
                            color="secondary" 
                            size="small" 
                        />
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                        <div className="flex items-center mb-6">
                            <div className="flex-1">
                                <Typography variant="h6" className="font-bold text-gray-800">
                                    Complete Your Purchase
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Customers who bought {currentProduct?.name} also bought these items
                                </Typography>
                            </div>
                            <Box className="bg-white px-4 py-2 rounded-lg shadow">
                                <Typography variant="h6" className="font-bold text-green-600">
                                    Save up to 15%
                                </Typography>
                            </Box>
                        </div>

                        <Grid container spacing={3}>
                            {frequentlyBought.slice(0, 3).map((product, index) => (
                                <Grid item xs={12} md={4} key={product._id}>
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                        <div className="relative">
                                            <img 
                                                src={product.images?.[0] || '/placeholder.jpg'} 
                                                alt={product.name}
                                                className="w-full h-40 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <CardContent>
                                            <Typography variant="subtitle1" className="font-semibold truncate">
                                                {product.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" className="mb-2">
                                                +Rs. {product.price?.toFixed(2)}
                                            </Typography>
                                            <div className="flex items-center justify-between">
                                                <Link 
                                                    to={`/product/${product._id}`}
                                                    className="text-primary hover:underline text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                                <Chip 
                                                    icon={<ShoppingCart fontSize="small" />}
                                                    label="Add to Cart"
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    clickable
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <div className="mt-6 text-center">
                            <Typography variant="body2" color="text.secondary">
                                Buy all together and save on shipping!
                            </Typography>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductRecommendations;
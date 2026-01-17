import React, { useEffect } from 'react';
import { useRecommendations } from '../../hooks/useRecommendations';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, Chip, Button } from '@mui/material';
import { TrendingUp, LocalFireDepartment, History, Star } from '@mui/icons-material';

const PersonalizedRecommendations = ({ userId, title = "Recommended For You" }) => {
    const { recommendations, loading, error, refetch } = useRecommendations(userId);

    useEffect(() => {
        // Track page view for recommendations
        const trackRecommendationView = () => {
            // You can implement analytics tracking here
        };
        trackRecommendationView();
    }, []);

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Typography align="center" className="mt-4 text-gray-600">
                    Finding personalized recommendations for you...
                </Typography>
            </div>
        );
    }

    if (error) {
        return (
            <Box className="text-center py-8">
                <Typography color="error" className="mb-4">{error}</Typography>
                <Button variant="outlined" onClick={refetch}>
                    Try Again
                </Button>
            </Box>
        );
    }

    if (recommendations.length === 0) {
        return (
            <Box className="text-center py-8">
                <LocalFireDepartment className="text-4xl text-gray-400 mb-4 mx-auto" />
                <Typography variant="h6" className="text-gray-600 mb-2">
                    No recommendations yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start browsing products to get personalized recommendations!
                </Typography>
            </Box>
        );
    }

    return (
        <div className="py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                        {title}
                    </Typography>
                    <div className="flex items-center space-x-4">
                        <Chip 
                            icon={<TrendingUp />}
                            label="Personalized"
                            color="primary"
                            size="small"
                        />
                        <Chip 
                            icon={<History />}
                            label="Based on your activity"
                            variant="outlined"
                            size="small"
                        />
                    </div>
                </div>
                <Button 
                    variant="outlined" 
                    onClick={refetch}
                    startIcon={<Star />}
                >
                    Refresh
                </Button>
            </div>

            {/* Recommendation Cards */}
            <Grid container spacing={3}>
                {recommendations.slice(0, 8).map((product, index) => (
                    <Grid item xs={12} sm={6} md={3} key={product._id}>
                        <Link to={`/product/${product._id}`}>
                            <Card className="h-full group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Badge for top recommendations */}
                                {index < 3 && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <Chip 
                                            label={`#${index + 1}`}
                                            color={index === 0 ? 'error' : index === 1 ? 'warning' : 'info'}
                                            size="small"
                                        />
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={product.images?.[0] || '/placeholder.jpg'} 
                                        alt={product.name}
                                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    {/* Similarity Score Indicator */}
                                    {product.similarityScore && (
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                            {Math.round(product.similarityScore * 100)}% match
                                        </div>
                                    )}
                                </div>

                                <CardContent>
                                    {/* Product Info */}
                                    <Typography variant="h6" className="font-semibold truncate mb-1">
                                        {product.name}
                                    </Typography>
                                    
                                    {/* Match Reason */}
                                    {product.matchReason && (
                                        <Typography variant="caption" color="text.secondary" className="block mb-2">
                                            {product.matchReason}
                                        </Typography>
                                    )}

                                    {/* Category & Tags */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {product.category?.name && (
                                            <Chip 
                                                label={product.category.name}
                                                size="small"
                                                variant="outlined"
                                            />
                                        )}
                                        {product.tags?.slice(0, 2).map(tag => (
                                            <Chip 
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        ))}
                                    </div>

                                    {/* Price & Rating */}
                                    <div className="flex items-center justify-between">
                                        <Typography variant="h6" color="primary" className="font-bold">
                                            Rs. {product.price?.toFixed(2)}
                                        </Typography>
                                        {product.rating && (
                                            <div className="flex items-center">
                                                <Star className="text-yellow-500 text-sm" />
                                                <Typography variant="body2" className="ml-1">
                                                    {product.rating.toFixed(1)}
                                                </Typography>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stock Status */}
                                    <div className="mt-2">
                                        {product.stock > 0 ? (
                                            <Typography variant="caption" color="success.main">
                                                ✓ In Stock ({product.stock} available)
                                            </Typography>
                                        ) : (
                                            <Typography variant="caption" color="error">
                                                ✗ Out of Stock
                                            </Typography>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            {/* View All Link */}
            <div className="text-center mt-8">
                <Link 
                    to="/recommendations" 
                    className="inline-flex items-center text-primary hover:underline font-medium"
                >
                    View All Recommendations
                    <TrendingUp className="ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default PersonalizedRecommendations;
import ProductModel from '../models/product.model.js';
import RecommendationModel from '../models/recommendation.model.js';
import OrderModel from '../models/order.model.js';

// Track user interaction
export const trackUserInteraction = async (userId, productId, interactionType) => {
    try {
        const scoreMap = {
            'view': 1,
            'wishlist': 3,
            'add_to_cart': 5,
            'purchase': 10
        };

        const interaction = new RecommendationModel({
            userId,
            productId,
            interactionType,
            interactionScore: scoreMap[interactionType] || 1
        });

        await interaction.save();
        return { success: true, message: 'Interaction tracked' };
    } catch (error) {
        console.error('Error tracking interaction:', error);
        return { success: false, error: error.message };
    }
};

// Get user's interaction history
const getUserInteractionHistory = async (userId, limit = 50) => {
    try {
        const interactions = await RecommendationModel.find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('productId', 'name category tags price images')
            .lean();

        return interactions;
    } catch (error) {
        console.error('Error fetching interaction history:', error);
        return [];
    }
};

// Calculate Jaccard Similarity between two products
const calculateJaccardSimilarity = (product1, product2) => {
    const tags1 = new Set(product1.tags || []);
    const tags2 = new Set(product2.tags || []);
    
    // Add category to tags for better similarity
    if (product1.category) tags1.add(product1.category.toString());
    if (product2.category) tags2.add(product2.category.toString());

    const intersection = new Set([...tags1].filter(x => tags2.has(x)));
    const union = new Set([...tags1, ...tags2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
};

// Content-Based Filtering using Jaccard Similarity
const getContentBasedRecommendations = async (productIds, userId, limit = 10) => {
    try {
        // Get products user has interacted with
        const userProducts = await ProductModel.find({
            _id: { $in: productIds }
        }).select('tags category attributes priceRange');

        if (userProducts.length === 0) {
            return await getPopularProducts(limit);
        }

        // Get all products except those user already interacted with
        const allProducts = await ProductModel.find({
            _id: { $nin: productIds },
            status: 'active'
        }).select('name tags category price images rating stock');

        // Calculate similarity scores
        const recommendations = allProducts.map(product => {
            let totalSimilarity = 0;
            let maxSimilarity = 0;

            userProducts.forEach(userProduct => {
                const similarity = calculateJaccardSimilarity(userProduct, product);
                totalSimilarity += similarity;
                maxSimilarity = Math.max(maxSimilarity, similarity);
            });

            const avgSimilarity = totalSimilarity / userProducts.length;
            
            return {
                product,
                similarityScore: avgSimilarity * 0.7 + maxSimilarity * 0.3, // Weighted score
                matchReason: getMatchReason(userProducts[0], product)
            };
        });

        // Sort by similarity score and get top recommendations
        return recommendations
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, limit)
            .map(rec => ({
                ...rec.product.toObject(),
                similarityScore: rec.similarityScore,
                matchReason: rec.matchReason
            }));

    } catch (error) {
        console.error('Error in content-based filtering:', error);
        return [];
    }
};

// Hybrid Recommendation System
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 10, type = 'hybrid' } = req.query;

        // Get user's recent interactions
        const interactions = await getUserInteractionHistory(userId, 20);
        const productIds = [...new Set(interactions.map(i => i.productId._id))];

        let recommendations = [];

        if (type === 'content' || productIds.length === 0) {
            // Content-based filtering
            recommendations = await getContentBasedRecommendations(productIds, userId, limit);
        } else if (type === 'collaborative') {
            // Collaborative filtering (simplified)
            recommendations = await getCollaborativeRecommendations(userId, limit);
        } else {
            // Hybrid approach
            const [contentRecs, popularRecs] = await Promise.all([
                getContentBasedRecommendations(productIds, userId, Math.floor(limit * 0.7)),
                getPopularProducts(Math.floor(limit * 0.3))
            ]);
            recommendations = [...contentRecs, ...popularRecs];
        }

        // Remove duplicates
        const uniqueRecs = Array.from(new Map(
            recommendations.map(item => [item._id.toString(), item])
        ).values());

        res.status(200).json({
            success: true,
            count: uniqueRecs.length,
            recommendations: uniqueRecs.slice(0, limit)
        });

    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations'
        });
    }
};

// Get popular products (fallback)
const getPopularProducts = async (limit = 10) => {
    try {
        return await ProductModel.find({ status: 'active', stock: { $gt: 0 } })
            .sort({ rating: -1, salesCount: -1 })
            .limit(limit)
            .select('name price images rating category tags')
            .lean();
    } catch (error) {
        console.error('Error fetching popular products:', error);
        return [];
    }
};

// Simplified collaborative filtering
const getCollaborativeRecommendations = async (userId, limit = 10) => {
    try {
        // Find users with similar purchase history
        const userOrders = await OrderModel.find({ userId })
            .select('items')
            .lean();

        const userProductIds = userOrders.flatMap(order => 
            order.items.map(item => item.product.toString())
        );

        // Find other users who bought similar products
        const similarUsers = await OrderModel.aggregate([
            {
                $match: {
                    userId: { $ne: userId },
                    'items.product': { $in: userProductIds }
                }
            },
            {
                $group: {
                    _id: '$userId',
                    commonProducts: { $sum: 1 },
                    purchasedProducts: { $addToSet: '$items.product' }
                }
            },
            { $sort: { commonProducts: -1 } },
            { $limit: 5 }
        ]);

        // Get products from similar users
        const recommendedProductIds = similarUsers.flatMap(user => 
            user.purchasedProducts.flat()
        ).filter(id => !userProductIds.includes(id.toString()));

        const uniqueProductIds = [...new Set(recommendedProductIds)];

        return await ProductModel.find({
            _id: { $in: uniqueProductIds },
            status: 'active'
        })
        .limit(limit)
        .select('name price images rating category')
        .lean();

    } catch (error) {
        console.error('Error in collaborative filtering:', error);
        return [];
    }
};

// Get match reason for recommendation
const getMatchReason = (userProduct, recommendedProduct) => {
    const reasons = [];
    
    if (userProduct.category?.toString() === recommendedProduct.category?.toString()) {
        reasons.push('Same category');
    }
    
    const commonTags = (userProduct.tags || []).filter(tag => 
        (recommendedProduct.tags || []).includes(tag)
    );
    
    if (commonTags.length > 0) {
        reasons.push(`Similar tags: ${commonTags.slice(0, 2).join(', ')}`);
    }
    
    if (userProduct.priceRange && recommendedProduct.price) {
        const userPrice = typeof userProduct.priceRange === 'object' ? 
            userProduct.priceRange.max || userProduct.priceRange.min : userProduct.priceRange;
        
        const priceDiff = Math.abs(userPrice - recommendedProduct.price) / userPrice;
        if (priceDiff < 0.3) {
            reasons.push('Similar price range');
        }
    }
    
    return reasons.length > 0 ? reasons.join(' • ') : 'You might like this';
};

// Get "Frequently Bought Together" recommendations
export const getFrequentlyBoughtTogether = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Find orders containing this product
        const ordersWithProduct = await OrderModel.find({
            'items.product': productId
        }).select('items');
        
        // Find other products frequently bought with this one
        const productCounts = {};
        
        ordersWithProduct.forEach(order => {
            order.items.forEach(item => {
                const itemId = item.product.toString();
                if (itemId !== productId) {
                    productCounts[itemId] = (productCounts[itemId] || 0) + 1;
                }
            });
        });
        
        // Get top 5 frequently bought together products
        const sortedProductIds = Object.entries(productCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([id]) => id);
        
        const products = await ProductModel.find({
            _id: { $in: sortedProductIds },
            status: 'active'
        }).select('name price images rating');
        
        res.status(200).json({
            success: true,
            products
        });
        
    } catch (error) {
        console.error('Error getting frequently bought together:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations'
        });
    }
};
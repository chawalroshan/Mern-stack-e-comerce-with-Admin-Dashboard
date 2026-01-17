import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
    getRecommendations,
    trackUserInteraction,
    getFrequentlyBoughtTogether
} from '../controllers/recommendation.controller.js';

const router = Router();

// Get personalized recommendations
router.get('/personalized', auth, getRecommendations);

// Track user interaction
router.post('/track', auth, async (req, res) => {
    try {
        const { productId, interactionType } = req.body;
        const result = await trackUserInteraction(req.userId, productId, interactionType);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get frequently bought together
router.get('/frequently-bought/:productId', getFrequentlyBoughtTogether);

// Get similar products
router.get('/similar/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        const similarProducts = await ProductModel.find({
            _id: { $ne: productId },
            category: product.category,
            status: 'active'
        })
        .limit(8)
        .select('name price images rating');
        
        res.status(200).json({
            success: true,
            products: similarProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
import { useState, useEffect, useCallback } from 'react';
import { 
    getPersonalizedRecommendations, 
    trackUserInteraction,
    getSimilarProducts,
    getFrequentlyBoughtTogether
} from '../utils/api';

export const useRecommendations = (userId, type = 'personalized') => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecommendations = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getPersonalizedRecommendations(type);
            if (response.success) {
                setRecommendations(response.recommendations || []);
            } else {
                setError(response.message || 'Failed to load recommendations');
            }
        } catch (err) {
            setError('Error fetching recommendations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId, type]);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    const trackInteraction = async (productId, interactionType) => {
        try {
            await trackUserInteraction(productId, interactionType);
        } catch (error) {
            console.error('Error tracking interaction:', error);
        }
    };

    return {
        recommendations,
        loading,
        error,
        refetch: fetchRecommendations,
        trackInteraction
    };
};

export const useProductRecommendations = (productId) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [frequentlyBought, setFrequentlyBought] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = useCallback(async () => {
        if (!productId) return;

        setLoading(true);
        try {
            const [similarRes, boughtRes] = await Promise.all([
                getSimilarProducts(productId),
                getFrequentlyBoughtTogether(productId)
            ]);

            if (similarRes.success) {
                setSimilarProducts(similarRes.products || []);
            }
            if (boughtRes.success) {
                setFrequentlyBought(boughtRes.products || []);
            }
        } catch (error) {
            console.error('Error fetching product recommendations:', error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    return {
        similarProducts,
        frequentlyBought,
        loading
    };
};
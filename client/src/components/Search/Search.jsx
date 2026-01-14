import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FaSearch } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import './style.css'
import { MyContext } from '../../App'
import { fetchDataFromApi } from '../../utils/api'
import { Link } from 'react-router-dom'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [recentSearches, setRecentSearches] = useState([])
    const [popularSearches, setPopularSearches] = useState([
        'iPhone', 'Laptop', 'Shoes', 'Dress', 'Watch', 'Headphones', 'Bag', 'Camera'
    ])
    
    const context = useContext(MyContext)
    const navigate = useNavigate()
    const searchRef = useRef(null)
    const resultsRef = useRef(null)

    // Load recent searches from localStorage
    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches')
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches))
        }
    }, [])

    // Save recent searches to localStorage
    useEffect(() => {
        if (recentSearches.length > 0) {
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches.slice(0, 5)))
        }
    }, [recentSearches])

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target) &&
                resultsRef.current && !resultsRef.current.contains(event.target)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Debounced search function
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                performSearch()
            } else {
                setSearchResults([])
                setShowResults(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const performSearch = async () => {
        if (!searchTerm.trim()) {
            setSearchResults([])
            return
        }

        try {
            setLoading(true)
            
            // Search in products
            const response = await fetchDataFromApi('/api/product/getAllProducts', {
                search: searchTerm,
                limit: 8
            })

            if (response.success && response.products) {
                setSearchResults(response.products)
                setShowResults(true)
                
                // Add to recent searches
                if (!recentSearches.includes(searchTerm.trim())) {
                    setRecentSearches(prev => [searchTerm.trim(), ...prev.slice(0, 4)])
                }
            } else {
                setSearchResults([])
            }
        } catch (error) {
            console.error('Search error:', error)
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchTerm.trim()) return
        
        // Navigate to product listing with search query
        navigate(`/productListing?search=${encodeURIComponent(searchTerm.trim())}`)
        
        // Add to recent searches
        if (!recentSearches.includes(searchTerm.trim())) {
            setRecentSearches(prev => [searchTerm.trim(), ...prev.slice(0, 4)])
        }
        
        // Clear and close
        setSearchTerm('')
        setShowResults(false)
    }

    const handleSearchClick = (term) => {
        setSearchTerm(term)
        navigate(`/productListing?search=${encodeURIComponent(term)}`)
        setShowResults(false)
        
        // Add to recent searches
        if (!recentSearches.includes(term)) {
            setRecentSearches(prev => [term, ...prev.slice(0, 4)])
        }
    }

    const handleClearSearch = () => {
        setSearchTerm('')
        setSearchResults([])
        setShowResults(false)
    }

    const handleClearRecent = () => {
        setRecentSearches([])
        localStorage.removeItem('recentSearches')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
        if (e.key === 'Escape') {
            setShowResults(false)
        }
    }

    const formatPrice = (price) => {
        return `Rs.${price?.toFixed(2) || '0.00'}`
    }

    const calculateDiscount = (price, oldPrice) => {
        if (oldPrice && oldPrice > price) {
            const discount = ((oldPrice - price) / oldPrice) * 100
            return Math.round(discount)
        }
        return 0
    }

    return (
        <div className="searchContainer relative w-full" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
                <TextField
                    fullWidth
                    placeholder="Search for products, brands, and more..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        if (searchTerm.trim().length >= 2 || recentSearches.length > 0) {
                            setShowResults(true)
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    className="searchInput"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaSearch className="text-gray-400" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <IoClose className="text-gray-400 hover:text-gray-600" />
                                </button>
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '50px',
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#eaeaea',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        }
                    }}
                />
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
                <div 
                    ref={resultsRef}
                    className="searchResults absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 max-h-[500px] overflow-hidden border border-gray-200"
                >
                    <div className="p-4">
                        {/* Loading State */}
                        {loading && (
                            <div className="py-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="mt-2 text-gray-600">Searching...</p>
                            </div>
                        )}

                        {/* Search Results */}
                        {!loading && searchTerm.trim() && (
                            <>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">
                                        Search Results for "{searchTerm}"
                                    </h4>
                                    <button
                                        onClick={() => handleSearchClick(searchTerm)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        See All →
                                    </button>
                                </div>

                                {searchResults.length > 0 ? (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {searchResults.map((product) => {
                                            const discount = calculateDiscount(product.price, product.oldePrice)
                                            return (
                                                <Link
                                                    key={product._id}
                                                    to={`/product/${product._id}`}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                                    onClick={() => setShowResults(false)}
                                                >
                                                    <div className="w-12 h-12 min-w-12 rounded-md overflow-hidden bg-gray-100">
                                                        {product.images && product.images[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                <span className="text-xs text-gray-500">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-sm font-medium truncate">
                                                            {product.name}
                                                        </h5>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm font-semibold text-primary">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                            {discount > 0 && (
                                                                <>
                                                                    <span className="text-xs line-through text-gray-500">
                                                                        {formatPrice(product.oldePrice)}
                                                                    </span>
                                                                    <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                                                        {discount}% OFF
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                            <FaSearch className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 mb-2">No products found</p>
                                        <p className="text-sm text-gray-500">
                                            Try different keywords or browse categories
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Recent Searches */}
                        {!loading && !searchTerm.trim() && recentSearches.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">Recent Searches</h4>
                                    <button
                                        onClick={handleClearRecent}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearchClick(search)}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors flex items-center gap-1"
                                        >
                                            <FaSearch className="text-xs" />
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Popular Searches */}
                        {!loading && !searchTerm.trim() && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-800 mb-3">Popular Searches</h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearchClick(search)}
                                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full text-sm text-blue-700 transition-colors"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search Tips */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                                <span>Press Enter to search</span>
                                <span>•</span>
                                <span>ESC to close</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gray-200 rounded">⌘K</span>
                                <span>for quick search</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search
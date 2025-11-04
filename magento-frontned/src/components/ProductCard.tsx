import React from "react";
import {
  Package,
  Tag,
  Hash,
  Calendar,
  Building,
  DollarSign,
  Box,
} from "lucide-react";

interface Product {
  id: number;
  sku: string;
  name?: string;
  title?: string;
  brand?: string;
  part_number?: string;
  pmtPartNumber?: string;
  price?: number | string | null;
  status?: number;
  in_stock?: boolean | string | null;
  qty?: number | null;
  short_description?: string;
  description?: string;
  categories?: string;
  images?: Array<{ url: string; label?: string }> | null;
  created_at?: string;
  pmtSupplierCode?: string;
  custom_attributes?: Array<{ attribute_code: string; value: any }>;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get product name with fallbacks
  const productName = product.name || product.title || "Unnamed Product";

  // Get part number with fallbacks
  const partNumber =
    product.part_number || product.pmtPartNumber || product.sku;

  // Price formatting
  const price = product.price
    ? typeof product.price === "number"
      ? `$${product.price.toFixed(2)}`
      : `$${parseFloat(product.price as string).toFixed(2)}`
    : "Price on request";

  // Stock status
  const inStock =
    product.in_stock === true ||
    product.in_stock === "true" ||
    product.status === 1;
  const quantity = product.qty || 0;

  // Generate beautiful gradient background based on product data
  const getCardBackground = () => {
    const supplierCode = product.pmtSupplierCode;
    const productId = product.id;

    // Color schemes based on supplier or product type
    const colorSchemes = [
      "from-blue-500 to-purple-600", // Blue-Purple
      "from-green-500 to-teal-600", // Green-Teal
      "from-orange-500 to-red-500", // Orange-Red
      "from-purple-500 to-pink-600", // Purple-Pink
      "from-teal-500 to-blue-600", // Teal-Blue
      "from-amber-500 to-orange-600", // Amber-Orange
      "from-rose-500 to-pink-500", // Rose-Pink
      "from-indigo-500 to-purple-600", // Indigo-Purple
      "from-emerald-500 to-green-600", // Emerald-Green
      "from-cyan-500 to-blue-600", // Cyan-Blue
    ];

    // Use supplier code or product ID to pick consistent color
    const index =
      (supplierCode ? parseInt(supplierCode) : productId) % colorSchemes.length;
    return colorSchemes[index];
  };

  const backgroundGradient = getCardBackground();

  // Get product icon based on name or category
  const getProductIcon = () => {
    const name = productName.toLowerCase();

    if (name.includes("display") || name.includes("brite"))
      return <Box className="h-12 w-12" />;
    if (name.includes("clamp") || name.includes("splice"))
      return <Package className="h-12 w-12" />;
    if (name.includes("grease") || name.includes("slick"))
      return <Tag className="h-12 w-12" />;
    if (name.includes("post") || name.includes("plate"))
      return <Building className="h-12 w-12" />;

    return <Package className="h-12 w-12" />;
  };

  // Format date
  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100">
      {/* Colorful Header */}
      <div
        className={`h-32 bg-gradient-to-br ${backgroundGradient} flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-white text-center">
          {getProductIcon()}
          <div className="mt-2 text-sm font-medium opacity-90">
            {product.pmtSupplierCode
              ? `Supplier: ${product.pmtSupplierCode}`
              : "Product"}
          </div>
        </div>

        {/* Price Badge */}
        {product.price && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white font-bold text-sm">{price}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {productName}
        </h3>

        {/* Part Number */}
        <div className="flex items-center text-gray-600 mb-3">
          <Hash className="h-4 w-4 mr-2" />
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {partNumber}
          </span>
        </div>

        {/* SKU */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Tag className="h-4 w-4 mr-2" />
          <span>SKU: {product.sku}</span>
        </div>

        {/* Description */}
        {(product.short_description || product.description) && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
            {product.short_description || product.description}
          </p>
        )}

        {/* Stock & Quantity Info */}
        <div className="flex justify-between items-center mb-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              inStock && quantity > 0
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {inStock && quantity > 0
              ? `In Stock (${quantity})`
              : "Out of Stock"}
          </span>

          {product.price && (
            <div className="flex items-center text-green-600 font-bold">
              <DollarSign className="h-4 w-4" />
              <span>{price}</span>
            </div>
          )}
        </div>

        {/* Categories */}
        {product.categories && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.categories
                .split(",")
                .slice(0, 3)
                .map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                  >
                    {category.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Added: {formattedDate}</span>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

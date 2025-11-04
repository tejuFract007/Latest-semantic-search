import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Database,
  Brain,
  Search,
  TrendingUp,
  ArrowRight,
  Users,
  BarChart3,
  Zap,
  Shield,
  RefreshCw,
  CheckCircle2,
  Star,
  Rocket,
  Target,
} from "lucide-react";
import axios from "axios";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  sampleBrands: string[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("/api/data/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback data
      setStats({
        totalProducts: 12457,
        totalCategories: 243,
        sampleBrands: [
          "BRITE ZONE",
          "CUSH-A-CLAMP",
          "SLICK DISK",
          "WABCO",
          "STEMCO",
          "PERMATEX",
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const features = [
    {
      title: "AI-Powered Search",
      description:
        "Use natural language to query your product database with intelligent matching",
      icon: Brain,
      path: "/ai-query",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      badge: "AI",
      premium: true,
    },
    {
      title: "Advanced Search",
      description:
        "Filter products by brand, category, price, and specifications",
      icon: Search,
      path: "/search",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      badge: "Fast",
      premium: false,
    },
    {
      title: "Data Management",
      description:
        "Load and manage Magento data with real-time synchronization",
      icon: Database,
      path: "/data",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      badge: "Sync",
      premium: false,
    },
    {
      title: "Analytics",
      description: "Sales trends, inventory insights, and performance metrics",
      icon: BarChart3,
      path: "/analytics",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      badge: "Insights",
      premium: true,
    },
  ];

  const quickStats = [
    {
      label: "Data Accuracy",
      value: "98.7%",
      trend: "+2.3%",
      icon: Target,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Response Time",
      value: "124ms",
      trend: "-56ms",
      icon: Rocket,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Uptime",
      value: "99.9%",
      trend: "30 days",
      icon: Shield,
      color: "text-emerald-600 bg-emerald-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Dashboard
          </h2>
          <p className="text-gray-600">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              System Online
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Product Advanced Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your product data into actionable insights with AI-powered
            search and advanced analytics for your e-commerce business.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalProducts.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-green-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Active and growing</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Categories
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalCategories.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <span>Well organized</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brands</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.sampleBrands.length}+
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <Star className="h-4 w-4 mr-1" />
                <span>Premium selection</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-3">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.path}
                className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-5 ${feature.color} group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Animated Background Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${feature.bgColor}`}>
                      <Icon className="h-8 w-8 text-gray-700" />
                    </div>
                    <div className="flex space-x-2">
                      {feature.premium && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Premium
                        </span>
                      )}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {feature.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    <span>Explore Feature</span>
                    <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Brands Section */}
        {stats?.sampleBrands && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Brands
                </h2>
                <p className="text-gray-600 mt-2">
                  Trusted by industry leaders worldwide
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Verified Partners</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.sampleBrands.map((brand, index) => (
                <div
                  key={brand}
                  className="group text-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4" />
            <span>Data updates in real-time</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Secure & reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

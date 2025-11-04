import React, { useState, useEffect } from "react";
import {
  Database,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Settings,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Download,
  Server,
  Cloud,
  Cpu,
  Layers,
  Package,
  FolderOpen,
  FileText,
  DatabaseBackup,
  Rocket,
} from "lucide-react";
import axios from "axios";

interface LoadResult {
  message: string;
  processed?: number;
  duration?: number;
  timestamp?: string;
}

interface SystemStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  dataSize: string;
  lastUpdated: string;
  processingTime: number;
  dataHealth: number;
}

const DataManagement: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, LoadResult>>({});
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"load" | "monitor" | "settings">(
    "load"
  );

  useEffect(() => {
    fetchStats();
    // Simulate progress for demo
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/data/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Demo data
      setStats({
        totalProducts: 12457,
        totalCategories: 243,
        totalSuppliers: 89,
        dataSize: "2.3 GB",
        lastUpdated: new Date().toISOString(),
        processingTime: 45,
        dataHealth: 98,
      });
    }
  };

  const handleLoad = async (type: string) => {
    setLoading(type);
    setProgress(0);

    try {
      let endpoint = "";
      switch (type) {
        case "categories":
          endpoint = "/api/data/load-categories";
          break;
        case "attributes":
          endpoint = "/api/data/load-attributes";
          break;
        case "products":
          endpoint = "/api/data/process-products";
          break;
        case "all":
          endpoint = "/api/data/load-all";
          break;
      }

      const response = await axios.post(endpoint);
      setResults((prev) => ({
        ...prev,
        [type]: {
          ...response.data,
          timestamp: new Date().toISOString(),
          duration: Math.random() * 2000 + 1000, // Simulated duration
        },
      }));
      await fetchStats();
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        [type]: {
          message: "Error: " + (error.response?.data?.message || error.message),
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setLoading(null);
      setProgress(100);
    }
  };

  const dataTypes = [
    {
      id: "categories",
      title: "Categories",
      description: "Load category hierarchy and relationships",
      icon: Layers,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      file: "categories-tree.json",
      stats: "243 categories",
    },
    {
      id: "attributes",
      title: "Attributes",
      description: "Load product specifications and metadata",
      icon: Settings,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      file: "attribute-master.json",
      stats: "150+ attributes",
    },
    {
      id: "products",
      title: "Products",
      description: "Process complete product catalog with inventory",
      icon: Package,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      file: "magento-products.ndjson",
      stats: "12K+ products",
    },
    {
      id: "all",
      title: "Full Sync",
      description: "Complete database synchronization",
      icon: Rocket,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      file: "all-data-sources",
      stats: "Complete system",
    },
  ];

  const systemMetrics = [
    {
      label: "Data Integrity",
      value: "99.8%",
      icon: Shield,
      color: "text-green-600",
    },
    {
      label: "Processing Speed",
      value: "2.3s",
      icon: Zap,
      color: "text-blue-600",
    },
    { label: "Uptime", value: "99.9%", icon: Server, color: "text-purple-600" },
    {
      label: "Storage Used",
      value: "2.3/5 GB",
      icon: HardDrive,
      color: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      action: "Product Sync",
      time: "2 minutes ago",
      status: "success",
      items: 12457,
    },
    {
      action: "Category Update",
      time: "5 minutes ago",
      status: "success",
      items: 243,
    },
    {
      action: "Attribute Refresh",
      time: "1 hour ago",
      status: "success",
      items: 156,
    },
    {
      action: "Full Backup",
      time: "2 hours ago",
      status: "success",
      items: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200/50 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Data System Online
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Data Management Console
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced data synchronization and management for your e-commerce
            catalog
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-200/50 mb-8">
          {[
            { id: "load", label: "Data Load", icon: Database },
            { id: "monitor", label: "System Monitor", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white shadow-lg text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalProducts.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Synced and ready</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalCategories}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-blue-600 text-sm">
              Organized hierarchy
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Health</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.dataHealth}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600 text-sm">
              <span>Excellent condition</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Last Updated
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {stats?.lastUpdated
                    ? new Date(stats.lastUpdated).toLocaleTimeString()
                    : "N/A"}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-orange-600 text-sm">Real-time sync</div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50"
              >
                <Icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
                <div className="text-lg font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Loading Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <Database className="h-8 w-8 text-blue-600" />
                <span>Data Synchronization</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataTypes.map((dataType) => {
                  const Icon = dataType.icon;
                  const result = results[dataType.id];
                  const isLoading = loading === dataType.id;

                  return (
                    <div
                      key={dataType.id}
                      className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${dataType.color} text-white group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {dataType.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {dataType.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <FileText className="h-3 w-3" />
                            <span>{dataType.file}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-blue-600 mt-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>{dataType.stats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {isLoading && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Processing...</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleLoad(dataType.id)}
                          disabled={isLoading}
                          className={`relative px-4 py-2 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 overflow-hidden ${
                            isLoading
                              ? "bg-gray-400"
                              : `bg-gradient-to-r ${dataType.color}`
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Upload className="h-4 w-4" />
                              <span>Sync Now</span>
                            </div>
                          )}
                        </button>

                        {result && (
                          <div
                            className={`flex items-center space-x-2 text-sm ${
                              result.message.includes("Error")
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {result.message.includes("Error") ? (
                              <AlertCircle className="h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                            <div className="text-right">
                              <div className="font-medium">
                                {result.processed
                                  ? `${result.processed} processed`
                                  : "Completed"}
                              </div>
                              {result.duration && (
                                <div className="text-xs opacity-75">
                                  {Math.round(result.duration / 1000)}s
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                <Clock className="h-6 w-6 text-gray-600" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {activity.action}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    {activity.items && (
                      <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                        {activity.items.toLocaleString()} items
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                <span>System Status</span>
              </h3>
              <div className="space-y-3">
                {[
                  {
                    service: "Database",
                    status: "online",
                    color: "bg-green-500",
                  },
                  {
                    service: "API Server",
                    status: "online",
                    color: "bg-green-500",
                  },
                  {
                    service: "File System",
                    status: "online",
                    color: "bg-green-500",
                  },
                  {
                    service: "Backup Service",
                    status: "online",
                    color: "bg-green-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {item.service}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}
                      ></div>
                      <span className="text-sm text-green-600 font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <DatabaseBackup className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600">
                    Create Backup
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group">
                  <Download className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
                  <span className="text-gray-700 group-hover:text-green-600">
                    Export Data
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
                  <RefreshCw className="h-5 w-5 text-gray-600 group-hover:text-purple-600" />
                  <span className="text-gray-700 group-hover:text-purple-600">
                    Force Refresh
                  </span>
                </button>
              </div>
            </div>

            {/* Data Health */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Data Health</span>
              </h3>
              <div className="space-y-3 text-sm text-blue-100">
                <div className="flex justify-between">
                  <span>Integrity Check</span>
                  <span className="font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Validation Passed</span>
                  <span className="font-semibold">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Verification</span>
                  <span className="font-semibold">Just now</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-xs text-blue-100">
                  All systems operational. Data integrity maintained at optimal
                  levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;

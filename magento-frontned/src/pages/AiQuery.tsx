// import React, { useState, useEffect } from "react";
// import {
//   Brain,
//   Play,
//   Copy,
//   CheckCircle,
//   Search,
//   Filter,
//   TrendingUp,
//   Lightbulb,
//   Users,
//   Zap,
// } from "lucide-react";
// import axios from "axios";

// interface QueryResult {
//   success: boolean;
//   naturalQuery: string;
//   generatedSQL: string;
//   explanation: string;
//   results: any[];
//   count: number;
//   error?: string;
// }

// interface EnhancedSearchResult {
//   success: boolean;
//   products: any[];
//   suggestedSearches: string[];
//   relatedCategories: string[];
//   searchIntent: "exploratory" | "specific" | "comparison" | "purchase";
//   summary?: string;
//   sessionId?: string;
//   filters?: any;
//   count?: number;
// }

// const AIQuery: React.FC = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<QueryResult | null>(null);
//   const [enhancedResult, setEnhancedResult] =
//     useState<EnhancedSearchResult | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [searchMode, setSearchMode] = useState<
//     "natural" | "enhanced" | "semantic"
//   >("natural");
//   const [sessionId, setSessionId] = useState<string>("");
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);

//   // Generate session ID on component mount
//   useEffect(() => {
//     const newSessionId = `session_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;
//     setSessionId(newSessionId);

//     // Load search history from localStorage
//     const savedHistory = localStorage.getItem("searchHistory");
//     if (savedHistory) {
//       setSearchHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   const saveToHistory = (query: string) => {
//     const newHistory = [
//       query,
//       ...searchHistory.filter((q) => q !== query),
//     ].slice(0, 10);
//     setSearchHistory(newHistory);
//     localStorage.setItem("searchHistory", JSON.stringify(newHistory));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setLoading(true);
//     setResult(null);
//     setEnhancedResult(null);
//     saveToHistory(query.trim());

//     try {
//       if (searchMode === "natural") {
//         // Natural language query
//         const response = await axios.post(
//           "http://localhost:4000/query/natural",
//           {
//             query: query.trim(),
//           }
//         );
//         setResult(response.data);
//       } else if (searchMode === "enhanced") {
//         // Enhanced search with semantic capabilities
//         const response = await axios.get(
//           "http://localhost:4000/query/enhanced-search",
//           {
//             params: {
//               q: query.trim(),
//               sessionId: sessionId,
//               limit: 20,
//             },
//           }
//         );
//         setEnhancedResult(response.data);
//       } else if (searchMode === "semantic") {
//         // Pure semantic search
//         const response = await axios.get(
//           "http://localhost:4000/query/semantic-search",
//           {
//             params: {
//               q: query.trim(),
//               similarity: 0.7,
//               limit: 20,
//             },
//           }
//         );
//         setEnhancedResult({
//           ...response.data,
//           products: response.data.results,
//           searchIntent: "specific",
//         });
//       }
//     } catch (error: any) {
//       const errorResult = {
//         success: false,
//         naturalQuery: query,
//         generatedSQL: "",
//         explanation: "",
//         results: [],
//         count: 0,
//         error: error.response?.data?.error || "An error occurred",
//       };
//       setResult(errorResult);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuickSearch = async (quickQuery: string) => {
//     setQuery(quickQuery);
//     setSearchMode("enhanced");

//     // Auto-submit after a short delay
//     setTimeout(() => {
//       const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
//       handleSubmit(fakeEvent);
//     }, 100);
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const getSearchIntentColor = (intent: string) => {
//     switch (intent) {
//       case "purchase":
//         return "bg-green-100 text-green-800";
//       case "specific":
//         return "bg-blue-100 text-blue-800";
//       case "comparison":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getSearchIntentIcon = (intent: string) => {
//     switch (intent) {
//       case "purchase":
//         return <Zap className="h-4 w-4" />;
//       case "specific":
//         return <Search className="h-4 w-4" />;
//       case "comparison":
//         return <Filter className="h-4 w-4" />;
//       default:
//         return <Lightbulb className="h-4 w-4" />;
//     }
//   };

//   // Enhanced example queries for different modes
//   const naturalLanguageExamples = [
//     "Show me all products from brand Volvo that are in stock",
//     "Find products under $1000 with category 'Air Conditioning'",
//     "List the top 10 most expensive products in stock",
//     "Show products added in the last 30 days",
//     "Find products that contain 'compressor' in the description",
//   ];

//   const enhancedSearchExamples = [
//     "car parts under $100",
//     "hydraulic system components",
//     "display units for retail",
//     "tire accessories and tools",
//     "electrical connectors and wires",
//   ];

//   const semanticSearchExamples = [
//     "water pump replacement",
//     "brake system parts",
//     "engine maintenance kit",
//     "cooling system components",
//     "electrical wiring harness",
//   ];

//   const trendingSearches = [
//     "britezone display",
//     "00200 parts",
//     "hydraulic tools",
//     "automotive accessories",
//     "compressor units",
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <Brain className="h-8 w-8 text-purple-600" />
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               AI Search Assistant
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Intelligent product search with natural language understanding
//             </p>
//           </div>
//         </div>

//         {/* Search Mode Selector */}
//         <div className="flex space-x-2">
//           {[
//             { key: "natural", label: "Natural SQL", icon: Brain },
//             { key: "enhanced", label: "Smart Search", icon: Search },
//             { key: "semantic", label: "Semantic", icon: TrendingUp },
//           ].map((mode) => (
//             <button
//               key={mode.key}
//               onClick={() => setSearchMode(mode.key as any)}
//               className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
//                 searchMode === mode.key
//                   ? "bg-purple-100 border-purple-300 text-purple-700"
//                   : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               <mode.icon className="h-4 w-4" />
//               <span>{mode.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Input Section */}
//         <div className="lg:col-span-2 space-y-6">
//           <form onSubmit={handleSubmit} className="card">
//             <div className="mb-4">
//               <div className="flex items-center justify-between mb-2">
//                 <label
//                   htmlFor="query"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   {searchMode === "natural"
//                     ? "Ask in Natural Language"
//                     : searchMode === "enhanced"
//                     ? "Smart Product Search"
//                     : "Semantic Similarity Search"}
//                 </label>
//                 <span className="text-xs text-gray-500">
//                   Session: {sessionId.substring(0, 8)}...
//                 </span>
//               </div>
//               <textarea
//                 id="query"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder={
//                   searchMode === "natural"
//                     ? "e.g., Show me all in-stock products from brand Volvo under $500"
//                     : searchMode === "enhanced"
//                     ? "e.g., car parts under $100 or hydraulic system components"
//                     : "e.g., water pump replacement or brake system parts"
//                 }
//                 rows={4}
//                 className="input-field resize-none"
//                 disabled={loading}
//               />
//             </div>

//             <div className="flex justify-between items-center">
//               <button
//                 type="submit"
//                 disabled={loading || !query.trim()}
//                 className="btn-primary flex items-center space-x-2"
//               >
//                 <Play className="h-4 w-4" />
//                 <span>
//                   {loading
//                     ? "Searching..."
//                     : searchMode === "natural"
//                     ? "Run Query"
//                     : searchMode === "enhanced"
//                     ? "Smart Search"
//                     : "Semantic Search"}
//                 </span>
//               </button>

//               <div className="flex space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setQuery("")}
//                   disabled={loading}
//                   className="btn-secondary"
//                 >
//                   Clear
//                 </button>

//                 {searchHistory.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={() => setQuery(searchHistory[0])}
//                     disabled={loading}
//                     className="btn-secondary flex items-center space-x-1"
//                   >
//                     <Users className="h-4 w-4" />
//                     <span>History</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </form>

//           {/* Example Queries based on mode */}
//           <div className="card">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//               <Lightbulb className="h-5 w-5 text-yellow-500" />
//               <span>
//                 {searchMode === "natural"
//                   ? "Natural Language Examples"
//                   : searchMode === "enhanced"
//                   ? "Smart Search Examples"
//                   : "Semantic Search Examples"}
//               </span>
//             </h3>
//             <div className="space-y-2">
//               {(searchMode === "natural"
//                 ? naturalLanguageExamples
//                 : searchMode === "enhanced"
//                 ? enhancedSearchExamples
//                 : semanticSearchExamples
//               ).map((example, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuickSearch(example)}
//                   className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-sm text-gray-700"
//                 >
//                   {example}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Trending Searches */}
//           <div className="card">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//               <TrendingUp className="h-5 w-5 text-orange-500" />
//               <span>Trending Searches</span>
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {trendingSearches.map((trend, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuickSearch(trend)}
//                   className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
//                 >
//                   {trend}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Search History */}
//           {searchHistory.length > 0 && (
//             <div className="card">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Users className="h-5 w-5 text-blue-500" />
//                 <span>Your Search History</span>
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {searchHistory.slice(0, 5).map((historyItem, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQuickSearch(historyItem)}
//                     className="px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-full text-sm text-blue-700 transition-colors border border-blue-200"
//                   >
//                     {historyItem.length > 30
//                       ? historyItem.substring(0, 30) + "..."
//                       : historyItem}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Results Section */}
//         <div className="space-y-6">
//           {/* Enhanced Search Results */}
//           {enhancedResult && (
//             <>
//               {/* Search Summary */}
//               <div className="card">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Search Results
//                   </h3>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${getSearchIntentColor(
//                       enhancedResult.searchIntent
//                     )} flex items-center space-x-1`}
//                   >
//                     {getSearchIntentIcon(enhancedResult.searchIntent)}
//                     <span>{enhancedResult.searchIntent}</span>
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600 mb-4">
//                   Found {enhancedResult.count || enhancedResult.products.length}{" "}
//                   results for: "{query}"
//                 </p>

//                 {enhancedResult.summary && (
//                   <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
//                     <p className="text-sm text-blue-800">
//                       {enhancedResult.summary}
//                     </p>
//                   </div>
//                 )}

//                 {/* Suggested Searches */}
//                 {enhancedResult.suggestedSearches &&
//                   enhancedResult.suggestedSearches.length > 0 && (
//                     <div className="mb-4">
//                       <p className="text-sm font-medium text-gray-700 mb-2">
//                         Try these related searches:
//                       </p>
//                       <div className="flex flex-wrap gap-2">
//                         {enhancedResult.suggestedSearches
//                           .slice(0, 5)
//                           .map((suggestion, index) => (
//                             <button
//                               key={index}
//                               onClick={() => handleQuickSearch(suggestion)}
//                               className="px-3 py-1 bg-purple-50 hover:bg-purple-100 rounded-full text-sm text-purple-700 transition-colors border border-purple-200"
//                             >
//                               {suggestion}
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Results List */}
//                 {enhancedResult.products.length > 0 && (
//                   <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {enhancedResult.products
//                       .slice(0, 10)
//                       .map((product, index) => (
//                         <div
//                           key={index}
//                           className="p-3 bg-gray-50 rounded-lg border border-gray-200"
//                         >
//                           <div className="flex justify-between items-start mb-2">
//                             <h4 className="font-medium text-gray-900">
//                               {product.title || product.name}
//                             </h4>
//                             {product.price && (
//                               <span className="text-green-600 font-semibold">
//                                 ${product.price}
//                               </span>
//                             )}
//                           </div>
//                           {product.brand && (
//                             <p className="text-sm text-gray-600 mb-1">
//                               Brand: {product.brand}
//                             </p>
//                           )}
//                           {product.part_number && (
//                             <p className="text-sm text-gray-600 mb-1">
//                               Part: {product.part_number}
//                             </p>
//                           )}
//                           {product.categories && (
//                             <p className="text-sm text-gray-500">
//                               Categories: {product.categories}
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     {enhancedResult.products.length > 10 && (
//                       <p className="text-sm text-gray-500 text-center">
//                         ... and {enhancedResult.products.length - 10} more
//                         results
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {/* Natural Language Query Results */}
//           {result && (
//             <>
//               {/* SQL Query */}
//               <div className="card">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Generated SQL
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard(result.generatedSQL)}
//                     className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
//                   >
//                     {copied ? (
//                       <CheckCircle className="h-4 w-4 text-green-600" />
//                     ) : (
//                       <Copy className="h-4 w-4" />
//                     )}
//                     <span>{copied ? "Copied!" : "Copy"}</span>
//                   </button>
//                 </div>
//                 <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
//                   {result.generatedSQL}
//                 </pre>
//                 {result.explanation && (
//                   <p className="mt-3 text-sm text-gray-600">
//                     {result.explanation}
//                   </p>
//                 )}
//               </div>

//               {/* Results Summary */}
//               <div className="card">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Results
//                 </h3>
//                 {result.success ? (
//                   <div>
//                     <p className="text-sm text-gray-600 mb-4">
//                       Found {result.count} results for: "{result.naturalQuery}"
//                     </p>

//                     {result.results.length > 0 && (
//                       <div className="space-y-3 max-h-96 overflow-y-auto">
//                         {result.results.slice(0, 10).map((row, index) => (
//                           <div
//                             key={index}
//                             className="p-3 bg-gray-50 rounded-lg border border-gray-200"
//                           >
//                             <pre className="text-xs text-gray-700 whitespace-pre-wrap">
//                               {JSON.stringify(row, null, 2)}
//                             </pre>
//                           </div>
//                         ))}
//                         {result.results.length > 10 && (
//                           <p className="text-sm text-gray-500 text-center">
//                             ... and {result.results.length - 10} more results
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-red-800 font-medium">Error</p>
//                     <p className="text-red-700 text-sm mt-1">{result.error}</p>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIQuery;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Brain,
//   Play,
//   Copy,
//   CheckCircle,
//   Search,
//   Filter,
//   TrendingUp,
//   Lightbulb,
//   Users,
//   Zap,
//   Sparkles,
//   Target,
//   Clock,
//   BarChart3,
//   Shield,
//   Cpu,
//   MessageSquare,
//   ArrowRight,
//   X,
//   BookOpen,
//   Star,
//   Rocket,
//   Wand2,
// } from "lucide-react";
// import axios from "axios";

// interface QueryResult {
//   success: boolean;
//   naturalQuery: string;
//   generatedSQL: string;
//   explanation: string;
//   results: any[];
//   count: number;
//   error?: string;
// }

// interface EnhancedSearchResult {
//   success: boolean;
//   products: any[];
//   suggestedSearches: string[];
//   relatedCategories: string[];
//   searchIntent: "exploratory" | "specific" | "comparison" | "purchase";
//   summary?: string;
//   sessionId?: string;
//   filters?: any;
//   count?: number;
// }

// const AIQuery: React.FC = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<QueryResult | null>(null);
//   const [enhancedResult, setEnhancedResult] =
//     useState<EnhancedSearchResult | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [searchMode, setSearchMode] = useState<
//     "natural" | "enhanced" | "semantic"
//   >("enhanced");
//   const [sessionId, setSessionId] = useState<string>("");
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);
//   const [typingIndex, setTypingIndex] = useState(0);
//   const [activeExample, setActiveExample] = useState(0);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Generate session ID on component mount
//   useEffect(() => {
//     const newSessionId = `session_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;
//     setSessionId(newSessionId);

//     const savedHistory = localStorage.getItem("searchHistory");
//     if (savedHistory) {
//       setSearchHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   }, [query]);

//   // Example rotation effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveExample((prev) => (prev + 1) % enhancedSearchExamples.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const saveToHistory = (query: string) => {
//     const newHistory = [
//       query,
//       ...searchHistory.filter((q) => q !== query),
//     ].slice(0, 8);
//     setSearchHistory(newHistory);
//     localStorage.setItem("searchHistory", JSON.stringify(newHistory));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setLoading(true);
//     setResult(null);
//     setEnhancedResult(null);
//     saveToHistory(query.trim());

//     try {
//       if (searchMode === "natural") {
//         const response = await axios.post(
//           "http://localhost:4000/query/natural",
//           {
//             query: query.trim(),
//           }
//         );
//         setResult(response.data);
//       } else if (searchMode === "enhanced") {
//         const response = await axios.get(
//           "http://localhost:4000/query/enhanced-search",
//           {
//             params: { q: query.trim(), sessionId, limit: 20 },
//           }
//         );
//         setEnhancedResult(response.data);
//       } else if (searchMode === "semantic") {
//         const response = await axios.get(
//           "http://localhost:4000/query/semantic-search",
//           {
//             params: { q: query.trim(), similarity: 0.7, limit: 20 },
//           }
//         );
//         setEnhancedResult({
//           ...response.data,
//           products: response.data.results,
//           searchIntent: "specific",
//         });
//       }
//     } catch (error: any) {
//       const errorResult = {
//         success: false,
//         naturalQuery: query,
//         generatedSQL: "",
//         explanation: "",
//         results: [],
//         count: 0,
//         error: error.response?.data?.error || "An error occurred",
//       };
//       setResult(errorResult);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuickSearch = (quickQuery: string) => {
//     setQuery(quickQuery);
//     // Auto-focus and submit
//     setTimeout(() => {
//       if (textareaRef.current) {
//         textareaRef.current.focus();
//       }
//       const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
//       handleSubmit(fakeEvent);
//     }, 100);
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const clearSearch = () => {
//     setQuery("");
//     setResult(null);
//     setEnhancedResult(null);
//     if (textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   };

//   const getSearchIntentColor = (intent: string) => {
//     const colors = {
//       purchase: "from-green-500 to-emerald-600",
//       specific: "from-blue-500 to-cyan-600",
//       comparison: "from-purple-500 to-indigo-600",
//       exploratory: "from-orange-500 to-amber-600",
//     };
//     return colors[intent as keyof typeof colors] || "from-gray-500 to-gray-600";
//   };

//   const getSearchIntentIcon = (intent: string) => {
//     switch (intent) {
//       case "purchase":
//         return <Zap className="h-4 w-4" />;
//       case "specific":
//         return <Target className="h-4 w-4" />;
//       case "comparison":
//         return <BarChart3 className="h-4 w-4" />;
//       default:
//         return <Lightbulb className="h-4 w-4" />;
//     }
//   };

//   // Enhanced examples
//   const naturalLanguageExamples = [
//     "Show me all in-stock products under $500 from automotive category",
//     "Find products added in the last 7 days with high customer ratings",
//     "List top 10 most popular products by sales volume",
//     "Show me electrical components that need restocking soon",
//     "Find compatible parts for model number XJ-2024",
//   ];

//   const enhancedSearchExamples = [
//     "car parts under $100",
//     "hydraulic system components in stock",
//     "display units for retail stores",
//     "tire accessories with free shipping",
//     "electrical connectors and wiring kits",
//     "engine maintenance tools and equipment",
//   ];

//   const semanticSearchExamples = [
//     "water pump replacement parts",
//     "brake system maintenance kit",
//     "engine cooling components",
//     "electrical wiring harness connectors",
//     "suspension upgrade parts",
//   ];

//   const trendingSearches = [
//     "britezone display units",
//     "00200 series parts",
//     "hydraulic tools equipment",
//     "automotive accessories 2024",
//     "compressor units in stock",
//   ];

//   const features = [
//     {
//       icon: Brain,
//       label: "AI-Powered",
//       description: "Natural language understanding",
//     },
//     { icon: Zap, label: "Fast", description: "Millisecond response times" },
//     { icon: Shield, label: "Accurate", description: "99.3% precision rate" },
//     { icon: Cpu, label: "Smart", description: "Context-aware results" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200/50 mb-6">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-sm font-medium text-gray-700">
//               AI Assistant Online
//             </span>
//           </div>
//           <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
//             Intelligent Product Search
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Discover exactly what you need with AI-powered search that
//             understands your business language
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Left Sidebar - Features & Examples */}
//           <div className="space-y-6">
//             {/* Search Modes */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Sparkles className="h-5 w-5 text-purple-600" />
//                 <span>Search Mode</span>
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   {
//                     key: "enhanced",
//                     label: "Smart Search",
//                     icon: Brain,
//                     description: "AI-powered recommendations",
//                     color: "from-purple-500 to-purple-600",
//                   },
//                   {
//                     key: "natural",
//                     label: "Natural SQL",
//                     icon: MessageSquare,
//                     description: "Plain English to SQL",
//                     color: "from-blue-500 to-blue-600",
//                   },
//                   {
//                     key: "semantic",
//                     label: "Semantic",
//                     icon: Target,
//                     description: "Meaning-based matching",
//                     color: "from-green-500 to-green-600",
//                   },
//                 ].map((mode) => (
//                   <button
//                     key={mode.key}
//                     onClick={() => setSearchMode(mode.key as any)}
//                     className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group ${
//                       searchMode === mode.key
//                         ? `border-gray-300 bg-gradient-to-r ${mode.color} text-white shadow-lg transform scale-105`
//                         : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`p-2 rounded-lg ${
//                           searchMode === mode.key
//                             ? "bg-white/20"
//                             : "bg-gray-100"
//                         }`}
//                       >
//                         <mode.icon
//                           className={`h-5 w-5 ${
//                             searchMode === mode.key
//                               ? "text-white"
//                               : "text-gray-600"
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <div
//                           className={`font-semibold ${
//                             searchMode === mode.key
//                               ? "text-white"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {mode.label}
//                         </div>
//                         <div
//                           className={`text-sm ${
//                             searchMode === mode.key
//                               ? "text-white/90"
//                               : "text-gray-600"
//                           }`}
//                         >
//                           {mode.description}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Features */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Why It's Smart
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {features.map((feature, index) => {
//                   const Icon = feature.icon;
//                   return (
//                     <div
//                       key={index}
//                       className="text-center p-3 bg-gray-50 rounded-lg"
//                     >
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
//                         <Icon className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {feature.label}
//                       </div>
//                       <div className="text-xs text-gray-600 mt-1">
//                         {feature.description}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Quick Examples */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Rocket className="h-5 w-5 text-orange-500" />
//                 <span>Try These</span>
//               </h3>
//               <div className="space-y-3">
//                 {(searchMode === "natural"
//                   ? naturalLanguageExamples
//                   : searchMode === "enhanced"
//                   ? enhancedSearchExamples
//                   : semanticSearchExamples
//                 )
//                   .slice(0, 4)
//                   .map((example, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickSearch(example)}
//                       className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
//                         <span className="text-sm text-gray-700 flex-1">
//                           {example}
//                         </span>
//                         <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//                       </div>
//                     </button>
//                   ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Search Input */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
//               {/* Animated Background */}
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <label className="block text-lg font-semibold text-gray-900">
//                       What are you looking for?
//                     </label>
//                     <div className="flex items-center space-x-2 text-sm text-gray-500">
//                       <Clock className="h-4 w-4" />
//                       <span>Session: {sessionId.substring(0, 8)}...</span>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <textarea
//                       ref={textareaRef}
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder={
//                         searchMode === "natural"
//                           ? "Describe what you need in plain English..."
//                           : searchMode === "enhanced"
//                           ? "Search for products, categories, or specifications..."
//                           : "Find similar products or components..."
//                       }
//                       rows={3}
//                       className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 bg-gray-50/50 backdrop-blur-sm"
//                       disabled={loading}
//                     />

//                     {/* Floating Action Buttons */}
//                     <div className="absolute right-3 top-3 flex space-x-2">
//                       {query && (
//                         <button
//                           type="button"
//                           onClick={clearSearch}
//                           className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                         >
//                           <X className="h-5 w-5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <button
//                     type="submit"
//                     disabled={loading || !query.trim()}
//                     className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 flex items-center space-x-3 group overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                         <span>Searching...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Play className="h-5 w-5" />
//                         <span>Search Products</span>
//                         <Wand2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//                       </>
//                     )}
//                   </button>

//                   <div className="flex space-x-3">
//                     {searchHistory.length > 0 && (
//                       <button
//                         type="button"
//                         onClick={() => setQuery(searchHistory[0])}
//                         disabled={loading}
//                         className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                       >
//                         <Clock className="h-4 w-4" />
//                         <span>History</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Results Section */}
//             {enhancedResult && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                 {/* Search Header */}
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Search Results
//                     </h3>
//                     <p className="text-gray-600 mt-1">
//                       Found{" "}
//                       {enhancedResult.count || enhancedResult.products.length}{" "}
//                       products
//                     </p>
//                   </div>
//                   <div
//                     className={`px-4 py-2 rounded-full bg-gradient-to-r ${getSearchIntentColor(
//                       enhancedResult.searchIntent
//                     )} text-white font-medium flex items-center space-x-2`}
//                   >
//                     {getSearchIntentIcon(enhancedResult.searchIntent)}
//                     <span className="capitalize">
//                       {enhancedResult.searchIntent}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Summary */}
//                 {enhancedResult.summary && (
//                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
//                     <div className="flex items-start space-x-3">
//                       <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
//                       <p className="text-blue-800 leading-relaxed">
//                         {enhancedResult.summary}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Suggested Searches */}
//                 {enhancedResult.suggestedSearches &&
//                   enhancedResult.suggestedSearches.length > 0 && (
//                     <div className="mb-6">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-3">
//                         Related Searches
//                       </h4>
//                       <div className="flex flex-wrap gap-2">
//                         {enhancedResult.suggestedSearches
//                           .slice(0, 6)
//                           .map((suggestion, index) => (
//                             <button
//                               key={index}
//                               onClick={() => handleQuickSearch(suggestion)}
//                               className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full text-sm text-gray-700 transition-all duration-300 hover:scale-105 border border-gray-300/50"
//                             >
//                               {suggestion}
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Results Grid */}
//                 {enhancedResult.products.length > 0 && (
//                   <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                     {enhancedResult.products
//                       .slice(0, 8)
//                       .map((product, index) => (
//                         <div
//                           key={index}
//                           className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                                 {product.title || product.name}
//                               </h4>
//                               <div className="flex items-center space-x-4 mt-2">
//                                 {product.brand && (
//                                   <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
//                                     {product.brand}
//                                   </span>
//                                 )}
//                                 {product.part_number && (
//                                   <span className="text-sm text-gray-500 font-mono">
//                                     #{product.part_number}
//                                   </span>
//                                 )}
//                               </div>
//                               {product.categories && (
//                                 <p className="text-sm text-gray-500 mt-1">
//                                   {product.categories}
//                                 </p>
//                               )}
//                             </div>
//                             {product.price && (
//                               <div className="text-right">
//                                 <div className="text-lg font-bold text-green-600">
//                                   $
//                                   {typeof product.price === "number"
//                                     ? product.price.toFixed(2)
//                                     : product.price}
//                                 </div>
//                                 <div
//                                   className={`text-xs px-2 py-1 rounded-full ${
//                                     product.in_stock
//                                       ? "bg-green-100 text-green-800"
//                                       : "bg-red-100 text-red-800"
//                                   }`}
//                                 >
//                                   {product.in_stock
//                                     ? "In Stock"
//                                     : "Out of Stock"}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     {enhancedResult.products.length > 8 && (
//                       <div className="text-center py-4">
//                         <button className="text-blue-600 hover:text-blue-700 font-semibold">
//                           View all {enhancedResult.products.length} results →
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Natural Language Results */}
//             {result && (
//               <div className="space-y-6">
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Generated SQL
//                     </h3>
//                     <button
//                       onClick={() => copyToClipboard(result.generatedSQL)}
//                       className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       {copied ? (
//                         <CheckCircle className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <Copy className="h-5 w-5" />
//                       )}
//                       <span>{copied ? "Copied!" : "Copy SQL"}</span>
//                     </button>
//                   </div>
//                   <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl text-sm overflow-x-auto border-2 border-gray-800">
//                     {result.generatedSQL}
//                   </pre>
//                   {result.explanation && (
//                     <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
//                       <p className="text-blue-800">{result.explanation}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-6">
//             {/* Trending Searches */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <TrendingUp className="h-5 w-5 text-orange-500" />
//                 <span>Trending Now</span>
//               </h3>
//               <div className="space-y-3">
//                 {trendingSearches.map((trend, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQuickSearch(trend)}
//                     className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 transition-all duration-300 group"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-gray-900">
//                         {trend}
//                       </span>
//                       <div className="flex items-center space-x-1">
//                         <Star className="h-3 w-3 text-orange-500" />
//                         <span className="text-xs text-orange-600">
//                           Trending
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Search History */}
//             {searchHistory.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <Clock className="h-5 w-5 text-blue-500" />
//                   <span>Recent Searches</span>
//                 </h3>
//                 <div className="space-y-2">
//                   {searchHistory.map((historyItem, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickSearch(historyItem)}
//                       className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                         <span className="text-sm text-gray-700 flex-1 truncate">
//                           {historyItem}
//                         </span>
//                         <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Tips */}
//             <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
//               <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
//                 <BookOpen className="h-5 w-5" />
//                 <span>Pro Tips</span>
//               </h3>
//               <ul className="space-y-2 text-sm text-blue-100">
//                 <li>• Use specific product names for better results</li>
//                 <li>• Include price ranges when budgeting</li>
//                 <li>• Mention brands for targeted searches</li>
//                 <li>• Use categories to narrow down results</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIQuery;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Brain,
//   Play,
//   Copy,
//   CheckCircle,
//   Search,
//   Filter,
//   TrendingUp,
//   Lightbulb,
//   Users,
//   Zap,
//   Sparkles,
//   Target,
//   Clock,
//   BarChart3,
//   Shield,
//   Cpu,
//   MessageSquare,
//   ArrowRight,
//   X,
//   BookOpen,
//   Star,
//   Rocket,
//   Wand2,
//   Mic,
//   FileText,
// } from "lucide-react";
// import axios from "axios";

// interface QueryResult {
//   success: boolean;
//   naturalQuery: string;
//   generatedSQL: string;
//   explanation: string;
//   results: any[];
//   count: number;
//   error?: string;
// }

// interface EnhancedSearchResult {
//   success: boolean;
//   products: any[];
//   suggestedSearches: string[];
//   relatedCategories: string[];
//   searchIntent: "exploratory" | "specific" | "comparison" | "purchase";
//   summary?: string;
//   sessionId?: string;
//   filters?: any;
//   count?: number;
// }

// const AIQuery: React.FC = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<QueryResult | null>(null);
//   const [enhancedResult, setEnhancedResult] =
//     useState<EnhancedSearchResult | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [searchMode, setSearchMode] = useState<
//     "natural" | "enhanced" | "semantic"
//   >("enhanced");
//   const [sessionId, setSessionId] = useState<string>("");
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Generate session ID on component mount
//   useEffect(() => {
//     const newSessionId = `session_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;
//     setSessionId(newSessionId);

//     // Load search history from localStorage
//     const savedHistory = localStorage.getItem("searchHistory");
//     if (savedHistory) {
//       setSearchHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   }, [query]);

//   const saveToHistory = (query: string) => {
//     const newHistory = [
//       query,
//       ...searchHistory.filter((q) => q !== query),
//     ].slice(0, 10);
//     setSearchHistory(newHistory);
//     localStorage.setItem("searchHistory", JSON.stringify(newHistory));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setLoading(true);
//     setResult(null);
//     setEnhancedResult(null);
//     saveToHistory(query.trim());

//     try {
//       if (searchMode === "natural") {
//         // Natural language query
//         const response = await axios.post(
//           "http://localhost:4000/query/natural",
//           {
//             query: query.trim(),
//           }
//         );
//         setResult(response.data);
//       } else if (searchMode === "enhanced") {
//         // Enhanced search with semantic capabilities
//         const response = await axios.get(
//           "http://localhost:4000/query/enhanced-search",
//           {
//             params: {
//               q: query.trim(),
//               sessionId: sessionId,
//               limit: 20,
//             },
//           }
//         );
//         setEnhancedResult(response.data);
//       } else if (searchMode === "semantic") {
//         // Pure semantic search
//         const response = await axios.get(
//           "http://localhost:4000/query/semantic-search",
//           {
//             params: {
//               q: query.trim(),
//               similarity: 0.7,
//               limit: 20,
//             },
//           }
//         );
//         setEnhancedResult({
//           ...response.data,
//           products: response.data.results,
//           searchIntent: "specific",
//         });
//       }
//     } catch (error: any) {
//       const errorResult = {
//         success: false,
//         naturalQuery: query,
//         generatedSQL: "",
//         explanation: "",
//         results: [],
//         count: 0,
//         error: error.response?.data?.error || "An error occurred",
//       };
//       setResult(errorResult);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuickSearch = async (quickQuery: string) => {
//     setQuery(quickQuery);
//     // Auto-focus and submit
//     setTimeout(() => {
//       if (textareaRef.current) {
//         textareaRef.current.focus();
//       }
//       const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
//       handleSubmit(fakeEvent);
//     }, 100);
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const clearSearch = () => {
//     setQuery("");
//     setResult(null);
//     setEnhancedResult(null);
//     if (textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   };

//   const getSearchIntentColor = (intent: string) => {
//     const colors = {
//       purchase: "from-green-500 to-emerald-600",
//       specific: "from-blue-500 to-cyan-600",
//       comparison: "from-purple-500 to-indigo-600",
//       exploratory: "from-orange-500 to-amber-600",
//     };
//     return colors[intent as keyof typeof colors] || "from-gray-500 to-gray-600";
//   };

//   const getSearchIntentIcon = (intent: string) => {
//     switch (intent) {
//       case "purchase":
//         return <Zap className="h-4 w-4" />;
//       case "specific":
//         return <Target className="h-4 w-4" />;
//       case "comparison":
//         return <BarChart3 className="h-4 w-4" />;
//       default:
//         return <Lightbulb className="h-4 w-4" />;
//     }
//   };

//   // Enhanced examples
//   const naturalLanguageExamples = [
//     "Show me all in-stock products from brand Volvo that are under $500",
//     "Find products under $1000 with category 'Air Conditioning'",
//     "List the top 10 most expensive products in stock",
//     "Show products added in the last 30 days",
//     "Find products that contain 'compressor' in the description",
//   ];

//   const enhancedSearchExamples = [
//     "car parts under $100",
//     "hydraulic system components",
//     "display units for retail",
//     "tire accessories and tools",
//     "electrical connectors and wires",
//   ];

//   const semanticSearchExamples = [
//     "water pump replacement",
//     "brake system parts",
//     "engine maintenance kit",
//     "cooling system components",
//     "electrical wiring harness",
//   ];

//   const trendingSearches = [
//     "britezone display",
//     "00200 parts",
//     "hydraulic tools",
//     "automotive accessories",
//     "compressor units",
//   ];

//   const features = [
//     {
//       icon: Brain,
//       label: "AI-Powered",
//       description: "Natural language understanding",
//     },
//     { icon: Zap, label: "Fast", description: "Millisecond response times" },
//     { icon: Shield, label: "Accurate", description: "99.3% precision rate" },
//     { icon: Cpu, label: "Smart", description: "Context-aware results" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200/50 mb-6">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-sm font-medium text-gray-700">
//               AI Assistant Online
//             </span>
//           </div>
//           <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
//             Intelligent Product Search
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Discover exactly what you need with AI-powered search that
//             understands your business language
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Left Sidebar - Features & Examples */}
//           <div className="space-y-6">
//             {/* Search Modes */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Sparkles className="h-5 w-5 text-purple-600" />
//                 <span>Search Mode</span>
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   {
//                     key: "enhanced",
//                     label: "Smart Search",
//                     icon: Brain,
//                     description: "AI-powered recommendations",
//                     color: "from-purple-500 to-purple-600",
//                   },
//                   {
//                     key: "natural",
//                     label: "Natural SQL",
//                     icon: MessageSquare,
//                     description: "Plain English to SQL",
//                     color: "from-blue-500 to-blue-600",
//                   },
//                   {
//                     key: "semantic",
//                     label: "Semantic",
//                     icon: Target,
//                     description: "Meaning-based matching",
//                     color: "from-green-500 to-green-600",
//                   },
//                 ].map((mode) => (
//                   <button
//                     key={mode.key}
//                     onClick={() => setSearchMode(mode.key as any)}
//                     className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group ${
//                       searchMode === mode.key
//                         ? `border-gray-300 bg-gradient-to-r ${mode.color} text-white shadow-lg transform scale-105`
//                         : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`p-2 rounded-lg ${
//                           searchMode === mode.key
//                             ? "bg-white/20"
//                             : "bg-gray-100"
//                         }`}
//                       >
//                         <mode.icon
//                           className={`h-5 w-5 ${
//                             searchMode === mode.key
//                               ? "text-white"
//                               : "text-gray-600"
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <div
//                           className={`font-semibold ${
//                             searchMode === mode.key
//                               ? "text-white"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {mode.label}
//                         </div>
//                         <div
//                           className={`text-sm ${
//                             searchMode === mode.key
//                               ? "text-white/90"
//                               : "text-gray-600"
//                           }`}
//                         >
//                           {mode.description}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Features */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Why It's Smart
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {features.map((feature, index) => {
//                   const Icon = feature.icon;
//                   return (
//                     <div
//                       key={index}
//                       className="text-center p-3 bg-gray-50 rounded-lg"
//                     >
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
//                         <Icon className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {feature.label}
//                       </div>
//                       <div className="text-xs text-gray-600 mt-1">
//                         {feature.description}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Quick Examples */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Rocket className="h-5 w-5 text-orange-500" />
//                 <span>Try These</span>
//               </h3>
//               <div className="space-y-3">
//                 {(searchMode === "natural"
//                   ? naturalLanguageExamples
//                   : searchMode === "enhanced"
//                   ? enhancedSearchExamples
//                   : semanticSearchExamples
//                 )
//                   .slice(0, 4)
//                   .map((example, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickSearch(example)}
//                       className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
//                         <span className="text-sm text-gray-700 flex-1">
//                           {example}
//                         </span>
//                         <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//                       </div>
//                     </button>
//                   ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Search Input */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
//               {/* Animated Background */}
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <label className="block text-lg font-semibold text-gray-900">
//                       What are you looking for?
//                     </label>
//                     <div className="flex items-center space-x-2 text-sm text-gray-500">
//                       <Clock className="h-4 w-4" />
//                       <span>Session: {sessionId.substring(0, 8)}...</span>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <textarea
//                       ref={textareaRef}
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder={
//                         searchMode === "natural"
//                           ? "Describe what you need in plain English..."
//                           : searchMode === "enhanced"
//                           ? "Search for products, categories, or specifications..."
//                           : "Find similar products or components..."
//                       }
//                       rows={3}
//                       className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 bg-gray-50/50 backdrop-blur-sm"
//                       disabled={loading}
//                     />

//                     {/* Floating Action Buttons */}
//                     <div className="absolute right-3 top-3 flex space-x-2">
//                       {query && (
//                         <button
//                           type="button"
//                           onClick={clearSearch}
//                           className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                         >
//                           <X className="h-5 w-5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <button
//                     type="submit"
//                     disabled={loading || !query.trim()}
//                     className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 flex items-center space-x-3 group overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                         <span>Searching...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Play className="h-5 w-5" />
//                         <span>Search Products</span>
//                         <Wand2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//                       </>
//                     )}
//                   </button>

//                   <div className="flex space-x-3">
//                     {searchHistory.length > 0 && (
//                       <button
//                         type="button"
//                         onClick={() => setQuery(searchHistory[0])}
//                         disabled={loading}
//                         className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                       >
//                         <Clock className="h-4 w-4" />
//                         <span>History</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Results Section */}
//             {enhancedResult && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                 {/* Search Header */}
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Search Results
//                     </h3>
//                     <p className="text-gray-600 mt-1">
//                       Found{" "}
//                       {enhancedResult.count || enhancedResult.products.length}{" "}
//                       products
//                     </p>
//                   </div>
//                   <div
//                     className={`px-4 py-2 rounded-full bg-gradient-to-r ${getSearchIntentColor(
//                       enhancedResult.searchIntent
//                     )} text-white font-medium flex items-center space-x-2`}
//                   >
//                     {getSearchIntentIcon(enhancedResult.searchIntent)}
//                     <span className="capitalize">
//                       {enhancedResult.searchIntent}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Summary */}
//                 {enhancedResult.summary && (
//                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
//                     <div className="flex items-start space-x-3">
//                       <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
//                       <p className="text-blue-800 leading-relaxed">
//                         {enhancedResult.summary}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Suggested Searches */}
//                 {enhancedResult.suggestedSearches &&
//                   enhancedResult.suggestedSearches.length > 0 && (
//                     <div className="mb-6">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-3">
//                         Related Searches
//                       </h4>
//                       <div className="flex flex-wrap gap-2">
//                         {enhancedResult.suggestedSearches
//                           .slice(0, 6)
//                           .map((suggestion, index) => (
//                             <button
//                               key={index}
//                               onClick={() => handleQuickSearch(suggestion)}
//                               className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full text-sm text-gray-700 transition-all duration-300 hover:scale-105 border border-gray-300/50"
//                             >
//                               {suggestion}
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Results Grid */}
//                 {enhancedResult.products.length > 0 && (
//                   <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                     {enhancedResult.products
//                       .slice(0, 8)
//                       .map((product, index) => (
//                         <div
//                           key={index}
//                           className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                                 {product.title || product.name}
//                               </h4>
//                               <div className="flex items-center space-x-4 mt-2">
//                                 {product.brand && (
//                                   <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
//                                     {product.brand}
//                                   </span>
//                                 )}
//                                 {product.part_number && (
//                                   <span className="text-sm text-gray-500 font-mono">
//                                     #{product.part_number}
//                                   </span>
//                                 )}
//                               </div>
//                               {product.categories && (
//                                 <p className="text-sm text-gray-500 mt-1">
//                                   {product.categories}
//                                 </p>
//                               )}
//                             </div>
//                             {product.price && (
//                               <div className="text-right">
//                                 <div className="text-lg font-bold text-green-600">
//                                   $
//                                   {typeof product.price === "number"
//                                     ? product.price.toFixed(2)
//                                     : product.price}
//                                 </div>
//                                 <div
//                                   className={`text-xs px-2 py-1 rounded-full ${
//                                     product.in_stock
//                                       ? "bg-green-100 text-green-800"
//                                       : "bg-red-100 text-red-800"
//                                   }`}
//                                 >
//                                   {product.in_stock
//                                     ? "In Stock"
//                                     : "Out of Stock"}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     {enhancedResult.products.length > 8 && (
//                       <div className="text-center py-4">
//                         <button className="text-blue-600 hover:text-blue-700 font-semibold">
//                           View all {enhancedResult.products.length} results →
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Natural Language Results */}
//             {result && (
//               <div className="space-y-6">
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Generated SQL
//                     </h3>
//                     <button
//                       onClick={() => copyToClipboard(result.generatedSQL)}
//                       className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       {copied ? (
//                         <CheckCircle className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <Copy className="h-5 w-5" />
//                       )}
//                       <span>{copied ? "Copied!" : "Copy SQL"}</span>
//                     </button>
//                   </div>
//                   <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl text-sm overflow-x-auto border-2 border-gray-800">
//                     {result.generatedSQL}
//                   </pre>
//                   {result.explanation && (
//                     <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
//                       <p className="text-blue-800">{result.explanation}</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Results Summary */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                     Query Results
//                   </h3>
//                   {result.success ? (
//                     <div>
//                       <p className="text-lg text-gray-600 mb-6">
//                         Found {result.count} results for:{" "}
//                         <span className="font-semibold text-gray-900">
//                           "{result.naturalQuery}"
//                         </span>
//                       </p>

//                       {result.results.length > 0 && (
//                         <div className="space-y-4 max-h-96 overflow-y-auto">
//                           {result.results.slice(0, 8).map((row, index) => (
//                             <div
//                               key={index}
//                               className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300"
//                             >
//                               <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
//                                 {JSON.stringify(row, null, 2)}
//                               </pre>
//                             </div>
//                           ))}
//                           {result.results.length > 8 && (
//                             <div className="text-center py-4">
//                               <button className="text-blue-600 hover:text-blue-700 font-semibold">
//                                 View all {result.results.length} results →
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
//                       <div className="flex items-center space-x-3">
//                         <X className="h-6 w-6 text-red-600" />
//                         <div>
//                           <p className="text-red-800 font-semibold text-lg">
//                             Error
//                           </p>
//                           <p className="text-red-700 mt-1">{result.error}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-6">
//             {/* Trending Searches */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <TrendingUp className="h-5 w-5 text-orange-500" />
//                 <span>Trending Now</span>
//               </h3>
//               <div className="space-y-3">
//                 {trendingSearches.map((trend, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQuickSearch(trend)}
//                     className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 transition-all duration-300 group"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-gray-900">
//                         {trend}
//                       </span>
//                       <div className="flex items-center space-x-1">
//                         <Star className="h-3 w-3 text-orange-500" />
//                         <span className="text-xs text-orange-600">
//                           Trending
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Search History */}
//             {searchHistory.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <Clock className="h-5 w-5 text-blue-500" />
//                   <span>Recent Searches</span>
//                 </h3>
//                 <div className="space-y-2">
//                   {searchHistory.map((historyItem, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickSearch(historyItem)}
//                       className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                         <span className="text-sm text-gray-700 flex-1 truncate">
//                           {historyItem}
//                         </span>
//                         <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Tips */}
//             <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
//               <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
//                 <BookOpen className="h-5 w-5" />
//                 <span>Pro Tips</span>
//               </h3>
//               <ul className="space-y-2 text-sm text-blue-100">
//                 <li>• Use specific product names for better results</li>
//                 <li>• Include price ranges when budgeting</li>
//                 <li>• Mention brands for targeted searches</li>
//                 <li>• Use categories to narrow down results</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIQuery;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Brain,
//   Play,
//   Copy,
//   CheckCircle,
//   Search,
//   TrendingUp,
//   Lightbulb,
//   Zap,
//   Target,
//   Clock,
//   BarChart3,
//   Shield,
//   Cpu,
//   MessageSquare,
//   ArrowRight,
//   X,
//   BookOpen,
//   Star,
//   Rocket,
//   Wand2,
// } from "lucide-react";
// import axios from "axios";

// interface QueryResult {
//   success: boolean;
//   naturalQuery: string;
//   generatedSQL: string;
//   explanation: string;
//   results: any[];
//   count: number;
//   error?: string;
// }

// interface SemanticSearchResult {
//   success: boolean;
//   products: any[];
//   suggestedSearches: string[];
//   relatedCategories: string[];
//   searchIntent: "exploratory" | "specific" | "comparison" | "purchase";
//   summary?: string;
//   count?: number;
// }

// const AIQuery: React.FC = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<QueryResult | null>(null);
//   const [semanticResult, setSemanticResult] =
//     useState<SemanticSearchResult | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [searchMode, setSearchMode] = useState<"natural" | "semantic">(
//     "natural"
//   );
//   const [sessionId, setSessionId] = useState<string>("");
//   const [searchHistory, setSearchHistory] = useState<string[]>([]);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   // Generate session ID on component mount
//   useEffect(() => {
//     const newSessionId = `session_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;
//     setSessionId(newSessionId);

//     // Load search history from localStorage
//     const savedHistory = localStorage.getItem("searchHistory");
//     if (savedHistory) {
//       setSearchHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   }, [query]);

//   const saveToHistory = (query: string) => {
//     const newHistory = [
//       query,
//       ...searchHistory.filter((q) => q !== query),
//     ].slice(0, 10);
//     setSearchHistory(newHistory);
//     localStorage.setItem("searchHistory", JSON.stringify(newHistory));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setLoading(true);
//     setResult(null);
//     setSemanticResult(null);
//     saveToHistory(query.trim());

//     try {
//       if (searchMode === "natural") {
//         // Natural language query
//         const response = await axios.post(
//           "http://localhost:4000/query/natural",
//           {
//             query: query.trim(),
//           }
//         );
//         setResult(response.data);
//       } else if (searchMode === "semantic") {
//         // Pure semantic search
//         const response = await axios.get(
//           "http://localhost:4000/query/semantic-search",
//           {
//             params: {
//               q: query.trim(),
//               similarity: 0.7,
//               limit: 20,
//             },
//           }
//         );
//         setSemanticResult({
//           ...response.data,
//           products: response.data.results,
//           searchIntent: "specific",
//         });
//       }
//     } catch (error: any) {
//       const errorResult = {
//         success: false,
//         naturalQuery: query,
//         generatedSQL: "",
//         explanation: "",
//         results: [],
//         count: 0,
//         error: error.response?.data?.error || "An error occurred",
//       };
//       setResult(errorResult);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuickSearch = async (quickQuery: string) => {
//     setQuery(quickQuery);
//     // Auto-focus and submit
//     setTimeout(() => {
//       if (textareaRef.current) {
//         textareaRef.current.focus();
//       }
//       const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
//       handleSubmit(fakeEvent);
//     }, 100);
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const clearSearch = () => {
//     setQuery("");
//     setResult(null);
//     setSemanticResult(null);
//     if (textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   };

//   const getSearchIntentColor = (intent: string) => {
//     const colors = {
//       purchase: "from-green-500 to-emerald-600",
//       specific: "from-blue-500 to-cyan-600",
//       comparison: "from-purple-500 to-indigo-600",
//       exploratory: "from-orange-500 to-amber-600",
//     };
//     return colors[intent as keyof typeof colors] || "from-gray-500 to-gray-600";
//   };

//   const getSearchIntentIcon = (intent: string) => {
//     switch (intent) {
//       case "purchase":
//         return <Zap className="h-4 w-4" />;
//       case "specific":
//         return <Target className="h-4 w-4" />;
//       case "comparison":
//         return <BarChart3 className="h-4 w-4" />;
//       default:
//         return <Lightbulb className="h-4 w-4" />;
//     }
//   };

//   // Examples
//   const naturalLanguageExamples = [
//     "Show me all in-stock products from brand Volvo that are under $500",
//     "Find products under $1000 with category 'Air Conditioning'",
//     "List the top 10 most expensive products in stock",
//     "Show products added in the last 30 days",
//     "Find products that contain 'compressor' in the description",
//   ];

//   const semanticSearchExamples = [
//     "water pump replacement",
//     "brake system parts",
//     "engine maintenance kit",
//     "cooling system components",
//     "electrical wiring harness",
//   ];

//   const trendingSearches = [
//     "britezone display",
//     "00200 parts",
//     "hydraulic tools",
//     "automotive accessories",
//     "compressor units",
//   ];

//   const features = [
//     {
//       icon: Brain,
//       label: "AI-Powered",
//       description: "Natural language understanding",
//     },
//     { icon: Zap, label: "Fast", description: "Millisecond response times" },
//     { icon: Shield, label: "Accurate", description: "99.3% precision rate" },
//     { icon: Cpu, label: "Smart", description: "Context-aware results" },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200/50 mb-6">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-sm font-medium text-gray-700">
//               AI Assistant Online
//             </span>
//           </div>
//           <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
//             Intelligent Product Search
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Discover exactly what you need with AI-powered search that
//             understands your business language
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Left Sidebar - Features & Examples */}
//           <div className="space-y-6">
//             {/* Search Modes */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Brain className="h-5 w-5 text-purple-600" />
//                 <span>Search Mode</span>
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   {
//                     key: "natural",
//                     label: "Natural Language",
//                     icon: MessageSquare,
//                     description: "Plain English to SQL",
//                     color: "from-blue-500 to-blue-600",
//                   },
//                   {
//                     key: "semantic",
//                     label: "Semantic Search",
//                     icon: Target,
//                     description: "Meaning-based matching",
//                     color: "from-green-500 to-green-600",
//                   },
//                 ].map((mode) => (
//                   <button
//                     key={mode.key}
//                     onClick={() => setSearchMode(mode.key as any)}
//                     className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group ${
//                       searchMode === mode.key
//                         ? `border-gray-300 bg-gradient-to-r ${mode.color} text-white shadow-lg transform scale-105`
//                         : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`p-2 rounded-lg ${
//                           searchMode === mode.key
//                             ? "bg-white/20"
//                             : "bg-gray-100"
//                         }`}
//                       >
//                         <mode.icon
//                           className={`h-5 w-5 ${
//                             searchMode === mode.key
//                               ? "text-white"
//                               : "text-gray-600"
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <div
//                           className={`font-semibold ${
//                             searchMode === mode.key
//                               ? "text-white"
//                               : "text-gray-900"
//                           }`}
//                         >
//                           {mode.label}
//                         </div>
//                         <div
//                           className={`text-sm ${
//                             searchMode === mode.key
//                               ? "text-white/90"
//                               : "text-gray-600"
//                           }`}
//                         >
//                           {mode.description}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Features */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Why It's Smart
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {features.map((feature, index) => {
//                   const Icon = feature.icon;
//                   return (
//                     <div
//                       key={index}
//                       className="text-center p-3 bg-gray-50 rounded-lg"
//                     >
//                       <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
//                         <Icon className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {feature.label}
//                       </div>
//                       <div className="text-xs text-gray-600 mt-1">
//                         {feature.description}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Quick Examples */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <Rocket className="h-5 w-5 text-orange-500" />
//                 <span>Try These</span>
//               </h3>
//               <div className="space-y-3">
//                 {(searchMode === "natural"
//                   ? naturalLanguageExamples
//                   : semanticSearchExamples
//                 )
//                   .slice(0, 4)
//                   .map((example, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickSearch(example)}
//                       className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
//                         <span className="text-sm text-gray-700 flex-1">
//                           {example}
//                         </span>
//                         <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//                       </div>
//                     </button>
//                   ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Search Input */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
//               {/* Animated Background */}
//               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <label className="block text-lg font-semibold text-gray-900">
//                       What are you looking for?
//                     </label>
//                     <div className="flex items-center space-x-2 text-sm text-gray-500">
//                       <Clock className="h-4 w-4" />
//                       <span>Session: {sessionId.substring(0, 8)}...</span>
//                     </div>
//                   </div>

//                   <div className="relative">
//                     <textarea
//                       ref={textareaRef}
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder={
//                         searchMode === "natural"
//                           ? "Describe what you need in plain English..."
//                           : "Find similar products or components..."
//                       }
//                       rows={3}
//                       className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 bg-gray-50/50 backdrop-blur-sm"
//                       disabled={loading}
//                     />

//                     {/* Floating Action Buttons */}
//                     <div className="absolute right-3 top-3 flex space-x-2">
//                       {query && (
//                         <button
//                           type="button"
//                           onClick={clearSearch}
//                           className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                         >
//                           <X className="h-5 w-5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <button
//                     type="submit"
//                     disabled={loading || !query.trim()}
//                     className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 flex items-center space-x-3 group overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                         <span>Searching...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Play className="h-5 w-5" />
//                         <span>Search Products</span>
//                         <Wand2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//                       </>
//                     )}
//                   </button>

//                   <div className="flex space-x-3">
//                     {searchHistory.length > 0 && (
//                       <button
//                         type="button"
//                         onClick={() => setQuery(searchHistory[0])}
//                         disabled={loading}
//                         className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//                       >
//                         <Clock className="h-4 w-4" />
//                         <span>History</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Semantic Results Section */}
//             {semanticResult && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                 {/* Search Header */}
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Search Results
//                     </h3>
//                     <p className="text-gray-600 mt-1">
//                       Found{" "}
//                       {semanticResult.count || semanticResult.products.length}{" "}
//                       products
//                     </p>
//                   </div>
//                   <div
//                     className={`px-4 py-2 rounded-full bg-gradient-to-r ${getSearchIntentColor(
//                       semanticResult.searchIntent
//                     )} text-white font-medium flex items-center space-x-2`}
//                   >
//                     {getSearchIntentIcon(semanticResult.searchIntent)}
//                     <span className="capitalize">
//                       {semanticResult.searchIntent}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Summary */}
//                 {semanticResult.summary && (
//                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
//                     <div className="flex items-start space-x-3">
//                       <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
//                       <p className="text-blue-800 leading-relaxed">
//                         {semanticResult.summary}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Suggested Searches */}
//                 {semanticResult.suggestedSearches &&
//                   semanticResult.suggestedSearches.length > 0 && (
//                     <div className="mb-6">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-3">
//                         Related Searches
//                       </h4>
//                       <div className="flex flex-wrap gap-2">
//                         {semanticResult.suggestedSearches
//                           .slice(0, 6)
//                           .map((suggestion, index) => (
//                             <button
//                               key={index}
//                               onClick={() => handleQuickSearch(suggestion)}
//                               className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full text-sm text-gray-700 transition-all duration-300 hover:scale-105 border border-gray-300/50"
//                             >
//                               {suggestion}
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Results Grid */}
//                 {semanticResult.products.length > 0 && (
//                   <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                     {semanticResult.products
//                       .slice(0, 8)
//                       .map((product, index) => (
//                         <div
//                           key={index}
//                           className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                                 {product.title || product.name}
//                               </h4>
//                               <div className="flex items-center space-x-4 mt-2">
//                                 {product.brand && (
//                                   <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
//                                     {product.brand}
//                                   </span>
//                                 )}
//                                 {product.part_number && (
//                                   <span className="text-sm text-gray-500 font-mono">
//                                     #{product.part_number}
//                                   </span>
//                                 )}
//                               </div>
//                               {product.categories && (
//                                 <p className="text-sm text-gray-500 mt-1">
//                                   {product.categories}
//                                 </p>
//                               )}
//                             </div>
//                             {product.price && (
//                               <div className="text-right">
//                                 <div className="text-lg font-bold text-green-600">
//                                   $
//                                   {typeof product.price === "number"
//                                     ? product.price.toFixed(2)
//                                     : product.price}
//                                 </div>
//                                 <div
//                                   className={`text-xs px-2 py-1 rounded-full ${
//                                     product.in_stock
//                                       ? "bg-green-100 text-green-800"
//                                       : "bg-red-100 text-red-800"
//                                   }`}
//                                 >
//                                   {product.in_stock
//                                     ? "In Stock"
//                                     : "Out of Stock"}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     {semanticResult.products.length > 8 && (
//                       <div className="text-center py-4">
//                         <button className="text-blue-600 hover:text-blue-700 font-semibold">
//                           View all {semanticResult.products.length} results →
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Natural Language Results */}
//             {result && (
//               <div className="space-y-6">
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-2xl font-bold text-gray-900">
//                       Generated SQL
//                     </h3>
//                     <button
//                       onClick={() => copyToClipboard(result.generatedSQL)}
//                       className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                     >
//                       {copied ? (
//                         <CheckCircle className="h-5 w-5 text-green-600" />
//                       ) : (
//                         <Copy className="h-5 w-5" />
//                       )}
//                       <span>{copied ? "Copied!" : "Copy SQL"}</span>
//                     </button>
//                   </div>
//                   <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl text-sm overflow-x-auto border-2 border-gray-800">
//                     {result.generatedSQL}
//                   </pre>
//                   {result.explanation && (
//                     <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
//                       <p className="text-blue-800">{result.explanation}</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Results Summary */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                     Query Results
//                   </h3>
//                   {result.success ? (
//                     <div>
//                       <p className="text-lg text-gray-600 mb-6">
//                         Found {result.count} results for:{" "}
//                         <span className="font-semibold text-gray-900">
//                           "{result.naturalQuery}"
//                         </span>
//                       </p>

//                       {result.results.length > 0 && (
//                         <div className="space-y-4 max-h-96 overflow-y-auto">
//                           {result.results.slice(0, 8).map((row, index) => (
//                             <div
//                               key={index}
//                               className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300"
//                             >
//                               <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
//                                 {JSON.stringify(row, null, 2)}
//                               </pre>
//                             </div>
//                           ))}
//                           {result.results.length > 8 && (
//                             <div className="text-center py-4">
//                               <button className="text-blue-600 hover:text-blue-700 font-semibold">
//                                 View all {result.results.length} results →
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
//                       <div className="flex items-center space-x-3">
//                         <X className="h-6 w-6 text-red-600" />
//                         <div>
//                           <p className="text-red-800 font-semibold text-lg">
//                             Error
//                           </p>
//                           <p className="text-red-700 mt-1">{result.error}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-6">
//             {/* Trending Searches */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                 <TrendingUp className="h-5 w-5 text-orange-500" />
//                 <span>Trending Now</span>
//               </h3>
//               <div className="space-y-3">
//                 {trendingSearches.map((trend, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQuickSearch(trend)}
//                     className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 transition-all duration-300 group"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-gray-900">
//                         {trend}
//                       </span>
//                       <div className="flex items-center space-x-1">
//                         <Star className="h-3 w-3 text-orange-500" />
//                         <span className="text-xs text-orange-600">
//                           Trending
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Search History */}
//             {searchHistory.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                   <Clock className="h-5 w-5 text-blue-500" />
//                   <span>Recent Searches</span>
//                 </h3>
//                 <div className="space-y-2">
//                   {searchHistory.map((historyItem, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleQuickSearch(historyItem)}
//                       className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                         <span className="text-sm text-gray-700 flex-1 truncate">
//                           {historyItem}
//                         </span>
//                         <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Tips */}
//             <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
//               <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
//                 <BookOpen className="h-5 w-5" />
//                 <span>Pro Tips</span>
//               </h3>
//               <ul className="space-y-2 text-sm text-blue-100">
//                 <li>• Use specific product names for better results</li>
//                 <li>• Include price ranges when budgeting</li>
//                 <li>• Mention brands for targeted searches</li>
//                 <li>• Use categories to narrow down results</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIQuery;

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Play,
  Copy,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Zap,
  Target,
  Clock,
  BarChart3,
  Shield,
  Cpu,
  MessageSquare,
  ArrowRight,
  X,
  BookOpen,
  Star,
  Rocket,
  Wand2,
  Edit3,
  Save,
} from "lucide-react";
import axios from "axios";

interface QueryResult {
  success: boolean;
  naturalQuery: string;
  generatedSQL: string;
  explanation: string;
  results: any[];
  count: number;
  error?: string;
}

interface SemanticSearchResult {
  success: boolean;
  products: any[];
  suggestedSearches: string[];
  relatedCategories: string[];
  searchIntent: "exploratory" | "specific" | "comparison" | "purchase";
  summary?: string;
  count?: number;
}

const AIQuery: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [semanticResult, setSemanticResult] =
    useState<SemanticSearchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchMode, setSearchMode] = useState<"natural" | "semantic">(
    "natural"
  );
  const [sessionId, setSessionId] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Default system prompt
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant for a product database. Convert natural language queries into SQL. " +
      "The database has tables for products, categories, brands, and inventory. " +
      "Always prioritize in-stock items and include relevant product details like name, price, brand, and category."
  );

  // Generate session ID on component mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setSessionId(newSessionId);

    // Load search history from localStorage
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Load saved prompt from localStorage
    const savedPrompt = localStorage.getItem("systemPrompt");
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [query]);

  const saveToHistory = (query: string) => {
    const newHistory = [
      query,
      ...searchHistory.filter((q) => q !== query),
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const savePrompt = () => {
    localStorage.setItem("systemPrompt", systemPrompt);
    setIsEditingPrompt(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setSemanticResult(null);
    saveToHistory(query.trim());

    try {
      if (searchMode === "natural") {
        // Natural language query with system prompt
        const response = await axios.post(
          "http://localhost:4000/query/natural",
          {
            query: query.trim(),
            systemPrompt: systemPrompt, // Send the custom prompt
          }
        );
        setResult(response.data);
      } else if (searchMode === "semantic") {
        // Pure semantic search
        const response = await axios.get(
          "http://localhost:4000/query/semantic-search",
          {
            params: {
              q: query.trim(),
              similarity: 0.7,
              limit: 20,
            },
          }
        );
        setSemanticResult({
          ...response.data,
          products: response.data.results,
          searchIntent: "specific",
        });
      }
    } catch (error: any) {
      const errorResult = {
        success: false,
        naturalQuery: query,
        generatedSQL: "",
        explanation: "",
        results: [],
        count: 0,
        error: error.response?.data?.error || "An error occurred",
      };
      setResult(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async (quickQuery: string) => {
    setQuery(quickQuery);
    // Auto-focus and submit
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearSearch = () => {
    setQuery("");
    setResult(null);
    setSemanticResult(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getSearchIntentColor = (intent: string) => {
    const colors = {
      purchase: "from-green-500 to-emerald-600",
      specific: "from-blue-500 to-cyan-600",
      comparison: "from-purple-500 to-indigo-600",
      exploratory: "from-orange-500 to-amber-600",
    };
    return colors[intent as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getSearchIntentIcon = (intent: string) => {
    switch (intent) {
      case "purchase":
        return <Zap className="h-4 w-4" />;
      case "specific":
        return <Target className="h-4 w-4" />;
      case "comparison":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Format product data for display
  const formatProductData = (product: any) => {
    return {
      name:
        product.name ||
        product.title ||
        product.product_name ||
        "Unknown Product",
      brand: product.brand || product.manufacturer || "Unknown Brand",
      price: product.price
        ? `$${
            typeof product.price === "number"
              ? product.price.toFixed(2)
              : product.price
          }`
        : "Price not available",
      category: product.category || product.categories || "Uncategorized",
      inStock:
        product.in_stock !== undefined
          ? product.in_stock
          : product.stock_quantity > 0,
      description: product.description || product.short_description || "",
      partNumber: product.part_number || product.sku || "N/A",
    };
  };

  // Examples
  const naturalLanguageExamples = [
    "Show me all in-stock products from brand Volvo that are under $500",
    "Find products under $1000 with category 'Air Conditioning'",
    "List the top 10 most expensive products in stock",
    "Show products added in the last 30 days",
    "Find products that contain 'compressor' in the description",
  ];

  const semanticSearchExamples = [
    "water pump replacement",
    "brake system parts",
    "engine maintenance kit",
    "cooling system components",
    "electrical wiring harness",
  ];

  const trendingSearches = [
    "britezone display",
    "00200 parts",
    "hydraulic tools",
    "automotive accessories",
    "compressor units",
  ];

  const features = [
    {
      icon: Brain,
      label: "AI-Powered",
      description: "Natural language understanding",
    },
    { icon: Zap, label: "Fast", description: "Millisecond response times" },
    { icon: Shield, label: "Accurate", description: "99.3% precision rate" },
    { icon: Cpu, label: "Smart", description: "Context-aware results" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200/50 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              AI Assistant Online
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Intelligent Product Search
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exactly what you need with AI-powered search that
            understands your business language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Features & Examples */}
          <div className="space-y-6">
            {/* Search Modes */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Search Mode</span>
              </h3>
              <div className="space-y-3">
                {[
                  {
                    key: "natural",
                    label: "Natural Language",
                    icon: MessageSquare,
                    description: "Plain English to SQL",
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    key: "semantic",
                    label: "Semantic Search",
                    icon: Target,
                    description: "Meaning-based matching",
                    color: "from-green-500 to-green-600",
                  },
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setSearchMode(mode.key as any)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group ${
                      searchMode === mode.key
                        ? `border-gray-300 bg-gradient-to-r ${mode.color} text-white shadow-lg transform scale-105`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          searchMode === mode.key
                            ? "bg-white/20"
                            : "bg-gray-100"
                        }`}
                      >
                        <mode.icon
                          className={`h-5 w-5 ${
                            searchMode === mode.key
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <div
                          className={`font-semibold ${
                            searchMode === mode.key
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {mode.label}
                        </div>
                        <div
                          className={`text-sm ${
                            searchMode === mode.key
                              ? "text-white/90"
                              : "text-gray-600"
                          }`}
                        >
                          {mode.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why It's Smart
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="text-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {feature.label}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {feature.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Examples */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Rocket className="h-5 w-5 text-orange-500" />
                <span>Try These</span>
              </h3>
              <div className="space-y-3">
                {(searchMode === "natural"
                  ? naturalLanguageExamples
                  : semanticSearchExamples
                )
                  .slice(0, 4)
                  .map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(example)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                        <span className="text-sm text-gray-700 flex-1">
                          {example}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Prompt */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI System Prompt</span>
                </h3>
                <div className="flex space-x-2">
                  {isEditingPrompt ? (
                    <>
                      <button
                        onClick={savePrompt}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setIsEditingPrompt(false)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingPrompt(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {isEditingPrompt ? (
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300 bg-gray-50/50"
                  placeholder="Enter your custom system prompt..."
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {systemPrompt}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                This prompt guides the AI on how to interpret your queries
              </p>
            </div>

            {/* Search Input */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-lg font-semibold text-gray-900">
                      What are you looking for?
                    </label>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Session: {sessionId.substring(0, 8)}...</span>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        searchMode === "natural"
                          ? "Describe what you need in plain English..."
                          : "Find similar products or components..."
                      }
                      rows={3}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 bg-gray-50/50 backdrop-blur-sm"
                      disabled={loading}
                    />

                    {/* Floating Action Buttons */}
                    <div className="absolute right-3 top-3 flex space-x-2">
                      {query && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 flex items-center space-x-3 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        <span>Search Products</span>
                        <Wand2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </button>

                  <div className="flex space-x-3">
                    {searchHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setQuery(searchHistory[0])}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Clock className="h-4 w-4" />
                        <span>History</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Semantic Results Section */}
            {semanticResult && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {/* Search Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Search Results
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Found{" "}
                      {semanticResult.count || semanticResult.products.length}{" "}
                      products
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full bg-gradient-to-r ${getSearchIntentColor(
                      semanticResult.searchIntent
                    )} text-white font-medium flex items-center space-x-2`}
                  >
                    {getSearchIntentIcon(semanticResult.searchIntent)}
                    <span className="capitalize">
                      {semanticResult.searchIntent}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                {semanticResult.summary && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-blue-800 leading-relaxed">
                        {semanticResult.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Suggested Searches */}
                {semanticResult.suggestedSearches &&
                  semanticResult.suggestedSearches.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Related Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {semanticResult.suggestedSearches
                          .slice(0, 6)
                          .map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickSearch(suggestion)}
                              className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-full text-sm text-gray-700 transition-all duration-300 hover:scale-105 border border-gray-300/50"
                            >
                              {suggestion}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Results Grid */}
                {semanticResult.products.length > 0 && (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {semanticResult.products
                      .slice(0, 8)
                      .map((product, index) => {
                        const formattedProduct = formatProductData(product);
                        return (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {formattedProduct.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formattedProduct.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                    {formattedProduct.brand}
                                  </span>
                                  <span className="text-sm text-gray-500 font-mono">
                                    #{formattedProduct.partNumber}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formattedProduct.category}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-green-600">
                                  {formattedProduct.price}
                                </div>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    formattedProduct.inStock
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {formattedProduct.inStock
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {semanticResult.products.length > 8 && (
                      <div className="text-center py-4">
                        <button className="text-blue-600 hover:text-blue-700 font-semibold">
                          View all {semanticResult.products.length} results →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Natural Language Results */}
            {result && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Generated SQL
                    </h3>
                    <button
                      onClick={() => copyToClipboard(result.generatedSQL)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                      <span>{copied ? "Copied!" : "Copy SQL"}</span>
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl text-sm overflow-x-auto border-2 border-gray-800">
                    {result.generatedSQL}
                  </pre>
                  {result.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-blue-800">{result.explanation}</p>
                    </div>
                  )}
                </div>

                {/* Results Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Query Results
                  </h3>
                  {result.success ? (
                    <div>
                      <p className="text-lg text-gray-600 mb-6">
                        Found {result.count} results for:{" "}
                        <span className="font-semibold text-gray-900">
                          "{result.naturalQuery}"
                        </span>
                      </p>

                      {result.results.length > 0 && (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {result.results.slice(0, 8).map((row, index) => {
                            const product = formatProductData(row);
                            return (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {product.name}
                                    </h4>
                                    <div className="flex items-center space-x-4 mt-2">
                                      <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                        {product.brand}
                                      </span>
                                      <span className="text-sm text-gray-500 font-mono">
                                        #{product.partNumber}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {product.category}
                                      </span>
                                    </div>
                                    {product.description && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        {product.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="text-lg font-bold text-green-600">
                                      {product.price}
                                    </div>
                                    <div
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        product.inStock
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {product.inStock
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {result.results.length > 8 && (
                            <div className="text-center py-4">
                              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                                View all {result.results.length} results →
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <X className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="text-red-800 font-semibold text-lg">
                            Error
                          </p>
                          <p className="text-red-700 mt-1">{result.error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Trending Searches */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span>Trending Now</span>
              </h3>
              <div className="space-y-3">
                {trendingSearches.map((trend, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(trend)}
                    className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {trend}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">
                          Trending
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Recent Searches</span>
                </h3>
                <div className="space-y-2">
                  {searchHistory.map((historyItem, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(historyItem)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 flex-1 truncate">
                          {historyItem}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Pro Tips</span>
              </h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Use specific product names for better results</li>
                <li>• Include price ranges when budgeting</li>
                <li>• Mention brands for targeted searches</li>
                <li>• Use categories to narrow down results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuery;

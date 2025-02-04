import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { debounce } from 'lodash';

interface Deal {
  id: string;
  product_name: string;
  title: string;
  savings: number;
  requiresNewSignup: boolean;
  searchTerms: string[];
  redeems_count: number;
  active: boolean;
}

const StartupCalculator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTools, setSelectedTools] = useState<Deal[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load deals data
  useEffect(() => {
    const mockDeals = [
      {
        id: "replit",
        product_name: "Replit",
        title: "1 month free on Teams plan (3 seats)",
        savings: 50000,
        requiresNewSignup: true,
        searchTerms: ["replit", "ide", "development"],
        redeems_count: 0,
        active: true
      },
      {
        id: "aws",
        product_name: "AWS",
        title: "$5,000 in credits for 2 years",
        savings: 300000,
        requiresNewSignup: true,
        searchTerms: ["aws", "amazon", "cloud"],
        redeems_count: 0,
        active: true
      },
      // Add more deals as needed
    ];

    setDeals(mockDeals);
    setLoading(false);
  }, []);

  // Handle searching
  const debouncedSearch = useCallback(
    debounce((searchTerm: string, deals: Deal[], selectedTools: Deal[]) => {
      if (!searchTerm || searchTerm.length < 2) {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      const normalizedSearch = searchTerm.toLowerCase();
      const results = deals
        .filter(deal => 
          !selectedTools.find(t => t.id === deal.id) &&
          (deal.product_name.toLowerCase().includes(normalizedSearch) ||
           deal.title.toLowerCase().includes(normalizedSearch) ||
           deal.searchTerms.some(term => term.includes(normalizedSearch)))
        );

      setSearchResults(results);
      setSearching(false);
    }, 300),
    []
  );

  useEffect(() => {
    setSearching(true);
    debouncedSearch(searchTerm, deals, selectedTools);
  }, [searchTerm, deals, selectedTools, debouncedSearch]);

  const handleAddTool = (tool: Deal) => {
    if (!selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolId));
  };

  const formatSavings = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getImmediateSavings = () => {
    return selectedTools
      .filter(tool => !tool.requiresNewSignup)
      .reduce((sum, tool) => sum + tool.savings, 0);
  };

  const getNewUserSavings = () => {
    return selectedTools
      .filter(tool => tool.requiresNewSignup)
      .reduce((sum, tool) => sum + tool.savings, 0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
          <CardTitle className="text-2xl text-white">Startup Stage Calculator</CardTitle>
          <p className="text-gray-400 mt-2">
            Calculate your potential savings on essential startup tools
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6 bg-gray-900">
          {/* Search */}
          <div className="relative">
            <div className="flex items-center border border-gray-700 rounded-lg p-2 bg-gray-800">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for tools (e.g., AWS, Stripe)..."
                className="w-full bg-gray-800 text-gray-200 outline-none placeholder-gray-500"
                disabled={loading}
              />
              {searching && (
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {searchTerm.length >= 2 && (
              <div className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                {searchResults.length > 0 ? (
                  searchResults.map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => handleAddTool(tool)}
                      className="p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-200">{tool.product_name}</div>
                          <div className="text-sm text-gray-400">{tool.title}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm font-medium text-blue-400">
                              Save {formatSavings(tool.savings)}
                            </span>
                            {tool.requiresNewSignup ? (
                              <span className="px-2 py-1 text-xs bg-amber-900/50 text-amber-200 rounded-full">
                                New users
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-green-900/50 text-green-200 rounded-full">
                                Available now
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-400">
                    No matches found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Tools */}
          <div className="space-y-4">
            {selectedTools.map(tool => (
              <div
                key={tool.id}
                className="flex justify-between items-start p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-200">{tool.product_name}</h4>
                    {tool.requiresNewSignup ? (
                      <span className="px-2 py-1 text-xs bg-amber-900/50 text-amber-200 rounded-full">
                        New users
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-900/50 text-green-200 rounded-full">
                        Available now
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{tool.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-400">
                    {formatSavings(tool.savings)}
                  </span>
                  <button
                    onClick={() => handleRemoveTool(tool.id)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {selectedTools.length > 0 && (
            <div className="border-t border-gray-800 pt-6 mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {getImmediateSavings() > 0 && (
                  <div className="p-4 bg-green-900/20 rounded-lg border border-green-800">
                    <h3 className="text-sm font-medium text-green-200">Available Now</h3>
                    <p className="text-2xl font-bold text-green-400 mt-1">
                      {formatSavings(getImmediateSavings())}
                    </p>
                    <p className="text-xs text-green-300 mt-1">Ready to claim</p>
                  </div>
                )}
                
                {getNewUserSavings() > 0 && (
                  <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-800">
                    <h3 className="text-sm font-medium text-amber-200">New User Savings</h3>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      {formatSavings(getNewUserSavings())}
                    </p>
                    <p className="text-xs text-amber-300 mt-1">With new signups</p>
                  </div>
                )}
              </div>

              <div className="text-center mt-6">
                <p className="text-lg font-medium text-white">
                  Total Potential Savings
                </p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {formatSavings(getImmediateSavings() + getNewUserSavings())}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  With {selectedTools.length} selected tools
                </p>
                <a
                  href="https://startupstage.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Claim Your Savings
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupCalculator;
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getItemStatistics } from '../services/itemService';
import { formatDate } from '../utils/dateUtils';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DataAnalysis = () => {
  const [statistics, setStatistics] = useState({
    year: new Date().getFullYear().toString(),
    availableYears: [],
    total: {
      collected: 0,
      delivered: 0
    },
    monthly: []
  });
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getItemStatistics(selectedYear);
        
        console.log('Received statistics data:', data);
        console.log('Available years:', data.availableYears);
        
        // Log each month's data for debugging
        if (data.monthly && data.monthly.length > 0) {
          console.log('Monthly data details:');
          data.monthly.forEach(month => {
            console.log(`Month ${month.month} (${monthNames[month.month - 1]}): Collected=${month.collected}, Delivered=${month.delivered}`);
          });
        }
        
        // Transform monthly data to include month names and ensure it's sorted by month
        const transformedMonthlyData = data.monthly
          .map(item => ({
            ...item,
            name: monthNames[item.month - 1]
          }))
          .sort((a, b) => a.month - b.month); // Ensure months are in order
        
        console.log('Transformed monthly data:', transformedMonthlyData);
        
        setStatistics({
          ...data,
          monthly: transformedMonthlyData
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to fetch statistics');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedYear]);

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    const currentYear = new Date().getFullYear();
    
    // Prevent future years
    if (year > currentYear) {
      setSelectedYear(currentYear.toString());
    } else {
      setSelectedYear(e.target.value);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading statistics...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Data Analysis on Found Items</h1>
      
      <div className="flex flex-wrap -mx-4 mb-8">
        <div className="w-full md:w-1/3 px-4 mb-4">
          {/* Year Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statistics.availableYears && statistics.availableYears.length > 0 ? (
                statistics.availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              ) : (
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()} (Current Year)
                </option>
              )}
            </select>
            {statistics.availableYears && statistics.availableYears.length <= 1 && (
              <p className="text-xs text-gray-500 mt-2">
                Only the current year is available as there are no items from previous years.
              </p>
            )}
          </div>
        </div>
        
        {/* Total Items Collected Box */}
        <div className="w-full md:w-1/3 px-4 mb-4">
          <div className="bg-blue-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Items Found</h3>
            <p className="text-4xl font-bold text-blue-600">{statistics.total.collected}</p>
            <p className="text-sm text-blue-700 mt-2">Total items found in {selectedYear}</p>
          </div>
        </div>
        
        {/* Total Items Returned Box */}
        <div className="w-full md:w-1/3 px-4 mb-4">
          <div className="bg-green-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Items Delivered</h3>
            <p className="text-4xl font-bold text-green-600">{statistics.total.delivered}</p>
            <p className="text-sm text-green-700 mt-2">Total items delivered in {selectedYear}</p>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Breakdown</h2>
        <div className="h-96">
          {statistics.monthly && statistics.monthly.length > 0 && 
           statistics.monthly.some(item => item.collected > 0 || item.delivered > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statistics.monthly}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 25,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={60}
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'collected') return [`${value} items found`, 'Items Collected'];
                    if (name === 'delivered') return [`${value} items delivered`, 'Items Returned'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar dataKey="collected" name="Items Collected" fill="#3B82F6" />
                <Bar dataKey="delivered" name="Items Returned" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-xl mb-2">No data available for {selectedYear}</p>
                <p className="text-sm">Select a different year or add items with found dates in {selectedYear}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Summary</h2>
        <div className="text-gray-700">
          <p className="mb-2">
            <span className="font-semibold">Items Collected:</span> A total of {statistics.total.collected} items were found and submitted to the lost and found during {selectedYear}.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Items Delivered:</span> {statistics.total.delivered} items were successfully returned to their owners.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Return Rate:</span> {
              statistics.total.collected > 0
                ? Math.round((statistics.total.delivered / statistics.total.collected) * 100)
                : 0
            }% of found items were returned to their owners.
          </p>
          <p className="mb-2">
            <span className="font-semibold">Pending Items:</span> {statistics.total.collected - statistics.total.delivered} items are still pending return.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis; 
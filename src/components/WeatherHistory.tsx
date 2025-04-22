import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type WeatherData = {
  date: string;
  uv: number;
  temperature: number;
};

type Props = {
  latitude?: number;
  longitude?: number;
}

const WeatherHistory: React.FC<Props> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real application, we would fetch from an actual weather API using the location
    // For this demo, we'll generate mock data
    setIsLoading(true);

    // Generate some realistic mock data based on selected period
    const generateMockData = () => {
      const data: WeatherData[] = [];
      const now = new Date();
      const daysToGenerate = period === 'week' ? 7 : period === 'month' ? 30 : 365;
      
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Higher in summer months (northern hemisphere)
        const month = date.getMonth();
        let baseUV = 3; // Base UV level
        
        // Seasonal adjustment (higher in summer, lower in winter)
        if (month >= 4 && month <= 8) { // May to September
          baseUV = 8;
        } else if (month >= 9 || month <= 2) { // October to March
          baseUV = 3;
        } else {
          baseUV = 5; // Transition months
        }
        
        // Daily and random variations
        const hourOfDay = date.getHours();
        const dayAdjustment = (hourOfDay >= 10 && hourOfDay <= 16) ? 2 : -1;
        const randomVariation = Math.random() * 2 - 1; // -1 to +1
        
        const uv = Math.max(0, Math.min(12, baseUV + dayAdjustment + randomVariation));
        const temperature = baseUV * 3 + Math.random() * 5 - 2; // Correlate temperature with UV
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          uv: Number(uv.toFixed(1)),
          temperature: Number(temperature.toFixed(1))
        });
      }

      return data;
    };

    // Simulate API delay
    setTimeout(() => {
      const mockData = generateMockData();
      setWeatherData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [period, latitude, longitude]);

  const config = {
    uv: { label: "UV Index", color: "#f97316" },
    temperature: { label: "Temperature (°C)", color: "#0ea5e9" },
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">UV & Weather History</h3>
        <Tabs defaultValue="week" value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="h-100 w-full flex items-center justify-center"> {/* Increased height */}
          <div className="text-muted-foreground">Loading weather data...</div>
        </div>
      ) : (
        <div className="h-100 w-full"> {/* Increased height */}
          <ChartContainer config={config}>
            <>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weatherData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={period === 'week' ? 0 : period === 'month' ? 2 : 30} 
                  />
                  <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="uv"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 6 }}
                    name="UV Index"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend>
                <ChartLegendContent />
              </ChartLegend>
            </>
          </ChartContainer>
        </div>
      )}
      <div className="mt-3 text-xs text-muted-foreground">
        <p>Note: Historical UV data can help determine optimal water purification system requirements.</p>
      </div>
    </Card>
  );
};

export default WeatherHistory;

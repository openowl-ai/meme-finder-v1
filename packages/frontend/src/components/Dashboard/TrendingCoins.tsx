```tsx
    import { useQuery } from '@tanstack/react-query';
    import * as d3 from 'd3';
    import { useEffect, useRef } from 'react';

    interface TrendingCoin {
      symbol: string;
      velocity: number;
      sentiment: number;
      price: number;
      priceChange24h: number;
    }

    export const TrendingCoins = () => {
      const { data, isLoading } = useQuery<TrendingCoin[]>({
        queryKey: ['trending-coins'],
        queryFn: async () => {
          const response = await fetch('/api/trending');
          return response.json();
        },
        refetchInterval: 30000 // Refresh every 30 seconds
      });

      const svgRef = useRef<SVGSVGElement | null>(null);

      useEffect(() => {
        if (!data || !svgRef.current) return;

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
          .domain(data.map(d => d.symbol))
          .range([0, width])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.velocity) || 0])
          .range([height, 0]);

        svg.selectAll('.bar')
          .data(data)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.symbol) || 0)
          .attr('y', d => y(d.velocity))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.velocity))
          .attr('fill', 'steelblue')
          .on('mouseover', (event, d) => {
            d3.select(event.currentTarget)
              .attr('fill', 'orange');
          })
          .on('mouseout', (event, d) => {
            d3.select(event.currentTarget)
              .attr('fill', 'steelblue');
          });

        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));

        svg.append('g')
          .call(d3.axisLeft(y));

      }, [data]);

      if (isLoading) {
        return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
      }

      return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Trending Coins</h2>
          <svg ref={svgRef}></svg>
        </div>
      );
    }

    ```

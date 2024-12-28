```typescript
    import { BacktestStrategy, TradeSignal } from './strategy';

    interface OptimizationResult {
      params: any;
      metrics: any;
    }

    export class StrategyOptimizer {
      async optimize(
        symbol: string,
        startDate: Date,
        endDate: Date,
        populationSize: number = 50,
        generations: number = 100
      ): Promise<OptimizationResult> {
        const initialPopulation = this.generateInitialPopulation(populationSize);
        let bestSolution: OptimizationResult = { params: {}, metrics: {} };

        for (let i = 0; i < generations; i++) {
          const evaluatedPopulation = await this.evaluatePopulation(symbol, startDate, endDate, initialPopulation);
          const { best, nextGeneration } = this.selectAndReproduce(evaluatedPopulation);

          if (best.metrics.totalReturn > (bestSolution.metrics.totalReturn || 0)) {
            bestSolution = best;
          }

          initialPopulation.length = 0;
          initialPopulation.push(...nextGeneration);
        }

        return bestSolution;
      }

      private generateInitialPopulation(size: number): any[] {
        const population = [];
        for (let i = 0; i < size; i++) {
          population.push({
            mentionThreshold: Math.random() * 100,
            sentimentThreshold: Math.random(),
            scamThreshold: Math.random()
          });
        }
        return population;
      }

      private async evaluatePopulation(
        symbol: string,
        startDate: Date,
        endDate: Date,
        population: any[]
      ): Promise<Array<{ params: any; metrics: any }>> {
        const backtestService = new BacktestStrategy();
        const results = await Promise.all(population.map(async (params) => {
          const metrics = await backtestService.runBacktest(symbol, startDate, endDate, params);
          return { params, metrics };
        }));
        return results;
      }

      private selectAndReproduce(evaluatedPopulation: Array<{ params: any; metrics: any }>): {
        best: { params: any; metrics: any };
        nextGeneration: any[];
      } {
        evaluatedPopulation.sort((a, b) => b.metrics.totalReturn - a.metrics.totalReturn);
        const best = evaluatedPopulation[0];
        const nextGeneration = evaluatedPopulation.slice(0, evaluatedPopulation.length / 2).map(parent => {
          const child = { ...parent.params };
          Object.keys(child).forEach(key => {
            if (Math.random() > 0.5) {
              child[key] = parent.params[key] * (1 + (Math.random() - 0.5) * 0.1); // Add some mutation
            }
          });
          return child;
        });
        return { best, nextGeneration };
      }
    }

    ```

```typescript
    import OpenAI from 'openai';
    import { promises as fs } from 'fs';

    export class OpenAIFineTuningService {
      private client: OpenAI;

      constructor() {
        this.client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
      }

      async createDatasetFile(dataset: any[], filename: string): Promise<string> {
        const filePath = `/tmp/${filename}`;
        const data = dataset.map(item => JSON.stringify(item)).join('\n');
        await fs.writeFile(filePath, data);
        return filePath;
      }

      async uploadDataset(filePath: string): Promise<string> {
        const file = await this.client.files.create({
          file: fs.createReadStream(filePath),
          purpose: 'fine-tune'
        });
        return file.id;
      }

      async fineTuneModel(fileId: string, model: string = 'gpt-3.5-turbo'): Promise<string> {
        const fineTune = await this.client.fineTuning.jobs.create({
          training_file: fileId,
          model
        });
        return fineTune.id;
      }

      async listFineTunes() {
        const fineTunes = await this.client.fineTuning.jobs.list();
        return fineTunes.data;
      }

      async getFineTuneStatus(fineTuneId: string) {
        const fineTune = await this.client.fineTuning.jobs.retrieve(fineTuneId);
        return fineTune.status;
      }
    }

    // Example usage:
    const fineTuningService = new OpenAIFineTuningService();

    async function runFineTuning() {
      const dataset = [
        { prompt: 'Bitcoin is going to the moon!', completion: 'positive' },
        { prompt: 'This new coin is a rug pull.', completion: 'scam' },
        // Add more examples
      ];
      const filePath = await fineTuningService.createDatasetFile(dataset, 'training_data.jsonl');
      const fileId = await fineTuningService.uploadDataset(filePath);
      const fineTuneId = await fineTuningService.fineTuneModel(fileId);
      console.log('Fine-tuning job created:', fineTuneId);

      // Monitor the fine-tuning job
      const interval = setInterval(async () => {
        const status = await fineTuningService.getFineTuneStatus(fineTuneId);
        console.log('Fine-tuning status:', status);
        if (status === 'succeeded' || status === 'failed') {
          clearInterval(interval);
        }
      }, 10000);
    }

    runFineTuning();

    ```

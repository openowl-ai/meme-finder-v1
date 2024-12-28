```typescript
    import amqp from 'amqplib';
    import { SocialMediaPost } from './types';

    export class IngestionQueue {
      private connection: amqp.Connection | null = null;
      private channel: amqp.Channel | null = null;
      private queueName: string = 'ingestion_queue';

      async initialize() {
        this.connection = await amqp.connect(process.env.RABBITMQ_HOST || 'amqp://localhost');
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queueName, { durable: true });
      }

      async enqueue(post: SocialMediaPost) {
        if (!this.channel) {
          throw new Error('Channel not initialized');
        }
        this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(post)), { persistent: true });
      }

      async startConsumer() {
        if (!this.channel) {
          throw new Error('Channel not initialized');
        }
        this.channel.consume(this.queueName, async (msg) => {
          if (msg) {
            try {
              const post: SocialMediaPost = JSON.parse(msg.content.toString());
              // Process the post (e.g., store in DB, analyze sentiment)
              console.log('Processing post:', post);
              this.channel?.ack(msg);
            } catch (error) {
              console.error('Error processing message:', error);
              this.channel?.nack(msg);
            }
          }
        });
      }
    }

    const ingestionQueue = new IngestionQueue();
    ingestionQueue.initialize().then(() => {
      ingestionQueue.startConsumer();
    });

    export { ingestionQueue };

    ```

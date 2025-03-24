const amqp = require('amqplib');

const consumeLiveStreamNotification = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log('Waiting for Live Stream notification...');

        await channel.bindQueue(q.queue, exchange, '', {
             "x-match": 'all', 
             "notification-type": "live-stream", 
             "content-type": "gaming" 
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log('New Live Stream notification:', message);
                // Notification logic goes here
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error(error);
    }
};

consumeLiveStreamNotification();
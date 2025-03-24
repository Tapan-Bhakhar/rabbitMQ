const amqp = require('amqplib');

const consumeNewVideoNotification = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log('Waiting for new video notification...');

        await channel.bindQueue(q.queue, exchange, '', {
             "x-match": 'all', 
             "notification-type": "new-video", 
             "content-type": "video" 
        });

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log('New video notification:', message);
                // Notification logic goes here
                channel.ack(msg);
            }
        });

    } catch (error) {
        console.error(error);
    }
};

consumeNewVideoNotification();
const amqp = require('amqplib');

const consumeAnyMatchingNotification = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log('Waiting for any matching notification...');

        await channel.bindQueue(q.queue, exchange, '', {
             "x-match": 'any', 
             "notification-type-comment": "comment",
             "notification-type-like": "like",
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

consumeAnyMatchingNotification();
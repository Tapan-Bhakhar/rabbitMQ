const amqp = require('amqplib');

const sendNotification = async (headers, message) => {

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, '', Buffer.from(message), {
            persistent: true,
            headers
        });

        console.log('Message sent successfully!');

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error(error);
    }
}

sendNotification({"x-match": 'all', "notification-type": "new-video", "content-type": "video"}, 'New video uploaded');
sendNotification({"x-match": 'all', "notification-type": "live-stream", "content-type": "gaming"}, 'Live stream started');
sendNotification({"x-match": 'any', "notification-type-comment": "comment", "content-type": "vlog"}, 'New comment on vlog');
sendNotification({"x-match": 'any', "notification-type-like": "like", "content-type": "vlog"}, 'New like on vlog');
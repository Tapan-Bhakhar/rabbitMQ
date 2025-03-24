const amqp = require('amqplib');

async function sendMessage (routingKey, message) {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'notification_exchange';
        const exchangeType = 'topic';
       

        await channel.assertExchange(exchange, exchangeType, { durable: true }); 

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log('[x] Sent %s: %s', routingKey, JSON.stringify(message));
        console.log(`msg was send! with routing key as ${routingKey} and contet as ${message} `);

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error(error);
    }
}

sendMessage("order.placed", {orderId: 2, status: "PLACED"}); // --> routing key: order.placed
sendMessage("payment.processed", {paymentId: 2, status: "PROCESSED"}); // --> routing key: payment.processed
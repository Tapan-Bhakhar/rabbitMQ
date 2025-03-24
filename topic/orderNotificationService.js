const amqp = require('amqplib');

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchange = 'notification_exchange';
        const queue = 'order_notification_queue';
       

        await channel.assertExchange(exchange, "topic", { durable: true }); 
        await channel.assertQueue(queue, { durable: true });

        // Bind the queue to the exchange
        await channel.bindQueue(queue, exchange, "order.*"); // --> binding the queue to the exchange with routing key "order.*"
        // await channel.bindQueue(queue, exchange, "payment.*"); // --> binding the queue to the exchange with routing key "payment.*"

        console.log("Waiting for messages in queue...");
        channel.consume(
            queue,
            msg => {
                 if (msg !== null) {
                    console.log(
                        `[Order Notification] Received message from exchange with routing key: ${msg.fields.routingKey} and content: ${msg.content.toString()}`
                    );
                    channel.ack(msg);
                }
            },
            { noAck: false }
        );

    } catch (error) {
        console.error(error);
    }
}

receiveMessage();
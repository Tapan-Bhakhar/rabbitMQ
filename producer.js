const amqp = require('amqplib');

async function sendMail () {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'mail_exchange';
        const routingKey = 'send_mail';
        const message = {
            to: 'abc@gmail.com',
            from: 'test@gmail.com',
            subject: 'Hello TP mail',
            body: 'hello abc'
        }

        await channel.assertExchange(exchange, 'direct', { durable: false }); // --> "direct" => type of exchange
        await channel.assertQueue('mail_queue', { durable: false }); // durable: false => queue will be deleted once the connection is closed   

        await channel.bindQueue('mail_queue', exchange, routingKey);
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log('Message sent successfully!', message);

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error(error);
    }
}
sendMail();
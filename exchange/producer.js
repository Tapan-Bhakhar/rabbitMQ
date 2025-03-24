const amqp = require('amqplib');

async function sendMail () {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://localhost');
        // Create a channel
        const channel = await connection.createChannel();

        const exchange = 'mail_exchange';
        const routingKeyForSubscribedUser = 'send_mail_to_subscribed_user';
        const routingKeyForNormalUser = 'send_mail_to_normal_user';
        const message = {
            to: 'normal@gmail.com',
            from: 'test@gmail.com',
            subject: 'Hello TP mail',
            body: 'hello abc'
        }

        await channel.assertExchange(exchange, 'direct', { durable: false }); // --> "direct" => type of exchange
       
        await channel.assertQueue('subscribed_users_mail_queue', { durable: false }); // durable: false => queue will be deleted once the connection is closed   
        await channel.assertQueue('normal_users_mail_queue', { durable: false }); // durable: false => queue will be deleted once the connection is closed   

        await channel.bindQueue('subscribed_users_mail_queue', exchange, routingKeyForSubscribedUser);
        await channel.bindQueue('normal_users_mail_queue', exchange, routingKeyForNormalUser);

        await channel.publish(exchange, routingKeyForSubscribedUser, Buffer.from(JSON.stringify(message)));
        console.log('Message sent successfully!', message);

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error(error);
    }
}
sendMail();
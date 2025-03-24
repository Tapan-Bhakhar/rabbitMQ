const amqp = require('amqplib');

async function receiveMail() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue('normal_users_mail_queue', { durable: false });

        channel.consume('normal_users_mail_queue', (message) => {
            if (message !== null) {
                console.log('Message received for Normal User:', JSON.parse(message.content));
                channel.ack(message);
            }
        });
        // noAck: true => message will be removed from the queue once it is consumed


    } catch (error) {
        console.error(error);
    }
}

receiveMail();
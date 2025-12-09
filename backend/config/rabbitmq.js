const rabbitMQ = require("amqplib");

let connection = null, channel = null;

const connectRabbitMQ = async () => {
    try {
        // Connect to RabbitMQ server
        connection = await rabbitMQ.connect(process.env.RABBITMQ_URL);

        // Create a channel
        channel = await connection.createChannel();

        // Assert queue exists (creates if not exists)
        await channel.assertQueue("email_queue", { durable: true });

        console.log("RabbitMQ connected!");

        return channel;
    } catch (e) {
        console.log("RabbitMQ connection failed!", e);
        process.exit(1);
    }
}

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
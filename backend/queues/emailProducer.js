const { getChannel } = require("../config/rabbitmq");

const publishEmailJob = async (emailData) => {
    try {
        // Getting the rabbit mq channel
        const channel = getChannel();

        // If no channel is found
        if (!channel) {
            throw new Error("RabbitMQ channel not available");
        }

        // Covert email data to JSON string because rabbitmq only accepts buffers
        const message = JSON.stringify(emailData);

        // Publish the message to the queue
        channel.sendToQueue("email_queue", Buffer.from(message), { persistent: true });

        console.log("Email job published");
        return true;
    } catch (e) {
        console.log("Email job failed to publish", e);
        return false;
    }
}

module.exports = publishEmailJob;
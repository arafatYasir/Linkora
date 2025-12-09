require("dotenv").config();

const { connectRabbitMQ } = require("../config/rabbitmq");
const redisClient = require("../config/redis");
const { sendVerificationEmail, sendPasswordResetCode } = require("../helpers/mailer");

const startEmailConsumer = async () => {
    try {
        // Connect to RabbitMQ and get channel
        const channel = await connectRabbitMQ();
        
        // Listen to "email_queue"
        channel.consume("email_queue", async (message) => {
            if(message !== null) {
                try {
                    // Parse the message (convert Buffer back to object)
                    const emailData = JSON.parse(message.content.toString());

                    // Check redis did we already send this email?
                    const cacheKey = `email:${emailData.email}:${emailData.type}`;

                    const isAlreadySent = await redisClient.get(cacheKey);

                    if(isAlreadySent) {
                        console.log("Email is already sent, skipping.");
                        channel.ack(message);

                        return;
                    }

                    if(emailData.type === "verification") {
                        await sendVerificationEmail(emailData.email, emailData.url);
                    }
                    else if(emailData.type === "passwordReset") {
                        await sendPasswordResetCode(emailData.email, emailData.code);
                    }

                    // Mark as sent in redis expires in 5 minutes
                    await redisClient.setex(cacheKey, 300, "sent");

                    // Acknowledge the message (remove from queue)
                    channel.ack(message);
                } catch (e) {
                    console.log("Failed to process email job", e);
                    channel.nack(message, false, true);
                }
            }
        }, {noAck: false});
    } catch (e) {
        console.log("Failed to start email consumer", e);
        process.exit(1);
    }
}

startEmailConsumer();
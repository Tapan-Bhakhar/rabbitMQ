# RabbitMQ Guide

This guide explains RabbitMQ and how it routes messages using different exchange types.

## What is RabbitMQ?
RabbitMQ is a system that helps different applications talk to each other by sending messages. It makes sure messages are delivered even if the receiver is not available immediately. This helps in building reliable and scalable applications.

## Exchange Types in RabbitMQ
An exchange in RabbitMQ decides how messages are sent to queues. There are different types of exchanges:

### 1. Direct Exchange
A direct exchange sends messages to a specific queue based on a matching key.

**When to use:**
- When you want to send messages to a specific receiver (e.g., sending emails to a certain user type).
- When logging messages with specific categories like "error" or "info."

### 2. Fanout Exchange
A fanout exchange sends messages to all connected queues, ignoring keys.

**When to use:**
- When sending the same message to multiple receivers (e.g., broadcasting notifications to all users).
- When you need real-time updates to different services at once.

### 3. Headers Exchange
A headers exchange routes messages based on information inside the message (headers) instead of a key.

**When to use:**
- When messages need to be filtered based on different attributes like "priority" or "region."
- When routing keys are not enough for your needs.

### 4. Topic Exchange
A topic exchange sends messages based on patterns in the routing key. It allows flexible message filtering.

**When to use:**
- When different services need different parts of the message (e.g., "logs.error" or "logs.warning").
- When you want subscribers to receive only messages that match a certain topic pattern.

## Running RabbitMQ
Make sure RabbitMQ is installed and running before using it.

```sh
# Start RabbitMQ (if using Docker)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

## Conclusion
This guide explains the different types of exchanges in RabbitMQ and when to use them. Understanding these can help build better messaging systems in applications.


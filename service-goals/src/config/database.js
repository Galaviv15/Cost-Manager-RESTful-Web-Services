const mongoose = require('mongoose');
const pino = require('pino');

const logger = pino();

/**
 * Database Connection
 * Connects to MongoDB Atlas using Mongoose
 */
async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      logger.error('MONGO_URI is not defined in environment variables');
      // Don't exit - allow server to start and retry connection later
      if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
        // Retry connection after a delay
        setTimeout(() => connectDB(), 5000);
      }
      return;
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info('MongoDB connection successful');
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    // Don't exit - allow server to start and retry connection later
    if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
      // Retry connection after a delay
      setTimeout(() => connectDB(), 5000);
    } else {
      throw error;
    }
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  logger.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from MongoDB');
});

module.exports = { connectDB, mongoose };


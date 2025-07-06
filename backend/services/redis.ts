import redisClient from "../config/redis";

// * TTL for cache
const CACHE_TTL = {
  LIVE_STREAMS: 30, // 30 seconds
  STREAM_DETAILS: 300, // 5 minutes
  USER_PROFILE: 600, // 10 minutes
  PAYMENT_STATS: 60, // 1 minute
  PAYMENT_DETAILS: 300, // 5 minutes
  USER_PAYMENTS: 180, // 3 minutes
  STREAMER_PAYMENTS: 180, // 3 minutes
};

export class RedisService {
  // * Cache live streams list
  static async cacheLiveStreams(streams: any[]) {
    try {
      const key = 'live_streams';
      await redisClient.setEx(key, CACHE_TTL.LIVE_STREAMS, JSON.stringify(streams));
      console.log('✅ Live streams cached');
    } catch (error) {
      console.error('❌ Error caching live streams:', error);
    }
  }

  // * Get cached live streams
  static async getCachedLiveStreams() {
    try {
      const key = 'live_streams';
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('❌ Error getting cached live streams:', error);
      return null;
    }
  }

  // * Cache individual stream details
  static async cacheStreamDetails(streamId: string, streamData: any) {
    try {
      const key = `stream:${streamId}`;
      await redisClient.setEx(key, CACHE_TTL.STREAM_DETAILS, JSON.stringify(streamData));
      console.log(`✅ Stream ${streamId} cached`);
    } catch (error) {
      console.error(`❌ Error caching stream ${streamId}:`, error);
    }
  }

  // * Get cached stream details
  static async getCachedStreamDetails(streamId: string) {
    try {
      const key = `stream:${streamId}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Error getting cached stream ${streamId}:`, error);
      return null;
    }
  }

  // * Invalidate stream cache when stream is updated
  static async invalidateStreamCache(streamId: string) {
    try {
      const key = `stream:${streamId}`;
      await redisClient.del(key);
      console.log(`✅ Stream ${streamId} cache invalidated`);
    } catch (error) {
      console.error(`❌ Error invalidating stream ${streamId} cache:`, error);
    }
  }

  // * Invalidate live streams cache
  static async invalidateLiveStreamsCache() {
    try {
      const key = 'live_streams';
      await redisClient.del(key);
      console.log('✅ Live streams cache invalidated');
    } catch (error) {
      console.error('❌ Error invalidating live streams cache:', error);
    }
  }

  // * Get cached user profile
  static async getCachedUserProfile(userId: string) {
    try {
      const key = `user:${userId}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Error getting cached user profile ${userId}:`, error);
      return null;
    }
  }

  // * Cache user profile
  static async cacheUserProfile(userId: string, userData: any) {
    try {
      const key = `user:${userId}`;
      await redisClient.setEx(key, CACHE_TTL.USER_PROFILE, JSON.stringify(userData));
      console.log(`✅ User ${userId} cached`);
    } catch (error) {
      console.error(`❌ Error caching user ${userId}:`, error);
    }
  }

  // * Invalidate user profile cache
  static async invalidateUserProfileCache(userId: string) {
    try {
      const key = `user:${userId}`;
      await redisClient.del(key);
      console.log(`✅ User ${userId} cache invalidated`);
    } catch (error) {
      console.error(`❌ Error invalidating user ${userId} cache:`, error);
      return null;
    }
  }

  // * Store real-time donation count for a stream
  static async incrementStreamDonations(streamId: string, amount: number) {
    try {
      const key = `stream_donations:${streamId}`;
      await redisClient.incrByFloat(key, amount);
      // Set expiration to 24 hours
      await redisClient.expire(key, 24 * 60 * 60);
      console.log(`✅ Stream ${streamId} donations updated`);
    } catch (error) {
      console.error(`❌ Error updating stream ${streamId} donations:`, error);
    }
  }

  // * Get real-time donation count for a stream
  static async getStreamDonations(streamId: string) {
    try {
      const key = `stream_donations:${streamId}`;
      const donations = await redisClient.get(key);
      return donations ? parseFloat(donations) : 0;
    } catch (error) {
      console.error(`❌ Error getting stream ${streamId} donations:`, error);
      return 0;
    }
  }

  // * Rate limiting for payment endpoints
  static async checkRateLimit(userId: string, action: string, limit: number, window: number) {
    try {
      const key = `rate_limit:${action}:${userId}`;
      const current = await redisClient.incr(key);
      
      if (current === 1) {
        await redisClient.expire(key, window);
      }
      
      return current <= limit;
    } catch (error) {
      console.error('❌ Error checking rate limit:', error);
      return true; // Allow if Redis fails
    }
  }

  // * Store temporary payment data
  static async storePaymentData(paymentId: string, data: any, ttl: number = 300) {
    try {
      const key = `payment:${paymentId}`;
      await redisClient.setEx(key, ttl, JSON.stringify(data));
      console.log(`✅ Payment ${paymentId} data stored`);
    } catch (error) {
      console.error(`❌ Error storing payment ${paymentId} data:`, error);
    }
  }

  // * Get temporary payment data
  static async getPaymentData(paymentId: string) {
    try {
      const key = `payment:${paymentId}`;
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Error getting payment ${paymentId} data:`, error);
      return null;
    }
  }

  // * Cache payment details
  static async cachePaymentDetails(paymentId: string, paymentData: any) {
    try {
      const key = `payment_details:${paymentId}`;
      await redisClient.setEx(key, CACHE_TTL.PAYMENT_DETAILS, JSON.stringify(paymentData));
      console.log(`✅ Payment details ${paymentId} cached`);
    } catch (error) {
      console.error(`❌ Error caching payment details ${paymentId}:`, error);
    }
  }

  // * Get cached payment details
  static async getCachedPaymentDetails(paymentId: string) {
    try {
      const key = `payment_details:${paymentId}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Error getting cached payment details ${paymentId}:`, error);
      return null;
    }
  }

  // * Cache user sent payments list
  static async cacheUserSentPayments(userId: string, status: string | undefined, page: number, paymentsData: any) {
    try {
      const statusKey = status || 'all';
      const key = `user_sent_payments:${userId}:${statusKey}:${page}`;
      await redisClient.setEx(key, CACHE_TTL.USER_PAYMENTS, JSON.stringify(paymentsData));
      console.log(`✅ User ${userId} sent payments cached (status: ${statusKey}, page: ${page})`);
    } catch (error) {
      console.error(`❌ Error caching user ${userId} sent payments:`, error);
    }
  }

  // * Get cached user sent payments
  static async getCachedUserSentPayments(userId: string, status: string | undefined, page: number) {
    try {
      const statusKey = status || 'all';
      const key = `user_sent_payments:${userId}:${statusKey}:${page}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Error getting cached user ${userId} sent payments:`, error);
      return null;
    }
  }

  // * Cache streamer received payments list
  static async cacheStreamerReceivedPayments(streamerId: string, status: string | undefined, page: number, paymentsData: any) {
    try {
      const statusKey = status || 'all';
      const key = `streamer_received_payments:${streamerId}:${statusKey}:${page}`;
      await redisClient.setEx(key, CACHE_TTL.STREAMER_PAYMENTS, JSON.stringify(paymentsData));
      console.log(`✅ Streamer ${streamerId} received payments cached (status: ${statusKey}, page: ${page})`);
    } catch (error) {
      console.error(`❌ Error caching streamer ${streamerId} received payments:`, error);
    }
  }

  // * Get cached streamer received payments
  static async getCachedStreamerReceivedPayments(streamerId: string, status: string | undefined, page: number) {
    try {
      const statusKey = status || 'all';
      const key = `streamer_received_payments:${streamerId}:${statusKey}:${page}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Error getting cached streamer ${streamerId} received payments:`, error);
      return null;
    }
  }

  // * Invalidate payment-related caches when payment is updated
  static async invalidatePaymentCaches(paymentId: string, userId: string, streamId: string) {
    try {
      // Invalidate payment details cache
      await redisClient.del(`payment_details:${paymentId}`);
      
      // Invalidate all user sent payments caches for this user
      const userSentKeys = await redisClient.keys(`user_sent_payments:${userId}:*`);
      if (userSentKeys.length > 0) {
        for (const key of userSentKeys) {
          await redisClient.del(key);
        }
      }

      // Get streamer ID from stream cache or database (you might need to pass this as parameter)
      // For now, we'll invalidate all streamer received payments caches
      // You can optimize this by storing streamer ID in payment data
      
      // Invalidate stream donations cache
      await redisClient.del(`stream_donations:${streamId}`);
      
      // Invalidate stream details cache
      await redisClient.del(`stream:${streamId}`);
      
      console.log(`✅ Payment ${paymentId} related caches invalidated`);
    } catch (error) {
      console.error(`❌ Error invalidating payment ${paymentId} caches:`, error);
    }
  }

  // * Invalidate all payment caches for a user
  static async invalidateUserPaymentCaches(userId: string) {
    try {
      // Invalidate user sent payments
      const userSentKeys = await redisClient.keys(`user_sent_payments:${userId}:*`);
      if (userSentKeys.length > 0) {
        for (const key of userSentKeys) {
          await redisClient.del(key);
        }
      }

      // Invalidate user received payments (if they're a streamer)
      const streamerReceivedKeys = await redisClient.keys(`streamer_received_payments:${userId}:*`);
      if (streamerReceivedKeys.length > 0) {
        for (const key of streamerReceivedKeys) {
          await redisClient.del(key);
        }
      }

      console.log(`✅ User ${userId} payment caches invalidated`);
    } catch (error) {
      console.error(`❌ Error invalidating user ${userId} payment caches:`, error);
    }
  }

  // * Get payment statistics for a stream (cached)
  static async getStreamPaymentStats(streamId: string) {
    try {
      const key = `stream_payment_stats:${streamId}`;
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Error getting stream ${streamId} payment stats:`, error);
      return null;
    }
  }

  // * Cache payment statistics for a stream
  static async cacheStreamPaymentStats(streamId: string, stats: any) {
    try {
      const key = `stream_payment_stats:${streamId}`;
      await redisClient.setEx(key, CACHE_TTL.PAYMENT_STATS, JSON.stringify(stats));
      console.log(`✅ Stream ${streamId} payment stats cached`);
    } catch (error) {
      console.error(`❌ Error caching stream ${streamId} payment stats:`, error);
    }
  }

  // * Get cache statistics and performance metrics
  static async getCacheStats() {
    try {
      const info = await redisClient.info('stats');
      const keyspace = await redisClient.info('keyspace');
      
      // Get some basic stats
      const totalKeys = await redisClient.dbSize();
      
      return {
        totalKeys,
        info,
        keyspace,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      return null;
    }
  }

  // * Clear all payment-related caches (useful for maintenance)
  static async clearPaymentCaches() {
    try {
      const paymentKeys = await redisClient.keys('payment*');
      const userPaymentKeys = await redisClient.keys('user_sent_payments*');
      const streamerPaymentKeys = await redisClient.keys('streamer_received_payments*');
      const streamDonationKeys = await redisClient.keys('stream_donations*');
      const streamPaymentStatsKeys = await redisClient.keys('stream_payment_stats*');
      
      const allKeys = [...paymentKeys, ...userPaymentKeys, ...streamerPaymentKeys, ...streamDonationKeys, ...streamPaymentStatsKeys];
      
      if (allKeys.length > 0) {
        for (const key of allKeys) {
          await redisClient.del(key);
        }
        console.log(`✅ Cleared ${allKeys.length} payment-related cache keys`);
      }
      
      return allKeys.length;
    } catch (error) {
      console.error('❌ Error clearing payment caches:', error);
      return 0;
    }
  }

  // * Health check for Redis connection
  static async healthCheck() {
    try {
      await redisClient.ping();
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return { status: 'unhealthy', error: (error as Error).message, timestamp: new Date().toISOString() };
    }
  }
}
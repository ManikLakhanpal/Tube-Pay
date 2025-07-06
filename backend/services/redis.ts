import redisClient from "../config/redis";

// * TTL for cache
const CACHE_TTL = {
  LIVE_STREAMS: 30, // 30 seconds
  STREAM_DETAILS: 300, // 5 minutes
  USER_PROFILE: 600, // 10 minutes
  PAYMENT_STATS: 60, // 1 minute
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
}
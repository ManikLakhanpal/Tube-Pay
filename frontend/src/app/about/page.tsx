import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Heart, Users, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">About YouTube Donations</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering content creators to build sustainable careers through seamless donation management and community engagement.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              YouTube Donations was created with a simple mission: to help content creators monetize their passion 
              and build meaningful connections with their audience. We believe that every creator deserves the tools 
              to turn their creativity into a sustainable career.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our platform provides a seamless, secure, and user-friendly way for viewers to support their favorite 
              creators while enabling creators to focus on what they do best - creating amazing content.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Creator-First Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We put creators first. Our platform is designed to maximize your earnings while providing 
                the best experience for your audience. Every feature is built with creators' needs in mind.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your security is our priority. We use industry-standard encryption and security measures 
                to protect your data and ensure safe transactions for both creators and supporters.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Real-Time Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamlessly integrate with your YouTube streams. Get instant notifications, real-time 
                donation alerts, and powerful analytics to help you grow your channel.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Community Building</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build stronger connections with your audience. Our platform helps you engage with your 
                community through personalized messages, shoutouts, and interactive features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Sign Up</h3>
                <p className="text-gray-600">
                  Create your account using your Google account. It's quick, secure, and free to get started.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Start Streaming</h3>
                <p className="text-gray-600">
                  Create your first stream, set up your donation goals, and share your stream link with your audience.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Receive Support</h3>
                <p className="text-gray-600">
                  Watch as your community supports you with donations and messages during your live streams.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Team</CardTitle>
            <CardDescription>
              Meet the passionate team behind YouTube Donations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Development Team</h3>
                <p className="text-gray-600">
                  Our experienced developers work tirelessly to build and maintain a platform that creators can rely on.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Support Team</h3>
                <p className="text-gray-600">
                  Our dedicated support team is here to help you succeed and make the most of our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription>
              Have questions or suggestions? We'd love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📧 Email: support@youtubedonations.com</p>
                  <p>🌐 Website: youtubedonations.com</p>
                  <p>📱 Social: @YouTubeDonations</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Support Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
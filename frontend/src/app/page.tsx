import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Video, Users, DollarSign, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm">LIVE</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Tube Pay</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Streamline your YouTube streaming experience with seamless
              donation management and real-time interactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/streams">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-black hover:bg-gray-200 hover:cursor-pointer"
                >
                  <Video className="w-6 h-6 mr-2" />
                  <span className="text-sm">Browse Streams</span>
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black hover:cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Why Choose Tube Pay?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to manage your streaming
              career and connect with your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Live Streaming</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and manage your live streams with ease. Track viewer
                  engagement and donations in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Donation Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive and manage donations from your viewers with secure
                  payment processing and instant notifications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build a strong community around your content with interactive
                  features and viewer engagement tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Creator Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dedicated support for content creators with analytics,
                  insights, and growth tools to help you succeed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Start Your Streaming Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust Tube Pay to manage their
            streaming business.
          </p>
          <Link href="/signin">
            <Button size="lg">Sign In with Google</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

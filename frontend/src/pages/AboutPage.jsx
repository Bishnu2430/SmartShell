import React from "react";
import {
  ShoppingCart,
  Leaf,
  TrendingUp,
  CheckCircle,
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Zap,
} from "lucide-react";

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            About EcoHealth Society
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building a healthier planet, one purchase at a time
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              EcoHealth Society is dedicated to creating healthier communities
              through real-time air quality monitoring and accessible health
              protection products. We believe everyone deserves to breathe clean
              air and have access to the tools they need to protect their
              health.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To build a sustainable future where technology and community
              action come together to combat air pollution. We envision a world
              where every purchase contributes to environmental restoration, and
              every individual has the information to protect their health.
            </p>
          </div>
        </div>

        {/* How Green Coins Work */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            How Green Coins Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Shop</h3>
              <p className="text-gray-600 text-sm">
                Purchase health protection products from our certified store
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Earn</h3>
              <p className="text-gray-600 text-sm">
                Get 10% of your purchase value as Green Coins instantly
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Plant</h3>
              <p className="text-gray-600 text-sm">
                Coins fund government tree plantation programs automatically
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">4. Track</h3>
              <p className="text-gray-600 text-sm">
                Monitor your environmental impact through your dashboard
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <p className="text-center text-gray-700">
              <strong>🌳 Every 10 Green Coins = 1 Tree Planted</strong>
              <br />
              <span className="text-sm">
                Your contributions go directly to government environmental
                initiatives
              </span>
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Health First</h3>
              <p className="text-gray-600">
                Your health and safety are our top priority in everything we do
              </p>
            </div>

            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Building a greener future through every action and decision
              </p>
            </div>

            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Community</h3>
              <p className="text-gray-600">
                Together we're stronger in creating positive environmental
                change
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Our Technology
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  ESP32-based IoT Sensors
                </h3>
                <p className="text-gray-600">
                  Real-time monitoring of temperature, humidity, CO₂, PM2.5,
                  PM10, and light levels
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Firebase Cloud Database
                </h3>
                <p className="text-gray-600">
                  Secure, scalable data storage with real-time synchronization
                  across all devices
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  React Web Application
                </h3>
                <p className="text-gray-600">
                  Modern, responsive interface accessible on desktop, tablet,
                  and mobile devices
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  AI-Powered Analytics
                </h3>
                <p className="text-gray-600">
                  Intelligent AQI calculations and automated alerts for air
                  quality changes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Security & Reliability
                </h3>
                <p className="text-gray-600">
                  Protected data pipelines using encryption, token
                  authentication, and IoT shields
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-10 rounded-2xl shadow-lg">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">
              Empowering a Cleaner Tomorrow
            </h2>
            <p className="text-lg opacity-90">
              Join EcoHealth Society in our mission to make sustainability
              simple, transparent, and rewarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

import { CheckCircle, Users, Calendar, DollarSign, Star, Gift } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistConfirmedPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to CARTHA!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Your email has been confirmed and you're now part of our exclusive Founding Member Program.
          </p>
          
          {email && (
            <p className="text-sm text-gray-500 mb-8">
              Confirmed: {email}
            </p>
          )}

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Founding Member Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Gift className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">50% Off First Year</h3>
                  <p className="text-sm text-gray-600">Exclusive founding member pricing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Early Access</h3>
                  <p className="text-sm text-gray-600">Beta testing of new features</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Priority Support</h3>
                  <p className="text-sm text-gray-600">Direct access to our team</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Custom Features</h3>
                  <p className="text-sm text-gray-600">Input on product development</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">1</span>
                </div>
                <span className="text-gray-700">Weekly updates on our development progress</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">2</span>
                </div>
                <span className="text-gray-700">Exclusive sneak peeks at new features</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">3</span>
                </div>
                <span className="text-gray-700">Invitations to beta testing sessions</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">4</span>
                </div>
                <span className="text-gray-700">Special launch announcements and early access</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
            >
              Return to Homepage
            </Link>
            
            <Link
              href="/features"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Learn More About Features
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@cartha.com" className="text-purple-600 hover:text-purple-700">
                support@cartha.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
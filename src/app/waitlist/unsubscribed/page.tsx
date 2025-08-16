import { CheckCircle, Mail, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistUnsubscribedPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Successfully Unsubscribed
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            You have been successfully unsubscribed from the CARTHA waitlist.
          </p>
          
          {email && (
            <p className="text-sm text-gray-500 mb-8">
              Email: {email}
            </p>
          )}

          {/* What This Means */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What this means:
            </h2>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">No More Marketing Emails</h3>
                  <p className="text-sm text-gray-600">You will no longer receive promotional emails from CARTHA</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Data Protection</h3>
                  <p className="text-sm text-gray-600">Your personal data will be handled according to our privacy policy</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <RefreshCw className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">Can Rejoin Later</h3>
                  <p className="text-sm text-gray-600">You can always rejoin the waitlist in the future if you change your mind</p>
                </div>
              </div>
            </div>
          </div>

          {/* GDPR Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Rights Under GDPR
            </h3>
            
            <div className="text-left space-y-2 text-sm text-gray-600">
              <p>• <strong>Right to be forgotten:</strong> Your data will be deleted from our marketing lists</p>
              <p>• <strong>Right to access:</strong> You can request a copy of your personal data</p>
              <p>• <strong>Right to rectification:</strong> You can request corrections to your data</p>
              <p>• <strong>Right to data portability:</strong> You can request your data in a portable format</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-medium"
            >
              Return to Homepage
            </Link>
            
            <Link
              href="/api/waitlist"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Rejoin Waitlist
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need to contact us about your data?
            </p>
            <p className="text-sm text-gray-500">
              Email us at{' '}
              <a href="mailto:privacy@cartha.com" className="text-gray-600 hover:text-gray-700">
                privacy@cartha.com
              </a>
              {' '}or{' '}
              <a href="mailto:support@cartha.com" className="text-gray-600 hover:text-gray-700">
                support@cartha.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: June 18, 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Overview
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At <strong>SSC Internship Program</strong>, we strive to provide high-quality 
              learning experiences for all our students. Our refund policy is designed to be 
              transparent and fair. Please read the following conditions carefully before 
              making any payment.
            </p>
          </section>

          {/* No Refund Policy */}
          <section className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-red-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No Refund Policy
            </h2>
            <p className="text-red-700 leading-relaxed mb-4">
              <strong className="text-red-900">IMPORTANT:</strong> All payments for quiz registrations, 
              internship assessments, and paid courses are <strong className="underline">NON-REFUNDABLE </strong> 
              under normal circumstances. Once you complete the payment, it cannot be reversed.
            </p>
          </section>

          {/* Conditions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Conditions Where No Refund is Provided
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Quiz registration fees are non-refundable once the payment is confirmed.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Internship assessment fees are non-refundable after the quiz is unlocked or activated.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>If you attempt the quiz (even once), no refund will be provided regardless of the score.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Certificate issuance fees are non-refundable once the certificate is generated.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Duplicate payments due to user error will not be refunded but can be assisted with manual resolution.</span>
              </li>
            </ul>
          </section>

          {/* Exception Cases */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l3 3 6-6m5.378 0a9 9 0 11-17.996 0 9 9 0 0117.996 0z" />
              </svg>
              Exception Cases (Refund May Be Considered)
            </h2>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Technical Failure:</strong> If our platform experiences a critical bug that prevents quiz access (verified by our team).</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Payment Duplication:</strong> If Razorpay confirms a duplicate transaction due to system error (not user error).</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Cancellation by SSC:</strong> If we cancel the quiz/assessment before it begins (rare occurrence).</span>
              </li>
            </ul>
            <p className="text-green-600 mt-4 text-sm">
              <strong>Note:</strong> For exception cases, please contact our support team within 7 days of payment with 
              your transaction ID and detailed explanation.
            </p>
          </section>

          {/* Payment Process */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Payment Process
            </h2>
            <div className="bg-gray-100 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                All payments are processed securely through <strong>Razorpay</strong>. 
                Once payment is confirmed, you will receive:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Instant email confirmation with transaction details</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Quiz registration activated immediately (if payment status = paid)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Access to quiz dashboard within 2 minutes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Contact Us for Refund Requests
            </h2>
            <p className="text-blue-700 mb-4">
              If you believe you qualify for an exception case, contact our support team:
            </p>
            <div className="space-y-3 text-blue-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email: <a href="mailto:support@seemanchalsmartvyapaar.com" className="underline">support@seemanchalsmartvyapaar.com</a></span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.254 1.067a1 1 0 01-.948 0L4.955 4.36a1 1 0 01-.684-.948L2.73 2.11a2 2 0 011.684-.948H19a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
                <span>Phone: +91-6453356884</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location: Arāria, Bihar, India</span>
              </div>
            </div>
            <p className="text-blue-600 mt-4 text-sm">
              <strong>Response Time:</strong> We aim to respond within 24-48 hours.
            </p>
          </section>

          {/* Legal Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Legal Disclaimer
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              This refund policy is subject to changes without prior notice. All payments are governed 
              by Razorpay's payment terms and conditions. By making a payment, you acknowledge that you 
              have read, understood, and agreed to this refund policy.
            </p>
          </section>

        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2026 SSC Internship Program. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
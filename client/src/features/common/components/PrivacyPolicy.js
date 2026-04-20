function PrivacyPolicyPage() {
  const company = "Bittu Telecom";
  const email = "support@bittutelecom.com";

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-400 mb-10 leading-relaxed">
          At <span className="text-white font-semibold">{company}</span>, we value your privacy.
          This policy explains how we collect, use, and protect your information when you use our platform.
        </p>

        {/* CONTENT */}
        <div className="space-y-10 text-gray-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal details such as your name, email address,
              phone number, and shipping address when you create an account or
              place an order.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              2. Payment Information
            </h2>
            <p>
              Payments are securely processed through trusted third-party providers.
              We do not store your card or banking details on our servers.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To process and deliver your orders</li>
              <li>To manage your account and provide support</li>
              <li>To improve our services and user experience</li>
              <li>To send important updates (orders, offers, notifications)</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              4. Cookies & Tracking
            </h2>
            <p>
              We use cookies and similar technologies to keep you logged in,
              remember preferences, and improve performance.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              5. Data Security
            </h2>
            <p>
              We implement reasonable security measures to protect your data.
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              6. Third-Party Services
            </h2>
            <p>
              We may use third-party services such as payment gateways and analytics tools.
              These providers have their own privacy policies.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              7. Your Rights
            </h2>
            <p>
              You can request access, correction, or deletion of your personal data
              by contacting us.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Any changes will be posted
              on this page with an updated date.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
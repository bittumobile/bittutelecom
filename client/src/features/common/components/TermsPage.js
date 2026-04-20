import { Link } from "react-router-dom";

function TermsPage() {
  const company = "Bittu Telecom";
  const email = "support@bittutelecom.com";

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-gray-400 mb-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Welcome to <span className="text-white font-semibold">{company}</span>
          . By accessing or using our website, you agree to comply with these
          terms.
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              1. Use of Website
            </h2>
            <p>
              You agree to use this website only for lawful purposes. Any
              misuse, fraud, or unauthorized activity is strictly prohibited.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              2. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and password. Any activity under your account is your
              responsibility.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              3. Product Information
            </h2>
            <p>
              We strive to provide accurate product details, pricing, and
              availability. However, errors may occur, and we reserve the right
              to correct them.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              4. Pricing & Payments
            </h2>
            <p>
              All prices are listed in INR (₹). Payments must be completed using
              approved payment methods. We reserve the right to cancel orders in
              case of suspicious transactions.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              5. Order Acceptance
            </h2>
            <p>
              We reserve the right to accept or reject any order. Orders may be
              cancelled due to stock issues, pricing errors, or security
              concerns.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              6. Returns & Refunds
            </h2>
            <p>
              Returns and refunds are handled as per our Refund Policy. Please
              review that page for detailed information.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              {company} shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our services.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              8. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, images, and logos, is
              the property of {company} and may not be used without permission.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              website means you accept the updated terms.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              10. Contact Support
            </h2>
            <Link to="/contactus">
              <button className="text-lg ml-7 border rounded-lg px-3 py-2">
                Contact Us
              </button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;

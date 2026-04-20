import { Link } from "react-router-dom";

function PolicyPage() {
  const company = "Bittu Telecom"; 

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-4">
          Returns, Refunds & Policies
        </h1>
        <p className="text-gray-400 mb-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-400 mb-10 leading-relaxed">
          This page outlines the policies of{" "}
          <span className="text-white font-semibold">{company}</span> regarding
          returns, refunds, shipping, and order handling.
        </p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          {/* RETURN POLICY */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              1. Return Policy
            </h2>
            <p>
              You can request a return within <strong>7 days</strong> of delivery.
              The product must be unused, in original packaging, and in the same
              condition as received.
            </p>
          </section>

          {/* REFUND POLICY */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              2. Refund Policy
            </h2>
            <p>
              Once your return is approved and inspected, refunds will be
              processed within <strong>5–7 business days</strong> to your original
              payment method.
            </p>
          </section>

          {/* CANCELLATION */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              3. Order Cancellation
            </h2>
            <p>
              Orders can be cancelled before they are shipped. Once shipped,
              cancellation is not possible, but you may request a return after
              delivery.
            </p>
          </section>

          {/* SHIPPING */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              4. Shipping Policy
            </h2>
            <p>
              Orders are processed within 1–2 business days and delivered within
              3–7 business days depending on your location.
            </p>
          </section>

          {/* NON-RETURNABLE */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              5. Non-Returnable Items
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Used or damaged products</li>
              <li>Products without original packaging</li>
              <li>Items marked as non-returnable</li>
            </ul>
          </section>

          {/* WARRANTY */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              6. Warranty
            </h2>
            <p>
              Some products may come with manufacturer warranty. Please refer to
              product details for warranty information.
            </p>
          </section>

          {/* FAILED DELIVERY */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              7. Failed Delivery
            </h2>
            <p>
              If delivery fails due to incorrect address or unavailability, we
              may reattempt delivery or cancel the order.
            </p>
          </section>

          {/* CONTACT */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              8. Contact Support
            </h2>
            <Link to="/contactus">
            <button className="text-lg ml-7 border rounded-lg px-3 py-2">Contact Us</button>
             </Link> 
          </section>

        </div>
      </div>
    </div>
  );
}

export default PolicyPage;
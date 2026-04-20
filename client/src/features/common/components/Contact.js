function ContactPage() {
  const phone = process.env.REACT_APP_PHONE;
  const email = process.env.REACT_APP_EMAIL;
  console.log("PHONE:", phone);
  console.log("EMAIL:", email);
  // WhatsApp message (encoded)
  const whatsappMessage = encodeURIComponent(
    "Hi, I want to inquire about your products.",
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <p className="text-gray-400 mb-10">
          Need help or have questions? Reach out instantly via call or WhatsApp.
        </p>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
          {/* EMAIL */}
          <p className="text-gray-400 text-lg">📧 {email}</p>

          {/* CALL BUTTON */}
          <a
            href={`tel:+91${phone}`}
            className="block w-full bg-green-600 hover:bg-green-500 py-3 rounded-md font-semibold text-center"
          >
            📞 Call Now
          </a>

          {/* WHATSAPP BUTTON */}
          <a
            href={`https://wa.me/91${phone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-400 py-3 rounded-md font-semibold text-center"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

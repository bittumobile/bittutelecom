import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook, 
  FaXTwitter, 
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* COMPANY INFO */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Bittu Telecom
            </h2>
            <p className="text-sm leading-relaxed">
              Reliable telecom and service Provider.
            </p>
          </div> 

          {/* SOCIAL + LINKS */}
          <div>
            <h5 className="text-white font-semibold mb-3">Follow Us</h5>

            <div className="flex gap-4 text-lg mb-4">
              <a href={import.meta.env.VITE_SOCIAL_INSTAGRAM} target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href={import.meta.env.VITE_SOCIAL_FACEBOOK} target="_blank" rel="noreferrer">
                <FaFacebook />
              </a> 
              <a href={import.meta.env.VITE_SOCIAL_TWITTER} target="_blank" rel="noreferrer">
                <FaXTwitter />
              </a>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <Link to="/contactus" className="hover:text-white">
                Contact Us
              </Link>
              <Link to="/privacypolicy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/policypage" className="hover:text-white">
                Policy Page
              </Link>
              <Link to="/termspage" className="hover:text-white">
                Terms and Condition
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">

          <p>
            © {new Date().getFullYear()}{" "}
            Bittu Telecom. All rights reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Built by{" "}
            <a
              href="https://panditsoftsolution.online"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              Pandit Soft Solution
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
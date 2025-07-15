import { Link } from "react-router"

const Footer = () => {
  return (
    <footer className="pt-12">
      <div className="bg-foreground text-background flex flex-col items-center p-6 mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-around w-full max-w-6xl py-8 px-4 md:px-0">
          {/* Contact Us Section */}
          <div className="mb-8 md:mb-0 text-center md:text-left w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                Email:{" "}
                <a
                  href="mailto:info@walkthisway.com"
                  className="hover:text-primary transition-colors duration-200"
                >
                  info@walkthisway.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                Location:{" "}
                <a
                  href="https://maps.google.com/?cid=2197556171440652539"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-200"
                >
                  215 Random Street, Cool Hall 4
                </a>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div className="mb-8 md:mb-0 text-center md:text-left w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/tos"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="mb-8 md:mb-0 text-center md:text-left w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Help
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-returns"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Contact support
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="text-center md:text-left w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Follow Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-600 text-center w-full text-xs text-gray-400">
          &copy; {new Date().getFullYear()} PcPal - portfolio project. All rights probably reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

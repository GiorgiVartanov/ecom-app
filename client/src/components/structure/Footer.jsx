const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="bg-foreground text-background flex flex-col items-center p-6 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-around w-full max-w-6xl py-8 px-4 md:px-0">
          {/* Contact Us Section */}
          <div className="mb-8 md:mb-0 text-center md:text-left w-full md:w-auto">
            <h4 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Contact Us
            </h4>
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
            <h4 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Information
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about-us"
                  className="hover:text-primary transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="mb-8 md:mb-0 text-center md:text-left w-full md:w-auto">
            <h4 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/faq"
                  className="hover:text-primary transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/shipping-returns"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="/size-guide"
                  className="hover:text-primary transition-colors duration-200"
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="text-center md:text-left w-full md:w-auto">
            <h4 className="text-lg font-semibold mb-3 border-b-2 border-complementary/50 pb-1 inline-block">
              Follow Us
            </h4>
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

        <div className="mt-8 pt-4 border-t border-complementary/50 text-center w-full text-sm text-complementary/70">
          &copy; {new Date().getFullYear()} Build This Way. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { Link } from "react-router"

import { useDocumentTitle } from "../hooks/useDocumentTitle"

const About = () => {
  useDocumentTitle("About - PcPal", "Learn more about PcPal and our values")

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto min-h-[calc(100vh-10rem)] place-content-center">
      <h2 className="text-xl mb-4">
        PcPal is <span className="text-primary-gradient font-bold">The Best</span> PC parts
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col gap-4 flex-4/10">
          <p className="w-full text-justify text-gray-700 text-sm last:whitespace-pre-wrap border-t border-gray-200 pt-2 leading-normal break-keep !overflow-x-hidden h-fit pr-3">
            Our <span className="text-primary-gradient font-bold">goal</span> is to provide a{" "}
            <span className="text-primary-gradient font-bold">wide range</span> of PC parts for our
            customers. We have a <span className="text-primary-gradient font-bold">wide range</span>{" "}
            of products, from <span className="text-primary-gradient font-bold">CPUs</span> to{" "}
            <span className="text-primary-gradient font-bold">GPUs</span>, from{" "}
            <span className="text-primary-gradient font-bold">motherboards</span> to{" "}
            <span className="text-primary-gradient font-bold">power supplies</span>, and from{" "}
            <span className="text-primary-gradient font-bold">RAM</span> to{" "}
            <span className="text-primary-gradient font-bold">storage</span>. Our catalog is
            designed to help users easily{" "}
            <span className="text-primary-gradient font-bold">browse</span> and{" "}
            <span className="text-primary-gradient font-bold">discover</span> the essential
            components needed for building or upgrading a computer. At PcPal, we aim to make it easy
            for users to <span className="text-primary-gradient font-bold">explore</span>,{" "}
            <span className="text-primary-gradient font-bold">compare</span>, and{" "}
            <span className="text-primary-gradient font-bold">learn</span> about different PC
            components. Whether you’re building your first computer or just browsing, our platform
            is designed to help you discover the possibilities of{" "}
            <span className="text-primary-gradient font-bold">custom PC building</span>. We strive
            to offer a <span className="text-primary-gradient font-bold">seamless</span> and{" "}
            <span className="text-primary-gradient font-bold">informative experience</span>,
            allowing you to make confident decisions about your next build. Our platform features{" "}
            <span className="text-primary-gradient font-bold">intuitive navigation</span>, detailed
            product information, and a{" "}
            <span className="text-primary-gradient font-bold">user-friendly interface</span> to
            ensure that everyone—from beginners to enthusiasts—can find what they need. We believe
            that building a PC should be{" "}
            <span className="text-primary-gradient font-bold">accessible</span> and{" "}
            <span className="text-primary-gradient font-bold">enjoyable</span> for everyone, and we
            are committed to providing resources and guidance every step of the way.
          </p>
          <p className="w-full text-justify text-gray-700 text-sm last:whitespace-pre-wrap border-t border-gray-200 pt-2 leading-normal break-keep !overflow-x-hidden h-fit pr-3">
            <span className="text-primary-gradient font-bold">Please note:</span> This website is a
            <span className="text-primary-gradient font-bold"> fictional/demo</span> project created
            for illustrative purposes. The products and images displayed here are not real and are
            intended solely to showcase design and functionality.
          </p>
          <Link
            to="/search"
            className="link bg-primary-gradient text-white px-5 py-2 font-bold w-fit mx-auto mt-12 mb-8"
          >
            See our products
          </Link>
        </div>
        <div className="relative">
          {/* it points to a lake, because I din't want to show real location of something */}
          <a
            href="https://www.google.com/maps/place/Lake+Lisi/@41.743638,44.7338375,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-center lg:text-left mb-2 block text-primary-gradient"
          >
            Our location
            <span className="text-sm text-gray-400 font-thin ml-1">
              it points to a lake, because I din't want to show real location of something
            </span>
          </a>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1190.0999225109706!2d44.73383748996765!3d41.743638009600375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4044725214ea066f%3A0x1e7f49b1dcb000fb!2sLake%20Lisi!5e1!3m2!1sen!2sge!4v1752426296961!5m2!1sen!2sge"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-12 border-primary rounded-lg flex-6/10 mx-auto min-h-96 max-w-full"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
export default About

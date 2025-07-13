import { Link } from "react-router"

import { useDocumentTitle } from "../hooks/useDocumentTitle"

const About = () => {
  useDocumentTitle("About - PcPal")

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto h-[calc(100vh-10rem)] place-content-center">
      <h2 className="text-xl mb-4">
        PcPal is <span className="text-primary-gradient font-bold">The Best</span> PC parts
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-4 flex-4/10">
          <p>
            Our <span className="text-primary-gradient font-bold">goal</span> is to provide a wide
            range of PC parts for our customers.
          </p>
          <p>
            We have <span className="text-primary-gradient font-bold">wide range</span> of products,
            from CPUs to GPUs, from motherboards to power supplies, from RAM to storage.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quisquam, quos.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
            dolor sit amet consectetur adipisicing elit.
          </p>
          <Link
            to="/products"
            className="link text-primary-gradient font-bold underline w-fit mx-auto mt-12 mb-8"
          >
            See our products
          </Link>
        </div>
        <div className="relative -top-8">
          <p className="font-bold">Our location</p>
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

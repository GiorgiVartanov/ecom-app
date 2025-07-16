import { useNavigate, Link } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"

import useAuthStore from "../store/useAuthStore"
import ArrowIcon from "../assets/icons/arrow.svg?react"
import { createQuery } from "../pages/Search.page"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

import Carousel from "../components/common/Carousel"
import CarouselItem from "../components/common/CarouselItem"

const COMPONENTS = [
  {
    id: "gpu",
    title: "GPU",
    image: "/images/component-images/GPU.webp",
    search: { category: "GPU" },
  },
  {
    id: "cpu",
    title: "CPU",
    image: "/images/component-images/CPU.webp",
    search: { category: "CPU" },
  },
  {
    id: "motherboard",
    title: "Motherboard",
    image: "/images/component-images/motherboard.webp",
    search: { category: "motherboard" },
  },
  {
    id: "ram",
    title: "RAM",
    image: "/images/component-images/RAM.webp",
    search: { category: "RAM" },
  },
  {
    id: "storage",
    title: "Storage",
    image: "/images/component-images/storage.webp",
    search: { category: "storage" },
  },
  {
    id: "psu",
    title: "PSU",
    image: "/images/component-images/PSU.webp",
    search: { category: "PSU" },
  },
  {
    id: "case",
    title: "Case",
    image: "/images/component-images/case.webp",
    search: { category: "case" },
  },
  {
    id: "cooler",
    title: "Cooler",
    image: "/images/component-images/cooler.webp",
    search: { category: "cooler" },
  },
]

const COMPANIES = [
  {
    id: "nvidia",
    title: "NVIDIA",
    image: "/images/company-logos/nvidia-logo.webp",
    search: { manufacturer: "nvidia" },
  },
  {
    id: "amd",
    title: "AMD",
    image: "/images/company-logos/amd-logo.webp",
    search: { manufacturer: "amd" },
  },
  {
    id: "intel",
    title: "Intel",
    image: "/images/company-logos/intel-logo.webp",
    search: { manufacturer: "intel" },
  },
  {
    id: "asus",
    title: "ASUS",
    image: "/images/company-logos/asus-logo.webp",
    search: { brand: "asus" },
  },
  {
    id: "corsair",
    title: "Corsair",
    image: "/images/company-logos/corsair-logo.webp",
    search: { brand: "corsair" },
  },
  {
    id: "msi",
    title: "MSI",
    image: "/images/company-logos/msi-logo.webp",
    search: { brand: "msi" },
  },
  {
    id: "gigabyte",
    title: "Gigabyte",
    image: "/images/company-logos/gigabyte-logo.webp",
    search: { brand: "gigabyte" },
  },
]

const PERIPHERALS = [
  {
    id: "keyboard",
    title: "Keyboard",
    image: "/images/peripheral-images/keyboard.webp",
    search: { category: "keyboard" },
  },
  {
    id: "mouse",
    title: "Mouse",
    image: "/images/peripheral-images/mouse.webp",
    search: { category: "mouse" },
  },
  {
    id: "monitor",
    title: "Monitor",
    image: "/images/peripheral-images/monitor.webp",
    search: { category: "monitor" },
  },
  {
    id: "headset",
    title: "Headset",
    image: "/images/peripheral-images/headset.webp",
    search: { category: "headset" },
  },
  {
    id: "speakers",
    title: "Speakers",
    image: "/images/peripheral-images/speakers.webp",
    search: { category: "speakers" },
  },
  {
    id: "webcam",
    title: "Webcam",
    image: "/images/peripheral-images/webcam.webp",
    search: { category: "webcam" },
  },
  {
    id: "microphone",
    title: "Microphone",
    image: "/images/peripheral-images/microphone.webp",
    search: { category: "microphone" },
  },
  {
    id: "mousepad",
    title: "Mousepad",
    image: "/images/peripheral-images/mousepad.webp",
    search: { category: "mousepad" },
  },
  {
    id: "printer",
    title: "Printer",
    image: "/images/peripheral-images/printer.webp",
    search: { category: "printer" },
  },
  {
    id: "3d-printer",
    title: "3D Printer",
    image: "/images/peripheral-images/3d-printer.webp",
    search: { category: "3d-printer" },
  },
  {
    id: "scanner",
    title: "Scanner",
    image: "/images/peripheral-images/scanner.webp",
    search: { category: "scanner" },
  },
  {
    id: "ups",
    title: "UPS",
    image: "/images/peripheral-images/UPS.webp",
    search: { category: "UPS" },
  },
]

const Home = () => {
  useDocumentTitle(
    "PcPal - Build a PC that will perform",
    "Build a PC that will perform with PcPal by your side"
  )

  const navigate = useNavigate()

  const token = useAuthStore((state) => state.token)

  const queryClient = useQueryClient()

  const prefetchTimerRef = useRef(null)

  const handlePrefetchCategory = (field, value) => {
    prefetchTimerRef.current = setTimeout(() => {
      const filters = { [field]: value, query: "" }
      const { queryKey, queryFn } = createQuery(filters, token)
      queryClient.prefetchQuery({ queryKey, queryFn })
    }, 200)
  }

  const handleMouseLeaveCategory = () => {
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current)
      prefetchTimerRef.current = null
    }
  }

  const handlePrefetchEverything = () => {
    const filters = { query: "" }
    const { queryKey, queryFn } = createQuery(filters, token)

    queryClient.prefetchQuery({ queryKey, queryFn })
  }

  const renderCarousel = (title, items, description) => (
    <Carousel
      title={title}
      description={description}
      className="max-w-6xl w-full border-b-2 border-gray-200 pb-6" // ensures consistent width
      options={{ loop: true, slidesToScroll: 1, align: "start" }} // removed slidesToShow
    >
      {items.map((item, index) => {
        const filed = Object.keys(item.search)[0]
        const value = Object.values(item.search)[0]

        return (
          <CarouselItem
            key={item.id}
            title={item.title}
            image={item.image}
            imageLoading={index < 9 ? "eager" : "lazy"}
            onMouseEnter={() => handlePrefetchCategory(filed, value)}
            onMouseLeave={handleMouseLeaveCategory}
            onClick={() => navigate(`/search?${filed}=${value}`)}
          />
        )
      })}
    </Carousel>
  )

  const renderHeroImage = () => {
    return (
      <>
        <img
          src="/images/hero-image.webp"
          alt=""
          className="absolute z-20 w-full left-0 top-15 h-[60vh] object-cover object-center bg-black"
        />
        <div className="absolute inset-0 z-30 pointer-events-none h-[60vh] w-full top-15 shadow-[inset_0_0_200px_rgba(0,0,0,0.2)]" />
        <div className="h-[60vh] z-30 relative flex items-center justify-center">
          <div className="flex flex-col">
            <div className="absolute bottom-2.5 right-0 bg-black/75 opacity-75 transition-smooth hover:opacity-85">
              <a
                className="text-white text-primary-gradient px-2 py-1"
                href="https://www.freepik.com/free-photo/gaming-setup-arrangement-high-angle_31590136.htm#from_element=cross_selling__photo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Image by freepik
              </a>
            </div>

            <h2 className="backdrop-blur-md w-fit px-2.5 py-2 rounded-lg bg-primary-gradient text-5xl font-bold bg-clip-text text-transparent transition-colors duration-300 ease-in-out group-hover:text-black border-1 border-primary/10 shadow-[inset_0_1px_16px_rgba(0,0,255,0.25)] brightness-115">
              PcPal
            </h2>
            <span className="backdrop-blur-md px-2.5 py-1.5 rounded-lg bg-primary-gradient text-md font-thin mt-1 bg-clip-text text-transparent transition-colors duration-300 ease-in-out group-hover:text-black border-1 border-primary/10 shadow-[inset_0_1px_16px_rgba(0,0,255,0.25)] brightness-115">
              Build a PC that will perform — with PcPal by your side.
            </span>
            <Link
              to="/search?query="
              onMouseEnter={handlePrefetchEverything}
              className="w-fit ml-auto backdrop-blur-md px-2.5 py-1.5 rounded-lg bg-primary-gradient text-md font-bold mt-1 bg-clip-text text-transparent transition-all duration-300 ease-in-out group-hover:text-black border-1 border-primary/10 shadow-[inset_0_1px_16px_rgba(0,0,255,0.25)] hover:shadow-[inset_0_3px_16px_rgba(0,0,255,0.35)] brightness-110 flex gap-2 hover:gap-4 hover:translate-x-4"
            >
              Start search <ArrowIcon className="icon text-gray-50 brightness-150 rotate-90" />
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="">
      {renderHeroImage()}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 mt-4">
        {renderCarousel(
          "Components",
          COMPONENTS,
          "This is a fictional/demo project. Component names and images are for demonstration purposes only and do not represent real products."
        )}
        {renderCarousel(
          "Peripherals",
          PERIPHERALS,
          "This is a fictional/demo project. Peripheral names and images are placeholders for illustrative purposes and are not actual products."
        )}
        {renderCarousel(
          "Companies",
          COMPANIES,
          "This is a fictional/demo project. All brand names and logos are the property of their respective owners and are used here for illustrative purposes only."
        )}
      </div>
    </div>
  )
}

export default Home

import ProductTypeSelect from "../components/products/ProductTypeSelect"

const pcParts = [
  {
    id: "gpu",
    title: "GPU",
    image: "/images/gpu.png",
  },
  {
    id: "cpu",
    title: "CPU",
    image: "/images/cpu.png",
  },
  {
    id: "motherboard",
    title: "Motherboard",
    image: "/images/motherboard.png",
  },
  {
    id: "memory",
    title: "Memory",
    image: "/images/memory.png",
  },
  {
    id: "storage",
    title: "Storage",
    image: "/images/storage.png",
  },
  {
    id: "psu",
    title: "PSU",
    image: "/images/psu.png",
  },
  {
    id: "case",
    title: "Case",
    image: "/images/case.png",
  },
  {
    id: "cooler",
    title: "Cooler",
    image: "/images/cooler.png",
  },
]

const Home = () => {
  return (
    <div>
      <ProductTypeSelect
        className="max-w-5xl mx-auto mt-8"
        items={pcParts}
      />
    </div>
  )
}

export default Home

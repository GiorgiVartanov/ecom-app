import ProductTypeSelect from "../components/products/ProductTypeSelect"
import Modal from "../components/common/Modal"

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
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1750004294/ecom-app/product-163cbf2b-4423-4d0d-b30b-7e88b84c5571/htlsu777qpsautz2op55.jpg",
  },
  {
    id: "psu",
    title: "PSU",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
  },
  {
    id: "case",
    title: "Case",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
  },
  {
    id: "cooler",
    title: "Cooler",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
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

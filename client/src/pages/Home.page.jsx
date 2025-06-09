import ProductTypeSelect from "../components/products/ProductTypeSelect"
import Modal from "../components/common/Modal"

const pcParts = [
  {
    id: "gpu",
    title: "GPU",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
  },
  {
    id: "cpu",
    title: "CPU",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
  },
  {
    id: "motherboard",
    title: "Motherboard",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
  },
  {
    id: "ram",
    title: "RAM",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
  },
  {
    id: "storage",
    title: "Storage",
    image:
      "https://res.cloudinary.com/dfac5lkeh/image/upload/v1748952487/images/f3bxccfn0tjjbszaulhj.webp",
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

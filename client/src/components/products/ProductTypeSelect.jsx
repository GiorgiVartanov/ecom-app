import { Link } from "react-router"
import { useQueryClient } from "@tanstack/react-query"

import { getProducts } from "../../api/products.api"

const ProductTypeSelect = ({ items, className }) => {
  return (
    <div className="relative w-fit mx-auto">
      <div
        className={`grid grid-cols-1 md:grid-cols-6 grid-rows-4 gap-4 overflow-hidden rounded-sm ${className}`}
      >
        {items.map((item, index) => (
          <ProductPanel
            key={item.id}
            item={item}
            className={
              index < 2
                ? "col-span-1 md:aspect-40/31 aspect-21/6 md:row-span-2 md:col-span-3"
                : "col-span-1 md:aspect-16/9 aspect-21/6 md:col-span-2"
            }
            to={`/search?category=${item.id}`}
          />
        ))}
      </div>
      <Link
        to="/search"
        prefetch="intent"
        className="absolute -bottom-6 right-0 hover:underline font-semibold text-primary"
      >
        see all
      </Link>
    </div>
  )
}

export default ProductTypeSelect

const ProductPanel = ({ item, to, className }) => {
  const { title, image } = item

  const queryClient = useQueryClient()

  const handlePrefetch = () => {
    const filters = { type: item.id }

    queryClient.prefetchQuery({
      queryKey: [
        "search",
        Object.entries(filters)
          .map(([key, value]) => `${key}-${value}`)
          .join("_"),
      ],
      queryFn: () => getProducts(filters),
    })
  }

  return (
    <Link
      to={to}
      className={`relative overflow-hidden scale-[1.01] group ${className}`}
      onMouseEnter={handlePrefetch}
    >
      {/* Using scale-[1.01] to fix weird wobble, fix latter */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out transform-gpu will-change-transform backface-hidden "
      />
      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-background text-center pointer-events-none bg-foreground/40 backdrop-blur-xsm px-2.5 py-1.5 leading-6 font-thin group-hover:bg-foreground/60 group-hover:text-primary transition-colors duration-300 ease-in-out">
        {title}
      </h2>
    </Link>
  )
}

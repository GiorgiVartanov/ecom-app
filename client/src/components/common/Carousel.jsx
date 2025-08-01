import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { PrevButton, NextButton, usePrevNextButtons } from "./CarouselButtons"

// renders carousel with autoplay and arrow buttons
const Carousel = ({ title, description, children, options = {}, className = "" }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  ])

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  return (
    <section className={`mx-auto px-6 ${className}`}>
      <div>
        <h2 className="font-thin text-lg mt-4 ml-2 mb-1">{title}</h2>
        <p className="text-sm ml-2 mb-1 text-gray-500">{description}</p>
      </div>
      <div className="relative">
        <div
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex touch-pan-y touch-pinch-zoom">
            {children.map((item, index) => (
              <div
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.3333%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 l:z-10">
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
        </div>
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-10">
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>
    </section>
  )
}

export default Carousel

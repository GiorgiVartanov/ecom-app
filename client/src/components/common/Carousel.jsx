import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

import { PrevButton, NextButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons"

// renders carousel with autoplay and arrow buttons
const Carousel = ({ title, children, options = {}, className = "" }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 10000, stopOnInteraction: true, stopOnMouseEnter: true }),
  ])

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  return (
    <section className={`mx-auto ${className}`}>
      <h2 className="font-thin text-lg mt-4 ml-2 mb-1">{title}</h2>
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
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-10">
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
        </div>
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-10">
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

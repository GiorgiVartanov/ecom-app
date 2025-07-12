import { useState, useEffect } from "react"

import ArrowIcon from "../../assets/icons/arrow.svg?react"

import Button from "./Button"
import Select from "./Select"

const PageSelector = ({
  currentPage,
  totalPages, // total amount of pages on a server
  maximumPages, // maximum amount of page buttons that can be shown at the same time
  goToPage, // function to go to a specific page
  prefetchPage, // function to prefetch data for a specific page
  showLimitSelector = true, // whether to show the limit selector
  limit, // current limit
  setLimit, // function to set the limit
  className,
}) => {
  const [pageNumbers, setPageNumbers] = useState([])

  const goToNextPage = () => {
    goToPage(Number(currentPage) + 1)
  }

  const goToPreviousPage = () => {
    goToPage(Math.max(Number(currentPage) - 1, 1))
  }

  const goToFirstPage = () => {
    goToPage(1)
  }

  const goToLastPage = () => {
    goToPage(totalPages)
  }

  // prefetches data for the specified page
  const handlePrefetch = (pageNumber) => {
    if (prefetchPage) {
      prefetchPage(pageNumber)
    }
  }

  useEffect(() => {
    const startPage = Math.max(
      1,
      Math.min(Number(currentPage) - Math.floor(maximumPages / 2), totalPages - maximumPages + 1)
    )
    const endPage = Math.min(totalPages, startPage + maximumPages - 1)

    const newPageNumbers = []
    for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
      newPageNumbers.push(pageIndex)
    }
    setPageNumbers(newPageNumbers)
  }, [currentPage, totalPages, maximumPages])

  // if (totalPages === 1) {
  //   return ""
  // }

  const renderGoToFirstPageButton = () => {
    return (
      <Button
        className={`flex flex-row items-center justify-center h-8 w-9 p-0 ${
          Number(currentPage) === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={goToFirstPage}
        onMouseEnter={() => handlePrefetch(1)}
        disabled={Number(currentPage) === 1}
        aria-label="First page"
      >
        <ArrowIcon className="w-4 h-4 rotate-270" />
        <ArrowIcon className="w-4 h-4 rotate-270 -ml-1" />
      </Button>
    )
  }

  const renderGoToPreviousPageButton = () => {
    return (
      <Button
        className={`flex flex-row items-center justify-center h-8 w-9 p-0 ${
          Number(currentPage) === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={goToPreviousPage}
        onMouseEnter={() => handlePrefetch(Math.max(Number(currentPage) - 1, 1))}
        disabled={Number(currentPage) === 1}
        aria-label="Previous page"
      >
        <ArrowIcon className="w-4 h-4 rotate-270" />
      </Button>
    )
  }

  const renderPageNumbers = () => {
    return pageNumbers.map((pageNumber) => (
      <Button
        key={pageNumber}
        className={`flex flex-row items-center justify-center h-8 w-9 p-0 ${
          pageNumber === Number(currentPage)
            ? "bg-primary-gradient text-white font-bold"
            : "bg-white"
        }`}
        onClick={() => goToPage(pageNumber)}
        onMouseEnter={() => handlePrefetch(pageNumber)}
        aria-current={pageNumber === Number(currentPage) ? "page" : undefined}
      >
        {pageNumber}
      </Button>
    ))
  }

  const renderGoToNextPageButton = () => {
    return (
      <Button
        className={`flex flex-row items-center justify-center h-8 w-9 p-0 ${
          totalPages <= Number(currentPage) ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={goToNextPage}
        onMouseEnter={() => handlePrefetch(Number(currentPage) + 1)}
        disabled={totalPages <= Number(currentPage)}
        aria-label="Next page"
      >
        <ArrowIcon className="w-4 h-4 rotate-90" />
      </Button>
    )
  }

  const renderGoToLastPageButton = () => {
    return (
      <Button
        className={`flex flex-row items-center justify-center h-8 w-9 p-0 ${
          totalPages === Number(currentPage) ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={goToLastPage}
        onMouseEnter={() => handlePrefetch(totalPages)}
        disabled={totalPages === Number(currentPage)}
        aria-label="Last page"
      >
        <ArrowIcon className="w-4 h-4 -mr-1 rotate-90" />
        <ArrowIcon className="w-4 h-4 rotate-90" />
      </Button>
    )
  }

  const renderLimitSelector = () => {
    return (
      <div className="absolute -right-20 h-fit">
        <Select
          options={["10", "20", "30", "40", "50"]}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          isControlled={true}
          tooltip="Number of items per page"
          includeDefaultOption={false}
          showLabel={false}
          tooltipPosition="top"
          className="button outline-none border-none py-0! font-normal h-8 px-2 rounded shadow-sm"
        />
      </div>
    )
  }

  return (
    <div className={`flex gap-3 relative justify-center items-center w-fit mx-auto ${className}`}>
      {totalPages > 1 ? (
        <>
          {renderGoToFirstPageButton()}
          {renderGoToPreviousPageButton()}
          {renderPageNumbers()}
          {renderGoToNextPageButton()}
          {renderGoToLastPageButton()}
        </>
      ) : (
        ""
      )}
      {showLimitSelector ? renderLimitSelector() : ""}
    </div>
  )
}

export default PageSelector

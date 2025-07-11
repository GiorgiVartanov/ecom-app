import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { writeReview } from "../../api/products.api"
import useAuthStore from "../../store/useAuthStore"

import TextArea from "../common/TextArea"
import Button from "../common/Button"
import ReviewStarScoreSelect from "./ReviewStarSelect"

const reviewSchema = z.object({
  rating: z.number().min(0).max(5),
  comment: z.string().min(1).max(1000),
})

const ReviewInput = ({ productId, defaultComment = "", defaultRating = 5, reviewId }) => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  const queryClient = useQueryClient()

  // define the correct query key matching useQuery
  const productQueryKey = ["product", productId, token ? "logged-in" : "not-logged-in"]

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: defaultRating, comment: defaultComment },
  })

  const reviewMutation = useMutation({
    mutationFn: ({ rating, comment }) =>
      writeReview(productId, { rating, comment, reviewId }, token),
    onMutate: async ({ rating, comment }) => {
      await queryClient.cancelQueries(productQueryKey)

      const previousData = queryClient.getQueryData(productQueryKey)

      // generate a temporary id for new reviews
      const tempId = reviewId || `temp-${Date.now()}`
      const optimisticReview = {
        id: tempId,
        userId: user?.id,
        productId,
        score: rating,
        text: comment,
        createdAt: (() => {
          if (reviewId && previousData && previousData.reviews) {
            const existing = previousData.reviews.find((review) => review.id === reviewId)
            return existing?.createdAt || new Date().toISOString()
          }
          return new Date().toISOString()
        })(),
        updatedAt: new Date().toISOString(),
        user: {
          id: user?.id,
          name: user?.name,
        },
      }

      queryClient.setQueryData(productQueryKey, (prev) => {
        if (!prev) return prev
        return {
          ...prev,
          reviews: [
            optimisticReview,
            ...(prev.reviews || []).filter((review) => review.id !== tempId),
          ],
        }
      })

      // returns context for potential rollback
      return { previousData }
    },
    onError: (error, variables, context) => {
      // rolls back to previous snapshot on error
      if (context?.previousData) {
        queryClient.setQueryData(productQueryKey, context.previousData)
      }

      toast.error("Review submission failed, check console for more detailed information")
      console.error("Review submission failed", error)
    },
    onSuccess: () => {
      toast.success("Successfully submitted review")
    },
    onSettled: () => {
      // invalidates all matching product queries for this productId
      // queryClient.invalidateQueries(["product", productId], { exact: false })
    },
  })

  if (!user || !token) return

  const onSubmit = (data) => {
    reviewMutation.mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 text-sm"
    >
      <TextArea
        itemClassName="h-32"
        placeholder="write a comment"
        maxLength={1000}
        {...register("comment")}
      />

      <div className="flex flex-col gap-4 mt-4">
        <Controller
          name="rating"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ReviewStarScoreSelect
              totalStars={5}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Button
          type="submit"
          variant="primary"
          isPending={isSubmitting}
          // disabled={isSubmitting}
          className="px-5 py-2"
        >
          {reviewId ? "update" : "Submit review"}
        </Button>
      </div>

      {reviewMutation.isError && (
        <p className="text-red-500 mt-1">
          {reviewMutation.error?.message || "failed to submit review"}
        </p>
      )}
    </form>
  )
}

export default ReviewInput

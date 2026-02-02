"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Star, StarHalf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { reviewsAPI, ordersAPI, cartAPI } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { PopularMealsCard } from "@/components/common/PopularMealsCard";
import { Loader2, ShoppingBag } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductImagesProps {
  images: Array<{
    srcset: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  }>;
}

interface ReviewsProps {
  rate: number;
  totalReviewers: string;
}

interface PriceProps {
  regular: number;
  sale?: number;
  currency: string;
  text?: string;
}

interface ProductInfoProps {
  info?: Array<{
    label: string;
    value: string;
  }>;
}

interface ProductFormProps {
  selected: FormType;
}

const MAX_STARS = 5;

interface ProductDetail1Props {
  className?: string;
  meal: any; // Using any for now to match the database meal object
  relatedMeals: any[];
}

const ProductDetails = ({ className, meal, relatedMeals }: ProductDetail1Props) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await reviewsAPI.getByMeal(meal.id) as any[];
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (meal?.id) {
      fetchReviews();
    }
  }, [meal?.id]);

  if (!meal) return null;

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, rev) => acc + Number(rev.rating), 0) / reviews.length
    : 0;

  const productDetails = {
    name: meal.name,
    description: meal.description,
    price: {
      regular: meal.price,
      currency: "USD",
    },
    reviews: {
      rate: averageRating,
      totalReviewers: reviews.length.toString(),
    },
    images: meal.images && meal.images.length > 0
      ? meal.images.map((img: string) => ({
        src: img,
        srcset: `${img} 1920w, ${img} 1280w, ${img} 640w`,
        alt: meal.name,
        width: 1920,
        height: 1080,
        sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
      }))
      : [
        {
          src: meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          srcset: `${meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 1920w, ${meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 1280w, ${meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 640w`,
          alt: meal.name,
          width: 1920,
          height: 1080,
          sizes: "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        }
      ],
  };


  return (
    <div className="space-y-10 px-5">
      <section className={cn("pt-20", className)}>
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <ProductImages images={productDetails.images} />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                      {productDetails.name}
                    </h1>
                    {meal.provider && (
                      <div className="text-lg text-muted-foreground mt-2">
                        By <span className="font-medium text-foreground">{meal.provider.name}</span>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <Reviews
                        rate={productDetails.reviews.rate}
                        totalReviewers={productDetails.reviews.totalReviewers}
                      />
                      <Badge variant="secondary">
                        <CircleCheck className="mr-1 h-3 w-3" />
                        In Stock
                      </Badge>
                    </div>
                  </div>
                  {/* <Price {...productDetails.price} /> */}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {productDetails.description}
                </p>
              </div>

              <ProductForm
                mealId={meal.id}
                selected={{
                  quantity: 1,
                }}
              />

              <div className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger>Product Details</AccordionTrigger>
                    <AccordionContent>
                      <ProductInfo
                        info={[
                          {
                            label: "Category",
                            value: meal?.category?.name || "Food",
                          },
                          {
                            label: "Provider",
                            value: meal?.provider?.name || "Unknown",
                          },
                          {
                            label: "Dietary",
                            value: meal?.dietaryTypes || "Standard",
                          },
                          {
                            label: "Popular",
                            value: meal?.isPopular ? "Yes" : "No",
                          },
                        ]}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ingredients">
                    <AccordionTrigger>Ingredients</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Fresh organic ingredients sourced locally. Includes premium spices,
                        fresh herbs, and high-quality proteins. No artificial preservatives.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 mb-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Customer Reviews</h2>
            <RecentReviews reviews={reviews} isLoading={isLoadingReviews} />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Leave a Review</h2>
            <ReviewForm mealId={meal.id} onReviewSubmit={fetchReviews} />
          </div>
        </div>
      </section>
      <section className="py-12 px-5 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight mb-8">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMeals.map((meal: any) => (
              <PopularMealsCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      </section>
    </div >
  );
};

const ProductInfo = ({ info }: ProductInfoProps) => {
  if (!info) return;

  return (
    <dl className="space-y-2">
      {info.map((item, index) => (
        <div
          key={`product-detail-1-info-${index}`}
          className="flex items-center justify-between py-2 border-b last:border-b-0"
        >
          <dt className="text-sm font-medium text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

const ProductImages = ({ images }: ProductImagesProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      {/* Desktop View */}
      <Carousel
        className="hidden md:block"
        opts={{
          breakpoints: {
            "(min-width: 768px)": {
              active: false,
            },
          },
        }}
      >
        <div className="flex flex-col gap-4">
          <CarouselItem className="w-full">
            <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted">
              <img
                srcSet={images[selectedIndex].srcset}
                alt={images[selectedIndex].alt}
                width={images[selectedIndex].width}
                height={images[selectedIndex].height}
                sizes={images[selectedIndex].sizes}
                className="block size-full object-cover object-center transition-all duration-300 ease-in-out"
              />
            </AspectRatio>
          </CarouselItem>


        </div>
      </Carousel>

      {/* Mobile View */}
      <Carousel className="md:hidden">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={`product-detail-mobile-${index}`}>
              <AspectRatio ratio={1} className="overflow-hidden rounded-lg bg-muted">
                <img
                  srcSet={img.srcset}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes={img.sizes}
                  className="block size-full object-cover object-center"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const Reviews = ({ rate, totalReviewers }: ReviewsProps) => {
  const renderStars = () => {
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`product-detail-1-star-full-${i}`}
          className="size-4 fill-yellow-500 stroke-yellow-500"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="product-detail-1-half-star" className="relative size-4">
          <StarHalf className="absolute top-0 right-0 size-full fill-yellow-500 stroke-yellow-500" />
          <StarHalf className="absolute top-0 left-0 size-full -scale-x-100 fill-black/15 stroke-black/15 dark:invert" />
        </div>,
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`product-detail-1-star-empty-${i}`}
          className="size-4 fill-black/15 stroke-black/15 dark:invert"
        />,
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{renderStars()}</div>
      {totalReviewers && (
        <p className="text-base leading-none font-medium whitespace-nowrap text-muted-foreground">
          {totalReviewers} reviews
        </p>
      )}
    </div>
  );
};

const formSchema = z.object({
  quantity: z.number().min(1),
});

type FormType = z.infer<typeof formSchema>;

interface ProductFormProps {
  mealId: string;
  selected: FormType;
}

const ProductForm = ({ mealId, selected }: ProductFormProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: selected?.quantity || 1,
    },
  });

  async function onSubmit(values: FormType) {
    if (!session) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    if ((session.user as any).role !== "USER") {
      toast.error("Only customers can add items to cart");
      return;
    }

    setIsSubmitting(true);
    try {
      await cartAPI.addItem({
        mealId: mealId,
        quantity: values.quantity,
      });

      toast.success("Added to cart successfully");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding to cart");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Quantity</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const value = field.value;
                      if (value > 1) {
                        field.onChange(value - 1);
                      }
                    }}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{field.value}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const value = field.value;
                      field.onChange(value + 1);
                    }}
                  >
                    +
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add to Cart"}
        </Button>
      </form>
    </Form>
  );
};


// ============== REVIEW FORM COMPONENT ==============
const reviewSchema = z.object({
  rating: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 5, {
    message: "Rating must be between 1 and 5",
  }),
  comment: z.string().min(3, "Comment must be at least 3 characters").max(500, "Comment is too long"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ReviewForm = ({ mealId, onReviewSubmit }: { mealId: string; onReviewSubmit: () => void }) => {
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canReview, setCanReview] = useState<boolean | null>(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(false);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!session) {
        setCanReview(null);
        return;
      }

      if ((session.user as any).role !== "USER") {
        setCanReview(false);
        return;
      }

      setIsLoadingEligibility(true);
      try {
        const orders = await ordersAPI.getUserOrders() as any[];
        const hasPurchased = orders.some(order =>
          order.status.toUpperCase() === 'DELIVERED' &&
          order.items.some((item: any) => item.mealId === mealId || (item.meal && item.meal.id === mealId))
        );
        setCanReview(hasPurchased);
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        setCanReview(false);
      } finally {
        setIsLoadingEligibility(false);
      }
    };

    checkEligibility();
  }, [session, mealId]);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "5",
      comment: "",
    },
  });

  async function onSubmit(values: ReviewFormValues) {
    if (!session) {
      toast.error("Please login to leave a review");
      return;
    }

    if ((session.user as any).role !== "USER") {
      toast.error("Only customers can leave reviews");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsAPI.create({
        mealId,
        rating: Number(values.rating),
        comment: values.comment,
      });
      toast.success("Review submitted successfully");
      form.reset();
      onReviewSubmit();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!session) {
    return (
      <div className="rounded-lg border bg-muted/50 p-6 text-center">
        <p className="text-muted-foreground mb-4">You must be logged in to post a review.</p>
        <Link href="/login">
          <Button variant="outline">Login to Review</Button>
        </Link>
      </div>
    );
  }


  if (canReview === false) {
    return (
      <div className="rounded-lg border bg-orange-50/50 p-6 text-center border-orange-100">
        <div className="mx-auto w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
          <ShoppingBag className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="font-semibold text-orange-900">Purchase Required</h3>
        <p className="text-sm text-orange-700/80 mt-1 leading-relaxed">
          Only customers who have purchased and received this meal can leave a review.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-6 bg-background shadow-sm">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    style={{
                      background: `linear-gradient(to right, #eab308 0%, #eab308 ${((Number(field.value) - 1) / 4) * 100}%, oklch(0.97 0 0) ${((Number(field.value) - 1) / 4) * 100}%, oklch(0.97 0 0) 100%)`
                    }}
                    {...field}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-yellow-600">{field.value} Stars</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "h-4 w-4",
                            Number(field.value) >= s ? "fill-yellow-500 stroke-yellow-500" : "fill-muted stroke-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what you think about this meal..."
                  className="min-h-25 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Post Review"}
        </Button>
      </form>
    </Form>
  );
};

// ============== RECENT REVIEWS COMPONENT ==============
const RecentReviews = ({ reviews, isLoading }: { reviews: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-shadow">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user.image} alt={review.user.name} />
            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{review.user.name}</h4>
              <span className="text-xs text-muted-foreground">
                {format(new Date(review.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-3 w-3",
                      Number(review.rating) >= s ? "fill-yellow-500 stroke-yellow-500" : "fill-muted stroke-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-bold">{Number(review.rating).toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ProductDetails };

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Star, StarHalf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { popularMeals } from "@/components/modules/homepage/PopularMeals";
import { PopularMealsCard } from "@/components/common/PopularMealsCard";

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
  if (!meal) return null;

  const productDetails = {
    name: meal.name,
    description: meal.description,
    price: {
      regular: meal.price,
      currency: "USD",
    },
    reviews: {
      rate: 4.5,
      totalReviewers: "120",
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
    <div className="space-y-20 px-5">
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
                  <Price {...productDetails.price} />
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

      {/* Related Products Section */}
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
    </div>
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

    if (session.user.role !== "USER") {
      toast.error("Only customers can add items to cart");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          mealId: mealId,
          quantity: values.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

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

const Price = ({ regular, sale, currency }: PriceProps) => {
  if (!regular || !currency) return;

  const formatCurrency = (
    value: number,
    currency: string = "USD",
    locale: string = "en-US",
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  };

  return (
    <div className="flex items-center gap-2">
      {sale && (
        <span className="text-right text-2xl font-bold text-primary">
          {formatCurrency(sale, currency)}
        </span>
      )}
      <span
        className={`text-right text-2xl font-bold ${sale ? "text-muted-foreground line-through" : "text-foreground"
          }`}
      >
        {formatCurrency(regular, currency)}
      </span>
    </div>
  );
};

export { ProductDetails };

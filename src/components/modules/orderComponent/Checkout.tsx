"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

import {
  Logo,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/logo";
import { Price, PriceValue } from "@/components/price";
import QuantityInput from "@/components/quantity-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

type CartItem = {
  product_id: string;
  link: string;
  name: string;
  image: string;
  price: ProductPrice;
  quantity: number;
  details: {
    label: string;
    value: string;
  }[];
};

interface CartItemProps extends CartItem {
  index: number;
  onRemoveClick: () => void;
  onQuantityChange: (newQty: number) => void;
}

interface CartProps {
  cartItems: CartItem[];
  form: UseFormReturn<CheckoutFormType>;
}

const PAYMENT_METHODS = {
  cashOnDelivery: "cashOnDelivery",
};

type PaymentMethod = keyof typeof PAYMENT_METHODS;

const PaymentSchema = z.object({
  method: z.literal(PAYMENT_METHODS.cashOnDelivery),
});

const checkoutFormSchema = z.object({
  contactInfo: z.object({
    email: z.string(),
  }),
  address: z.object({
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    phone: z.string(),
  }),
  payment: PaymentSchema,
  products: z
    .object({
      product_id: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
    .array(),
});

type CheckoutFormType = z.infer<typeof checkoutFormSchema>;

const CART_ITEMS: CartItem[] = [
  {
    product_id: "product-1",
    link: "#",
    name: "Stylish Maroon Sneaker",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/stylish-maroon-sneaker.png",
    price: {
      regular: 354.0,
      currency: "USD",
    },
    quantity: 1,
    details: [
      {
        label: "Color",
        value: "Red",
      },
      {
        label: "Size",
        value: "36",
      },
    ],
  },
  {
    product_id: "product-2",
    link: "#",
    name: "Bicolor Sweatshirt with Embroidered Logo",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/bicolor-crewneck-sweatshirt-with-embroidered-logo.png",
    price: {
      regular: 499.0,
      currency: "USD",
    },
    quantity: 1,
    details: [
      {
        label: "Color",
        value: "Blue & White",
      },
      {
        label: "Size",
        value: "L",
      },
    ],
  },
  {
    product_id: "product-4",
    link: "#",
    name: "Maroon Leather Handbag",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/maroon-leather-handbag.png",
    price: {
      regular: 245.0,
      currency: "USD",
    },
    quantity: 1,
    details: [
      {
        label: "Color",
        value: "Maroon",
      },
    ],
  },
];

interface Checkout1Props {
  cartItems?: CartItem[];
  className?: string;
}

const Checkout = ({ cartItems: initialCartItems, className }: Checkout1Props) => {
  const { data: session, isPending: authPending } = authClient.useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems || []);
  const [loading, setLoading] = useState(!initialCartItems);
  const [activeAccordion, setActiveAccordion] = useState("item-1");

  const fetchCart = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();

      const mappedItems: CartItem[] = data.items.map((item: any) => ({
        product_id: item.meal.id,
        link: `/meals/${item.meal.id}`,
        name: item.meal.name,
        image: item.meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        price: {
          regular: item.meal.price,
          currency: "USD",
        },
        quantity: item.quantity,
        details: [
          { label: "Category", value: item.meal.category?.name || "Food" }
        ],
      }));
      setCartItems(mappedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialCartItems && !authPending) {
      fetchCart();
    }
  }, [session, authPending, initialCartItems]);

  const defaultProducts = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price.sale ?? item.price.regular,
  }));

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      payment: {
        method: PAYMENT_METHODS.cashOnDelivery,
      },
      products: defaultProducts,
    },
  });

  // Re-sync form products if cartItems change
  useEffect(() => {
    form.reset({
      ...form.getValues(),
      products: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price.sale ?? item.price.regular,
      }))
    });
  }, [cartItems]);

  const router = useRouter();
  const onSubmit = async (data: CheckoutFormType) => {
    if (!session?.user?.id) return;
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price.sale ?? item.price.regular) * item.quantity, 0);
      const tax = 35.80; // Estimated tax from UI
      const totalAmount = subtotal + tax;
      const addressString = `${data.address.firstName} ${data.address.lastName}, ${data.address.address}, ${data.address.city}, ${data.address.postalCode}, ${data.address.country}, PH: ${data.address.phone}`;

      const orderData = {
        totalAmount,
        address: addressString,
        items: cartItems.map(item => ({
          mealId: item.product_id,
          quantity: item.quantity,
          price: item.price.sale ?? item.price.regular
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error("Failed to place order");

      const order = await response.json();
      toast.success("Order placed successfully!");
      router.push(`/ordersummary/${order.id}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during checkout");
    }
  };

  const onContinue = (value: string) => {
    setActiveAccordion(value);
  };

  const handleOnValueChange = (value: string) => {
    setActiveAccordion(value);
  };

  if (loading) {
    return <div className="py-32 text-center text-xl">Loading checkout...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-32 text-center space-y-4">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p>Add some delicious meals before checking out!</p>
        <Button onClick={() => router.push("/meals")}>Browse Meals</Button>
      </div>
    );
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Checkout
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                Complete your purchase securely
              </p>
            </div>
          </div>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-17.5">
              <div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={activeAccordion}
                  onValueChange={handleOnValueChange}
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Contact Information
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <ContactFields />
                        <Button
                          type="button"
                          className="w-full"
                          variant="secondary"
                          onClick={() => onContinue("item-2")}
                        >
                          Continue
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Address
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <AddressFields />
                        <Button
                          type="button"
                          className="w-full"
                          variant="secondary"
                          onClick={() => onContinue("item-4")}
                        >
                          Continue
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Payment
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <PaymentFields />
                        <Button type="submit" className="w-full">
                          Checkout
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div>
                <Cart form={form} cartItems={cartItems} />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section >
  );
};

const ContactFields = () => {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-3.5">
      <Controller
        name="contactInfo.email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-email"
            >
              Email
            </FieldLabel>
            <Input
              {...field}
              id="checkout-email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const AddressFields = () => {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-3.5">
      <Controller
        name="address.country"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-country"
            >
              Country
            </FieldLabel>
            <Input
              {...field}
              id="checkout-country"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-3.5 max-sm:flex-col">
        <Controller
          name="address.firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-firstName"
              >
                First Name
              </FieldLabel>
              <Input
                {...field}
                id="checkout-firstName"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address.lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-lastName"
              >
                Last Name
              </FieldLabel>
              <Input
                {...field}
                id="checkout-lastName"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="address.address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-address"
            >
              Address
            </FieldLabel>
            <Input
              {...field}
              id="checkout-address"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-3.5 max-sm:flex-col">
        <Controller
          name="address.postalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-postalCode"
              >
                Postal Code
              </FieldLabel>
              <Input
                {...field}
                id="checkout-postalCode"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address.city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-city"
              >
                City
              </FieldLabel>
              <Input
                {...field}
                id="checkout-city"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="address.phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-phone"
            >
              Phone
            </FieldLabel>
            <Input
              {...field}
              id="checkout-phone"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};


const PaymentFields = () => {
  const form = useFormContext();

  return (
    <div className="space-y-7">
      <Controller
        name="payment.method"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <FieldLabel htmlFor="checkout-payment-method-cod">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent className="flex-1">
                    <FieldTitle>Cash on Delivery</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value="cashOnDelivery"
                    id="checkout-payment-method-cod"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};


const Cart = ({ cartItems, form }: CartProps) => {
  const { fields, remove, update } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const formItems = form.watch("products");

  const totalPrice = formItems?.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  const handleRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove],
  );

  const handleQuantityChange = useCallback(
    (index: number) => (newQty: number) =>
      update(index, { ...fields[index], quantity: newQty }),
    [update, fields],
  );

  return (
    <div>
      <div className="border-b py-7">
        <h2 className="text-lg leading-relaxed font-semibold">Your Cart</h2>
      </div>
      <ul className="space-y-12 py-7">
        {fields.map((field, index) => {
          return (
            <li key={field.id}>
              <CartItem
                {...(cartItems.find(
                  (p) => p.product_id === field.product_id,
                ) as CartItem)}
                onRemoveClick={() => handleRemove(index)()}
                onQuantityChange={(newQty: number) =>
                  handleQuantityChange(index)(newQty)
                }
                index={index}
              />
            </li>
          );
        })}
      </ul>
      <div>
        <div className="space-y-3.5 border-y py-7">
          <div className="flex justify-between gap-3">
            <p className="text-sm">Subtotal</p>
            <Price className="text-sm font-normal">
              <PriceValue
                price={totalPrice}
                currency={cartItems[0].price.currency}
                variant="regular"
              />
            </Price>
          </div>
          <div className="flex justify-between gap-3">
            <p className="text-sm">Shipping</p>
            <p className="text-sm">Free</p>
          </div>
          <div className="flex justify-between gap-3">
            <p className="text-sm">Estimated Tax</p>
            <p className="text-sm">$35.80</p>
          </div>
        </div>
        <div className="py-7">
          <div className="flex justify-between gap-3">
            <p className="text-lg leading-tight font-medium">Total</p>
            <Price className="text-xl font-medium">
              <PriceValue
                price={totalPrice}
                currency={cartItems[0].price.currency}
                variant="regular"
              />
            </Price>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({
  image,
  name,
  link,
  details,
  price,
  index,
  onQuantityChange,
  onRemoveClick,
}: CartItemProps) => {
  const { regular, currency } = price;

  return (
    <Card className="rounded-none border-none bg-background p-0 shadow-none">
      <div className="flex w-full gap-3.5 max-sm:flex-col">
        <div className="shrink-0 basis-25">
          <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
            <img
              src={image}
              alt={name}
              className="block size-full object-cover object-center"
            />
          </AspectRatio>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-between gap-3">
            <div className="flex w-full justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium">
                  <a href={link}>{name}</a>
                </CardTitle>
                <ProductDetails details={details} />
              </div>
              <div>
                <Price className="text-sm font-semibold">
                  <PriceValue
                    price={regular}
                    currency={currency}
                    variant="regular"
                  />
                </Price>
              </div>
            </div>
            <div className="flex w-full justify-between gap-3">
              <QuantityField
                index={index}
                onQuantityChange={onQuantityChange}
              />
              <Button size="icon" variant="ghost" onClick={onRemoveClick}>
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProductDetails = ({
  details,
}: {
  details?: {
    label: string;
    value: string;
  }[];
}) => {
  if (!details) return;
  return (
    <ul>
      {details?.map((item, index) => {
        const isLast = index === details.length - 1;

        return (
          <li className="inline" key={`product-details-${index}`}>
            <dl className="inline text-xs text-muted-foreground">
              <dt className="inline">{item.label}: </dt>
              <dd className="inline">{item.value}</dd>
              {!isLast && <span className="mx-1 text-muted-foreground">/</span>}
            </dl>
          </li>
        );
      })}
    </ul>
  );
};

const QuantityField = ({
  index,
  onQuantityChange,
}: {
  index: number;
  onQuantityChange: (n: number) => void;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={`products.${index}.quantity`}
      control={control}
      render={({ field }) => {
        return (
          <Field className="w-full max-w-28">
            <QuantityInput
              inputProps={field}
              onValueChange={(newQty) => {
                field.onChange(newQty);
                onQuantityChange(newQty);
              }}
              className="rounded-none"
            />
          </Field>
        );
      }}
    />
  );
};

export { Checkout };

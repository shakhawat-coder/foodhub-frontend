"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Textarea } from "@/components/ui/textarea"
import { categoriesAPI, mealsAPI } from "@/lib/api"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    price: z.coerce.number().positive("Price must be a positive number."),
    image: z.string().url("Please enter a valid image URL.").optional().or(z.literal("")),
    categoryId: z.string().min(1, "Please select a category."),
    dietaryTypes: z.enum(["FLEXITERISN", "HALAL", "VEGAN", "VEGETARIAN"]),
    isPopular: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>;

export function AddMealForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const router = useRouter()
    const { data: session } = authClient.useSession()

    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            image: "",
            categoryId: "",
            dietaryTypes: "HALAL",
            isPopular: false,
        },
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoriesAPI.getAll() as { id: string; name: string }[]
                setCategories(data)
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }
        fetchCategories()
    }, [])

    const onSubmit = async (values: any) => {
        if (!session?.user) {
            toast.error("You must be logged in to add a meal.")
            return
        }

        setIsLoading(true)
        try {
            await mealsAPI.create(values)
            toast.success("Meal added successfully!")
            router.push("/provider-dashboard/all-meals")
            router.refresh()
        } catch (error: any) {
            console.error("Error adding meal:", error)
            toast.error(error.message || "An error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="max-w-3xl mx-auto shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 pb-8">
                <CardTitle className="text-2xl">Meal Information</CardTitle>
                <CardDescription>
                    Fill in the details to add a new dish to your menu.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Grilled Salmon" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the meal ingredients, taste, etc."
                                            className="min-h-25 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dietaryTypes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dietary Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select dietary type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="HALAL">Halal</SelectItem>
                                                <SelectItem value="VEGAN">Vegan</SelectItem>
                                                <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                                                <SelectItem value="FLEXITERISN">Flexitarian</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://images.unsplash.com/..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a direct link to a high-quality food image.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPopular"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Popular Dish</FormLabel>
                                        <FormDescription>
                                            Mark this meal as popular to feature it on the home page.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/provider-dashboard/all-meals")}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish Meal
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

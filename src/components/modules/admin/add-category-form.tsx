"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Category name must be at least 2 characters.",
    }),
    image: z.string().url({
        message: "Please enter a valid image URL.",
    }),
})

export function AddCategoryForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            image: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            if (res.ok) {
                const data = await res.json()
                toast.success(`Category "${data.name}" created successfully`)
                router.push("/admin-dashboard/categories")
                router.refresh()
            } else {
                const errorData = await res.json()
                toast.error(errorData.error || "Failed to create category")
            }
        } catch (error) {
            console.error("Error creating category:", error)
            toast.error("An error occurred while creating the category")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>
                    Enter the name and image URL for the new food category.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Italian, Desserts, Burgers" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name that will be displayed to customers.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a high-quality image URL for the category.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin-dashboard/categories")}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Category
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

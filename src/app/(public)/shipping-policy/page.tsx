import React from "react";

export default function ShippingPolicyPage() {
    return (
        <div className="container mx-auto pt-32 pb-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">Shipping & Delivery Policy</h1>
                    <p className="text-muted-foreground italic">Last Updated: April 12, 2026</p>
                </div>

                <section className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">1. Delivery Coverage</h2>
                        <p>
                            FoodHub currently provides delivery services across the metropolitan area of Dhaka. We are constantly expanding our range to bring your favorite meals to more locations. Please check the delivery availability by entering your address on the checkout page.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">2. Delivery Time</h2>
                        <p>
                            We aim to deliver your meals as fresh and as fast as possible.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Standard Delivery:</strong> 30–45 minutes depending on traffic and restaurant preparation time.</li>
                            <li><strong>Peak Hours:</strong> During peak times (lunch and dinner), delivery might take 45–60 minutes.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">3. Delivery Charges</h2>
                        <p>
                            Delivery fees are calculated based on the distance between the restaurant and your delivery location. The final delivery fee will be displayed clearly in your order summary before you make the payment.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">4. Tracking Your Order</h2>
                        <p>
                            Once your order is confirmed, you can track the status in real-time through the "Track Order" section in your user dashboard. You will receive notifications when the rider picks up your meal and when they are near your location.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">5. Delivery Issues</h2>
                        <p>
                            If you encounter any issues with your delivery, such as significant delays or damaged packaging, please contact our support team immediately via the Contact section or call us at +880 1234 567890.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

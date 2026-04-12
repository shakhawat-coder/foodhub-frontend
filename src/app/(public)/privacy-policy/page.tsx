import React from "react";

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto pt-32 pb-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground italic">Last Updated: April 12, 2026</p>
                </div>

                <section className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
                        <p>
                            Welcome to FoodHub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at support@foodhub.com.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
                        <p>
                            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Information Provided by You:</strong> We collect names; phone numbers; email addresses; mailing addresses; usernames; passwords; billing addresses; and other similar information.</li>
                            <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
                        <p>
                            We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To facilitate account creation and logon process.</li>
                            <li>To post testimonials.</li>
                            <li>Request feedback.</li>
                            <li>To enable user-to-user communications.</li>
                            <li>To manage user accounts.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">4. Sharing Your Information</h2>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">5. Your Privacy Rights</h2>
                        <p>
                            In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

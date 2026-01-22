import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl text-foreground mt-20">
        <Card className="shadow-lg">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="leading-relaxed text-muted-foreground">
                Welcome to Softcolon AI Photo Generator (&quot;we,&quot;
                &quot;our,&quot; or &quot;us&quot;). We are committed to
                protecting your personal information and your right to privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our AI Photo Generator
                application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-4 text-muted-foreground">
                We collect personal information that you voluntarily provide to
                us when you register on the application, express an interest in
                obtaining information about us or our products and services,
                when you participate in activities on the application, or
                otherwise when you contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Personal Data:</strong>{" "}
                  Name, email address, provided via authentication services
                  (Clerk).
                </li>
                <li>
                  <strong className="text-foreground">Payment Data:</strong>{" "}
                  Data necessary to process your payment if you make purchases,
                  such as your payment instrument number, provided directly to
                  our payment processor (Stripe). We do not store your payment
                  card details.
                </li>
                <li>
                  <strong className="text-foreground">Uploaded Content:</strong>{" "}
                  Photos and images you upload for processing.
                </li>
                <li>
                  <strong className="text-foreground">
                    Generated Content:
                  </strong>{" "}
                  AI-generated images created based on your inputs.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-4 text-muted-foreground">
                We use the information we collect or receive:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To facilitate account creation and logon functionality.</li>
                <li>To provide and manage the AI image generation services.</li>
                <li>To process your payments and manage your subscriptions.</li>
                <li>To improve our AI models and user experience.</li>
                <li>
                  To send you administrative information, such as product,
                  service and new feature information and/or information about
                  changes to our terms, conditions, and policies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. AI Processing and Data Retention
              </h2>
              <p className="mb-4 text-muted-foreground">
                Your uploaded photos are processed by our AI algorithms to
                generate the requested output.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Temporary Storage:
                  </strong>{" "}
                  Uploaded images are stored temporarily to perform the
                  generation task.
                </li>
                <li>
                  <strong className="text-foreground">Privacy:</strong> We do
                  not use your personal uploaded photos to train our public AI
                  models without your explicit consent.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Third-Party Service Providers
              </h2>
              <p className="mb-4 text-muted-foreground">
                We may share your data with third-party vendors, service
                providers, contractors, or agents who perform services for us or
                on our behalf and require access to such information to do that
                work. Examples include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Payment Processing:
                  </strong>{" "}
                  Stripe
                </li>
                <li>
                  <strong className="text-foreground">Authentication:</strong>{" "}
                  Clerk
                </li>
                <li>
                  <strong className="text-foreground">Email Services:</strong>{" "}
                  Nodemailer/Brevo
                </li>
                <li>
                  <strong className="text-foreground">
                    Hosting and Infrastructure:
                  </strong>{" "}
                  Vercel / AWS
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="mb-4 text-muted-foreground">
                Depending on your location, you may have rights regarding your
                personal data, including the right to access, correct, delete,
                or restrict use of your personal information. To exercise these
                rights, please contact us via our support channels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="mb-4 text-muted-foreground">
                If you have questions or comments about this policy, you may
                email us at:{" "}
                <a
                  href="mailto:support@softcolon.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@softcolon.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

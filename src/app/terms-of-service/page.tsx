import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl text-foreground">
        {/* <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link> */}
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        {/* <p className="mb-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p> */}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            These Terms of Service constitute a legally binding agreement made
            between you, whether personally or on behalf of an entity
            (&quot;you&quot;) and Softcolon (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;), concerning your access to and use of the AI Photo
            Generator application. By accessing the application, you read,
            understood, and agree to be bound by all of these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p className="mb-4">
            To use certain features of the application, you must register for an
            account. You agree to keep your password confidential and will be
            responsible for all use of your account and password. We reserve the
            right to remove, reclaim, or change a username you select if we
            determine, in our sole discretion, that such username is
            inappropriate, obscene, or otherwise objectionable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Prohibited Activities
          </h2>
          <p className="mb-4">
            You may not access or use the application for any purpose other than
            that for which we make the application available. The application
            may not be used in connection with any commercial endeavors except
            those that are specifically endorsed or approved by us.
          </p>
          <p className="mb-4">
            As a user of the application, you agree not to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Upload or generate content that is illegal, harassing, hateful,
              harmful, defamatory, obscene, bullying, abusive, or
              discriminatory.
            </li>
            <li>
              Generate Deepfakes of real people without their consent, or for
              malicious purposes.
            </li>
            <li>
              Systematically retrieve data or other content from the application
              to create or compile, directly or indirectly, a collection,
              compilation, database, or directory without written permission
              from us.
            </li>
            <li>
              Attempt to potential security vulnerabilities or bypass security
              measures.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Intellectual Property Rights
          </h2>
          <p className="mb-4">
            <strong>Your Content:</strong> You retain ownership of the photos
            you upload. By uploading content, you grant us a license to process
            it solely for the purpose of providing the service to you.
          </p>
          <p className="mb-4">
            <strong>Generated Content:</strong> Subject to your compliance with
            these terms, you own the images you generate using our service. You
            are free to use them for personal or commercial purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Subscriptions and Payment
          </h2>
          <p className="mb-4">
            Some services are billed on a subscription basis. You will be billed
            in advance on a recurring and periodic basis (&quot;Billing
            Cycle&quot;). Billing cycles are set either on a monthly or annual
            basis, depending on the type of subscription plan you select when
            purchasing a Subscription.
          </p>
          <p className="mb-4">
            We use Stripe as our third-party payment processor. By subscribing,
            you agree to be bound by Stripe&apos;s Privacy Policy and Terms of
            Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Limitation of Liability
          </h2>
          <p className="mb-4">
            In no event will we or our directors, employees, or agents be liable
            to you or any third party for any direct, indirect, consequential,
            exemplary, incidental, special, or punitive damages, including lost
            profit, lost revenue, loss of data, or other damages arising from
            your use of the application, even if we have been advised of the
            possibility of such damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="mb-4">
            To resolve a complaint regarding the application or to receive
            further information regarding use of the application, please contact
            us at:{" "}
            <a
              href="mailto:support@softcolon.com"
              className="text-primary hover:underline"
            >
              support@softcolon.com
            </a>
          </p>
        </section>
      </div>
    </>
  );
}

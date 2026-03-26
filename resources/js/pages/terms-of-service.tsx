import CustomLink from '@/components/customLink';
import Header from '../components/header';
import ContentBase from '@/components/contentBase';
import { AppCustomLayout } from '@/layouts/app-custom-layout';

const TermsOfServicePage = () => {
    return (
        <>
            <title>{`TERMS OF SERVICE | ${import.meta.env.VITE_APP_NAME}`}</title>
            <ContentBase>
                <div className="my-8 overflow-hidden rounded-lg border border-gray-700">
                    <Header title="Terms of Service" />

                    <div className="rounded-b bg-slate-900 px-8 py-6 text-white">
                        <p className="mb-2">
                            Welcome to BasketballSurvivor! These Terms of
                            Service ("Terms") govern your access to and use of
                            our website, services, and applications
                            (collectively, the "Service"). By accessing or using
                            the Service, you agree to be bound by these Terms.
                        </p>
                        <p className="mb-2">Please read them carefully.</p>

                        <h2 className="mb-4 text-2xl font-semibold">
                            1. Acceptance of Terms
                        </h2>
                        <p className="mb-4">
                            By accessing and using our Service, you confirm your
                            acceptance of these Terms and agree to be bound by
                            them. If you do not agree to these Terms, you must
                            not use our Service.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            2. Changes to Terms
                        </h2>
                        <p className="mb-4">
                            We reserve the right to modify or replace these
                            Terms at any time. We will provide notice of any
                            material changes by posting the new Terms on this
                            page. Your continued use of the Service after any
                            such changes constitutes your acceptance of the new
                            Terms.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            3. User Accounts
                        </h2>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                <strong>Registration:</strong> To access certain
                                features of the Service, you may be required to
                                register for an account. You agree to provide
                                accurate, current, and complete information
                                during the registration process and to update
                                such information to keep it accurate, current,
                                and complete.
                            </li>
                            <li className="mb-2">
                                <strong>Account Security:</strong> You are
                                responsible for maintaining the confidentiality
                                of your account password and are responsible for
                                all activities that occur under your account.
                                You agree to notify us immediately of any
                                unauthorized use of your account.
                            </li>
                            <li className="mb-2">
                                <strong>Eligibility:</strong> You must be at
                                least 10 years old to use our Service. By using
                                the Service, you represent and warrant that you
                                meet this age requirement.
                            </li>
                        </ul>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            4. Use of the Service
                        </h2>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                You agree to use the Service only for lawful
                                purposes and in a way that does not infringe the
                                rights of, restrict, or inhibit anyone else's
                                use and enjoyment of the Service.
                            </li>
                            <li className="mb-2">
                                Prohibited conduct includes harassing or causing
                                distress or inconvenience to any user,
                                transmitting obscene or offensive content, or
                                disrupting the normal flow of dialogue within
                                our Service.
                            </li>
                            <li className="mb-2">
                                Specifically for bracket challenges, you agree
                                to abide by all rules and guidelines for
                                participation as published on the Service.
                            </li>
                        </ul>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            5. Intellectual Property
                        </h2>
                        <p className="mb-4">
                            All content, trademarks, service marks, trade names,
                            logos, and icons are proprietary to
                            BasketballSurvivor or its affiliates. Nothing
                            contained on the Service should be construed as
                            granting any license or right to use any trademark
                            displayed on this Service without our written
                            permission.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            6. Disclaimers
                        </h2>
                        <p className="mb-4">
                            The Service is provided on an "AS IS" and "AS
                            AVAILABLE" basis. We make no warranties, expressed
                            or implied, regarding the operation or availability
                            of the Service or the information, content,
                            materials, or products included on the Service.
                        </p>
                        <p className="mb-4">
                            We do not guarantee that the Service will be
                            uninterrupted, timely, secure, or error-free.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            7. Limitation of Liability
                        </h2>
                        <p className="mb-4">
                            In no event shall {import.meta.env.VITE_APP_NAME},
                            nor its directors, employees, partners, agents,
                            suppliers, or affiliates, be liable for any
                            indirect, incidental, special, consequential, or
                            punitive damages, including without limitation, loss
                            of profits, data, use, goodwill, or other intangible
                            losses, resulting from (i) your access to or use of
                            or inability to access or use the Service; (ii) any
                            conduct or content of any third party on the
                            Service; (iii) any content obtained from the
                            Service; and (iv) unauthorized access, use or
                            alteration of your transmissions or content, whether
                            based on warranty, contract, tort (including
                            negligence) or any other legal theory, whether or
                            not we have been informed of the possibility of such
                            damage.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            8. Governing Law
                        </h2>
                        <p className="mb-4">
                            These Terms shall be governed and construed in
                            accordance with the laws of Republic of the
                            Philippines, without regard to its conflict of law
                            provisions.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            9. Contact Us
                        </h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, you may
                            contact us at any of the following contact details
                            found on this{' '}
                            <CustomLink href="/about" label="page" />.
                        </p>

                        <p className="mt-8 text-sm text-gray-400">
                            Last Updated: August 13, 2025
                        </p>
                    </div>
                </div>
            </ContentBase>
        </>
    );
};

TermsOfServicePage.layout = (page: React.ReactNode) => (
    <AppCustomLayout children={page} />
);

export default TermsOfServicePage;

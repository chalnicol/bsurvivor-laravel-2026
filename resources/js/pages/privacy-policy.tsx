import { AppCustomLayout } from '@/layouts/app-custom-layout';
import Header from '../components/header';
import ContentBase from '@/components/contentBase';

const PrivacyPolicyPage = () => {
    return (
        <>
            <title>{`PRIVACY POLICY | ${import.meta.env.VITE_APP_NAME}`}</title>

            <ContentBase>
                <div className="my-8 overflow-hidden rounded-lg border border-gray-700">
                    <Header title="Privacy Policy" />

                    <div className="rounded-b bg-slate-900 px-8 py-6 text-white">
                        <p className="mb-2">
                            Your privacy is important to us. This Privacy Policy
                            describes how BasketballSurvivor ("we," "us," or
                            "our") collects, uses, and discloses your
                            information when you visit and use our website and
                            services.
                        </p>
                        <p className="mb-6">
                            By using our Service, you agree to the collection
                            and use of information in accordance with this
                            policy.
                        </p>

                        <h2 className="mb-4 text-2xl font-semibold">
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">
                            We collect several types of information from and
                            about users of our Service, including:
                        </p>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                <strong>Personal Information:</strong> This
                                includes information that can be used to
                                identify you, such as your name, email address,
                                and any other personal data you collect, e.g.,
                                username, password (encrypted). We collect this
                                when you register for an account, participate in
                                our bracket challenges, or contact us.
                            </li>
                            <li className="mb-2">
                                <strong>Usage Data:</strong> We may collect
                                information on how the Service is accessed and
                                used. This Usage Data may include information
                                such as your computer's Internet Protocol
                                address (e.g., IP address), browser type,
                                browser version, the pages of our Service that
                                you visit, the time and date of your visit, the
                                time spent on those pages, unique device
                                identifiers, and other diagnostic data.
                            </li>
                            <li className="mb-2">
                                <strong>Tracking & Cookies Data:</strong> We use
                                cookies and similar tracking technologies to
                                track the activity on our Service and hold
                                certain information. Cookies are files with a
                                small amount of data which may include an
                                anonymous unique identifier. You can instruct
                                your browser to refuse all cookies or to
                                indicate when a cookie is being sent. However,
                                if you do not accept cookies, you may not be
                                able to use some portions of our Service.
                            </li>
                        </ul>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            2. How We Use Your Information
                        </h2>
                        <p className="mb-4">
                            We use the collected data for various purposes,
                            including:
                        </p>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                To provide and maintain our Service.
                            </li>
                            <li className="mb-2">
                                To notify you about changes to our Service.
                            </li>
                            <li className="mb-2">
                                To allow you to participate in interactive
                                features of our Service when you choose to do
                                so.
                            </li>
                            <li className="mb-2">
                                To provide customer support.
                            </li>
                            <li className="mb-2">
                                To monitor the usage of our Service.
                            </li>
                            <li className="mb-2">
                                To detect, prevent, and address technical
                                issues.
                            </li>
                            <li className="mb-2">
                                To manage your account and participation in
                                challenges (e.g., tracking your bracket,
                                displaying leaderboard rankings).
                            </li>
                            <li className="mb-2">
                                To send you updates, newsletters, and
                                promotional materials (only if you've opted in).
                            </li>
                            <li className="mb-2">
                                To fulfill any other purpose for which you
                                provide it.
                            </li>
                        </ul>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            3. Disclosure of Your Information
                        </h2>
                        <p className="mb-4">
                            We may share your personal information in the
                            following situations:
                        </p>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                <strong>With Service Providers:</strong> We may
                                employ third-party companies and individuals to
                                facilitate our Service, provide the Service on
                                our behalf, perform Service-related services, or
                                assist us in analyzing how our Service is used.
                                These third parties have access to your Personal
                                Data only to perform these tasks on our behalf
                                and are obligated not to disclose or use it for
                                any other purpose.
                            </li>
                            <li className="mb-2">
                                <strong>For Business Transfers:</strong> If we
                                are involved in a merger, acquisition, or asset
                                sale, your Personal Data may be transferred.
                            </li>
                            <li className="mb-2">
                                <strong>For Law Enforcement:</strong> Under
                                certain circumstances, we may be required to
                                disclose your Personal Data if required to do so
                                by law or in response to valid requests by
                                public authorities.
                            </li>
                            <li className="mb-2">
                                <strong>With Your Consent:</strong> We may
                                disclose your personal information for any other
                                purpose with your consent.
                            </li>
                        </ul>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            4. Security of Data
                        </h2>
                        <p className="mb-4">
                            The security of your data is important to us, but
                            remember that no method of transmission over the
                            Internet or method of electronic storage is 100%
                            secure. While we strive to use commercially
                            acceptable means to protect your Personal Data, we
                            cannot guarantee its absolute security.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            5. Your Data Protection Rights under the Data
                            Privacy Act of 2012 in the Philippines
                        </h2>
                        <p className="mb-4">
                            Depending on your location, you may have the
                            following rights regarding your personal data:
                        </p>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                The right to access, update, or delete the
                                information we have on you.
                            </li>
                            <li className="mb-2">
                                The right to object to our processing of your
                                Personal Data.
                            </li>
                            <li className="mb-2">
                                The right to request that we restrict the
                                processing of your personal information.
                            </li>
                            <li className="mb-2">
                                The right to data portability.
                            </li>
                            <li className="mb-2">
                                The right to withdraw consent at any time where{' '}
                                {``} relied on your consent to process your
                                personal information.
                            </li>
                        </ul>
                        <p className="mb-4">
                            To exercise any of these rights, please contact us
                            at {import.meta.env.VITE_APP_EMAIL}.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            6. Links to Other Sites
                        </h2>
                        <p className="mb-4">
                            Our Service may contain links to other sites that
                            are not operated by us. If you click on a
                            third-party link, you will be directed to that third
                            party's site. We strongly advise you to review the
                            Privacy Policy of every site you visit.
                        </p>
                        <p className="mb-4">
                            We have no control over and assume no responsibility
                            for the content, privacy policies, or practices of
                            any third-party sites or services.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            7. Changes to This Privacy Policy
                        </h2>
                        <p className="mb-4">
                            We may update our Privacy Policy from time to time.
                            We will notify you of any changes by posting the new
                            Privacy Policy on this page. We will let you know
                            via email and/or a prominent notice on our Service,
                            prior to the change becoming effective and update
                            the "Last Updated" date at the top of this Privacy
                            Policy.
                        </p>

                        <h2 className="mt-8 mb-4 text-2xl font-semibold">
                            8. Contact Us
                        </h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy,
                            please contact us:
                        </p>
                        <ul className="mb-4 ml-6 list-disc">
                            <li className="mb-2">
                                By email: {import.meta.env.VITE_APP_EMAIL}
                            </li>
                            <li className="mb-2">
                                By phone number:{' '}
                                {import.meta.env.VITE_APP_MOBILE}
                            </li>
                            {/* <li className="mb-2">
						By visiting this page on our website: [Link to your contact
						page, if applicable]
					</li> */}
                        </ul>

                        <p className="mt-8 text-sm text-gray-400">
                            Last Updated: August 13, 2025
                        </p>
                    </div>
                </div>
            </ContentBase>
        </>
    );
};

PrivacyPolicyPage.layout = (page: React.ReactNode) => (
    <AppCustomLayout children={page} />
);

export default PrivacyPolicyPage;

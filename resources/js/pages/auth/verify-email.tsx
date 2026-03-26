import { useEffect, useState } from 'react';
import TransparentIcon from '../../components/transparentIcon';
import { useForm } from '@inertiajs/react';
import AuthBase from '@/components/authBase';
import PromptMessage from '@/components/promptMessage';
import CustomButton from '@/components/customButton';
import { AppCustomLayout } from '@/layouts/app-custom-layout';

const VerifyEmail = ({ status }: { status?: string }) => {
    const [success, setSuccess] = useState('');
    const { post, processing } = useForm({});

    const handleResendEmail = () => {
        // Handle resend email logic here
        // console.log({ email });
        post('/email/verification-notification', {
            onFinish: () => {
                setSuccess(
                    'A verification link has been sent to your email address. Please click the link to confirm your account.',
                );
            },
        });
    };

    return (
        <AuthBase>
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-300 p-6 shadow-md">
                <TransparentIcon className="absolute -top-10 -right-10 z-0 w-60 rotate-30 opacity-15" />
                <div className="relative z-10">
                    <h2 className="text-xl font-bold">Verify Email?</h2>
                    <p className="mt-1 text-sm leading-normal text-slate-300">
                        Check your inbox! We sent a link to verify your email.
                        If you don't see it, check your spam folder just in
                        case.
                    </p>

                    <hr className="my-3 border-b border-gray-500" />

                    <div className="space-y-3">
                        {status && (
                            <PromptMessage type="success" message={success} />
                        )}

                        <p className="text-sm text-slate-300">
                            Didn't receive the email?
                        </p>
                        <CustomButton
                            label="Resend Email"
                            loading={processing}
                            disabled={processing}
                            onClick={handleResendEmail}
                            className="w-full bg-blue-500 py-1.5 hover:bg-blue-400"
                        />
                    </div>
                </div>
            </div>
        </AuthBase>
    );
};

VerifyEmail.layout = (page: React.ReactNode) => (
    <AppCustomLayout children={page} />
);

export default VerifyEmail;

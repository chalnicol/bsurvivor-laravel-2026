import { useEffect, useState } from 'react';
import TransparentIcon from '../../components/transparentIcon';
import { useForm } from '@inertiajs/react';
import AuthBase from '@/components/authBase';
import CustomButton from '@/components/customButton';
import PromptMessage from '@/components/promptMessage';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import TextInput from '@/components/textInput';

const ForgotPassword = () => {
  const {
    data,
    setData,
    post,
    hasErrors,
    clearErrors,
    reset,
    errors,
    processing,
  } = useForm({
    email: '',
  });

  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    //.
    clearErrors();
    setSuccess(null);
    post('/forgot-password', {
      onFinish: () => {
        reset();
      },
      onSuccess: () => {
        setSuccess(
          'A password reset link has been sent to your email address. Please check your inbox.',
        );
      },
    });
  };

  return (
    <>
      <title>{`Forgot Password | ${import.meta.env.VITE_APP_NAME}`}</title>
      <AuthBase>
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-300 p-6 shadow-md">
          <TransparentIcon className="absolute -top-10 -right-10 z-0 w-60 rotate-30 opacity-10" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold">Forgot Password?</h2>
            <p className="mt-2 text-sm leading-normal text-slate-300">
              Enter the email associated with your account. If it's registered
              with us, we'll send a password reset link to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {hasErrors && <PromptMessage type="error" errors={errors} />}
              {success && <PromptMessage type="success" message={success} />}

              <TextInput
                label="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                disabled={processing}
              />

              <CustomButton
                label="Send Reset Link"
                className="w-full bg-sky-800 py-2 hover:bg-sky-700"
                disabled={processing}
                loading={processing}
              />
            </form>
          </div>
        </div>
      </AuthBase>
    </>
  );
};

ForgotPassword.layout = (page: React.ReactNode) => (
  <AppCustomLayout children={page} />
);

export default ForgotPassword;

import React, { useState, useEffect } from 'react';
import TransparentIcon from '../../components/transparentIcon';
import { useForm } from '@inertiajs/react';
import AuthBase from '@/components/authBase';
import TextInput from '@/components/textInput';
import CustomButton from '@/components/customButton';
import PromptMessage from '@/components/promptMessage';
import { AppCustomLayout } from '@/layouts/app-custom-layout';

const ResetPassword = ({ token, email }: { token: string; email: string }) => {
  const { data, setData, processing, hasErrors, errors, reset, post } = useForm(
    {
      token: token,
      email: email,
      password: '',
      password_confirmation: '',
    },
  );

  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    post('/reset-password', {
      // Fortify's default reset route
      onFinish: () => reset(),
    });
    //..
  };

  return (
    <>
      <title>{`Reset Password | ${import.meta.env.VITE_APP_NAME}`}</title>
      <AuthBase>
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-300 p-6 shadow-md">
          <TransparentIcon className="absolute -top-10 -right-10 z-0 w-60 rotate-30 opacity-15" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold">Reset Password?</h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {hasErrors && <PromptMessage type="error" errors={errors} />}
              {success && <PromptMessage type="success" message={success} />}

              <TextInput
                type="email"
                label="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                readOnly
                disabled={processing}
              />

              <TextInput
                type="password"
                label="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
                disabled={processing}
              />

              <TextInput
                type="password"
                label="confirm password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData('password_confirmation', e.target.value)
                }
                required
                disabled={processing}
              />

              <CustomButton
                label="Update Password"
                className="mt-6 w-full bg-sky-800 py-2 hover:bg-sky-700"
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

ResetPassword.layout = (page: React.ReactNode) => (
  <AppCustomLayout children={page} />
);

export default ResetPassword;

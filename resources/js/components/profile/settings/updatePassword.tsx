import CustomButton from '@/components/customButton';
import FormRules from '@/components/formRules';
import PromptMessage from '@/components/promptMessage';
import TextInput from '@/components/textInput';
import TransparentIcon from '@/components/transparentIcon';
import { formRules } from '@/data';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

const UpdatePassword: React.FC = () => {
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data,
    setData,
    processing,
    hasErrors,
    errors,
    clearErrors,
    reset,
    put,
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    put('/settings/password', {
      onBefore: () => {
        setSuccess(null);
        clearErrors();
      },
      onSuccess: () => {
        setSuccess('Password updated successfully');
      },
      onFinish: () => {
        reset();
      },
    });
    //..
  };

  const handleReset = () => {
    reset();
    clearErrors();
    setSuccess(null);
  };

  return (
    <div className="relative space-y-3 overflow-hidden rounded border border-gray-300 px-4 py-3 shadow-md">
      <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />

      <div className="relative z-10">
        <h2 className="font-bold text-white">Update Password</h2>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {hasErrors && (
            <PromptMessage
              type="error"
              errors={errors}
              className="mt-1 mb-3"
              onClose={() => clearErrors()}
            />
          )}
          {success && (
            <PromptMessage
              type="success"
              message={success}
              className="mt-1 mb-3"
              onClose={() => setSuccess(null)}
            />
          )}

          <TextInput
            type="password"
            label="Current Password"
            value={data.current_password}
            name="current_password"
            onChange={(e) => setData('current_password', e.target.value)}
            // placeholder="current password"
            required={true}
          />
          <TextInput
            type="password"
            label="New Password"
            value={data.password}
            name="password"
            onChange={(e) => setData('password', e.target.value)}
            // placeholder="new password"
            rules={formRules.password}
            required={true}
          />
          <TextInput
            type="password"
            label="Confirm New Password"
            value={data.password_confirmation}
            name="password_confirmation"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            // placeholder="confirm new password"
            rules={formRules.password_confirmation}
            required={true}
          />

          <div className="mt-4 flex items-center space-x-1.5">
            <CustomButton
              type="button"
              label="Reset"
              onClick={handleReset}
              disabled={processing}
              className="bg-gray-600 px-3 hover:bg-gray-500"
            />
            <CustomButton
              type="submit"
              label="Update"
              color="primary"
              loading={processing}
              disabled={processing}
              className="bg-sky-800 px-3 hover:bg-sky-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdatePassword;

import CustomButton from '@/components/customButton';
import PromptMessage from '@/components/promptMessage';
import TextInput from '@/components/textInput';
import TransparentIcon from '@/components/transparentIcon';
import { formRules } from '@/data';
import { User } from '@/types/auth';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

const EditDetails = ({ user }: { user: User }) => {
  // console.log(user);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data,
    setData,
    processing,
    hasErrors,
    errors,
    clearErrors,
    reset,
    patch,
  } = useForm({
    username: user.username,
    full_name: user.full_name,
    email: user.email,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //..
    patch('/settings/profile', {
      onBefore: () => {
        setSuccess(null);
        clearErrors();
      },
      onSuccess: () => {
        setSuccess('Profile updated successfully');
      },
    });
  };

  const handleReset = () => {
    reset();
    setSuccess(null);
  };

  return (
    <div className="relative overflow-hidden rounded border border-gray-300 px-4 py-3 shadow-md">
      <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />

      <div className="relative z-10">
        <h2 className="font-bold text-white">Edit Details</h2>

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
            type="text"
            label="full name"
            value={data.full_name}
            name="lname"
            onChange={(e) => setData('full_name', e.target.value)}
            // placeholder="last name"
            rules={formRules.lastName}
            required={true}
          />
          <TextInput
            type="text"
            label="username"
            value={data.username}
            name="fname"
            onChange={(e) => setData('username', e.target.value)}
            // placeholder="first name"
            rules={formRules.firstName}
            required={true}
          />

          <TextInput
            type="text"
            label="Email"
            value={data.email}
            name="email"
            onChange={(e) => setData('email', e.target.value)}
            // placeholder="email"
            rules={formRules.email}
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

export default EditDetails;

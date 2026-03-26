import { cn, getImageUrl } from '@/lib/utils';
import { League, Team } from '@/types/bracket';
import TextInput from '../textInput';
import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import CustomButton from '../customButton';
import PromptMessage from '../promptMessage';
import SelectInput from './selectInput';
import { X } from 'lucide-react';
import CustomLink from '../customLink';
import FileInput from './fileInput';

interface LeaguePayload {
  name: string;
  short_name: string;
  logo: string | File | null;
}

const LeagueForm = ({
  league: content,
  className,
}: {
  league?: League | null;
  className?: string;
}) => {
  const {
    data,
    setData,
    post,
    put,
    errors,
    hasErrors,
    clearErrors,
    processing,
  } = useForm<LeaguePayload>({
    name: content?.name || '',
    short_name: content?.short_name || '',
    logo: (content?.logo || null) as string | File | null,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!content) {
      post('/admin/leagues', {
        forceFormData: true, // Ensures file is sent correctly
        onSuccess: () => {
          // Optional: Add a toast or notification here
        },
        onBefore: () => clearErrors(),
      });
      return;
    }

    put(`/admin/leagues/${content.id}`, {
      forceFormData: true,
      // Manual method spoofing for the backend
      method: 'put',
      onSuccess: () => {
        // Handle post-save logic
      },
      onBefore: () => clearErrors(),
      preserveScroll: true,
    });
  };

  return (
    <div className={cn(className)}>
      <h2 className="text-lg font-bold text-gray-300">
        {!content ? 'Create' : 'Edit '} League
      </h2>
      <hr className="my-1 border-b border-gray-500" />

      <form
        onSubmit={handleSubmit}
        className="mt-3 w-full space-y-3 md:max-w-xl"
      >
        {hasErrors && <PromptMessage type="error" errors={errors} />}

        <div className="space-y-1.5">
          <p className="text-[10px] tracking-widest text-slate-400 uppercase">
            Logo / Image
          </p>

          <FileInput
            image={data.logo}
            onChange={(value) => setData('logo', value)}
            disabled={processing}
          />
        </div>

        <TextInput
          label="Name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          className="border border-gray-300 bg-transparent text-sm text-gray-300"
          required
        />

        <TextInput
          label="Short Name"
          value={data.short_name}
          onChange={(e) => setData('short_name', e.target.value)}
          className="border border-gray-300 bg-transparent text-sm text-gray-300"
          required
        />

        <div className="mt-6 flex gap-2">
          <CustomLink
            href={!content ? '/admin/leagues' : `/admin/leagues/${content.id}`}
            label="Cancel"
            type="button"
            className="w-32 bg-gray-700 px-3 py-1.5 hover:bg-gray-500"
          />

          <CustomButton
            label={!content ? 'Create' : 'Save'}
            type="submit"
            loading={processing}
            disabled={processing}
            className="w-32 bg-sky-700 px-3 py-1.5 hover:bg-sky-500"
          />
        </div>
      </form>
    </div>
  );
};

export default LeagueForm;

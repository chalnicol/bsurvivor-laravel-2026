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
import DropdownSelectButton from '../dropdownSelectButtons';
import FileInput from './fileInput';

type ConferenceType = 'east' | 'west' | 'north' | 'south';

interface TeamPayload {
  club_name: string;
  monicker: string;
  short_name: string;
  league_id: number | null;
  conference: ConferenceType | null;
  logo: string | File | null;
}

const TeamForm = ({
  team,
  leagues,
  className,
}: {
  team?: Team | null;
  leagues: League[];
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
  } = useForm<TeamPayload>({
    club_name: team?.club_name || '',
    monicker: team?.monicker || '',
    short_name: team?.short_name || '',
    league_id: team?.league_id || null,
    conference: team?.conference || null,
    logo: (team?.logo || null) as string | File | null,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!team) {
      post('/admin/teams', {
        forceFormData: true, // Ensures file is sent correctly
        onSuccess: () => {
          // Optional: Add a toast or notification here
        },
        onBefore: () => clearErrors(),
      });
      return;
    }

    put(`/admin/teams/${team.id}`, {
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

  const conferenceOptions = useMemo<
    { value: ConferenceType; label: string }[]
  >(() => {
    if (!data.league_id) return [];

    const league =
      leagues.find((league) => league.id === data.league_id) || null;
    if (!league) return [];

    if (league.short_name === 'NBA') {
      return [
        { value: 'east', label: 'Eastern Conference' },
        { value: 'west', label: 'Western Conference' },
      ];
    } else {
      return [];
    }
  }, [data.league_id, leagues]);

  return (
    <div className={cn(className)}>
      <h2 className="text-lg font-bold text-gray-300">
        {!team ? 'Create' : 'Edit '} Team
      </h2>
      <hr className="my-1 border-b border-gray-500" />

      <form onSubmit={handleSubmit} className="mt-3 max-w-xl space-y-3">
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
          label="Club Name"
          value={data.club_name}
          onChange={(e) => setData('club_name', e.target.value)}
          className="border border-gray-300 bg-transparent text-sm text-gray-300"
          required
        />

        <TextInput
          label="Monicker"
          value={data.monicker}
          onChange={(e) => setData('monicker', e.target.value)}
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

        <div className="space-y-2">
          <p className="text-widest text-[10px] text-slate-400 uppercase">
            League
          </p>

          <DropdownSelectButton
            options={leagues.map((l) => ({
              label: l.name,
              value: l.id,
            }))}
            value={data.league_id}
            onChange={(value) => setData('league_id', value)}
            optionsView="list"
            position="top-left"
            disabled={processing}
            className="w-full"
            addEmpty={true}
          />
        </div>

        <div className="space-y-2">
          <p className="text-widest text-[10px] text-slate-400 uppercase">
            Conference
          </p>

          {conferenceOptions.length > 0 ? (
            <DropdownSelectButton
              options={conferenceOptions}
              value={data.conference}
              onChange={(value) => setData('conference', value)}
              optionsView="list"
              position="top-left"
              disabled={processing}
              className="w-full"
              addEmpty={true}
            />
          ) : (
            <p className="cursor-not-allowed rounded border border-gray-300 bg-gray-800 px-3 py-1 text-gray-300">
              -n/a-
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <CustomLink
            href={!team ? '/admin/teams' : `/admin/teams/${team.id}`}
            label="Cancel"
            type="button"
            className="w-32 bg-gray-700 px-3 py-1.5 hover:bg-gray-500"
          />

          <CustomButton
            label={!team ? 'Create' : 'Save'}
            type="submit"
            loading={processing}
            disabled={processing}
            className="w-32 bg-sky-700 px-3 py-1.5 hover:bg-sky-600"
          />
        </div>
      </form>
    </div>
  );
};

export default TeamForm;

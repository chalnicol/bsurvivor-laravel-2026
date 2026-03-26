import { cn } from '@/lib/utils';
import {
  BracketChallenge,
  League,
  Team,
  TeamIdsSeedData,
} from '@/types/bracket';
import TextInput from '../textInput';
import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomButton from '../customButton';
import PromptMessage from '../promptMessage';
import CustomLink from '../customLink';
import DateTimePicker from '../dateTimePicker';
import DropdownSelectButton from '../dropdownSelectButtons';
import TeamSelectOptions from './teamsSelectOptions';
import BaseModal from '../modals/baseModal';
import { useAdmin } from '@/context/AdminProvider';
import TeamsSelectedView from './teamSelectedView';
import ConfirmationModal from '../modals/confimationModal';
import CheckButton from '../checkButton';

interface BracketChallengePayload {
  name: string;
  description: string;
  submission_start: string;
  submission_end: string;
  league_id: number | null;
  seed_data: TeamIdsSeedData | null;
  is_public: boolean;
}

const LEAGUE_CONFIGS: Record<
  string,
  { conferences: string[] | null; label: string }
> = {
  NBA: { conferences: ['east', 'west'], label: 'Conference' },
  MPBL: { conferences: ['north', 'south'], label: 'Conference' },
  PBA: { conferences: null, label: 'Teams' },
};

const BracketChallengeForm = ({
  challenge: content,
  leagues,
  className,
}: {
  challenge?: BracketChallenge | null;
  leagues: League[];
  className?: string;
}) => {
  const [toSelect, setToSelect] = useState<string | null>(null);
  const [pendingLeagueId, setPendingLeagueId] = useState<number | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const { teams, loadLeague, loading } = useAdmin();

  const {
    data,
    setData,
    post,
    put,
    errors,
    hasErrors,
    clearErrors,
    processing,
  } = useForm<BracketChallengePayload>({
    name: content?.name || '',
    description: content?.description || '',
    submission_start: content?.submission_start || '',
    submission_end: content?.submission_end || '',
    league_id: content?.league_id || null,
    seed_data: content?.seed_data || null,
    is_public: content?.is_public || false,
  });

  // -------------------------------------------------------------------------
  // On mount — load teams for edit mode without resetting seed_data
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!content?.league_id) return;

    const league = leagues.find((l) => l.id === content.league_id);
    if (league) {
      loadLeague(league.short_name);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Derived state
  // -------------------------------------------------------------------------

  const leagueSelected = useMemo(
    () => leagues.find((l) => l.id === data.league_id) || null,
    [leagues, data.league_id],
  );

  const config = leagueSelected
    ? LEAGUE_CONFIGS[leagueSelected.short_name]
    : null;

  const getSelectedTeamsByConference = useCallback(
    (conf?: string): Team[] => {
      if (!data.seed_data) return [];

      let ids: number[] = [];

      if (data.seed_data.league === 'pba') {
        ids = data.seed_data.teams as number[];
      } else if (conf) {
        ids = (data.seed_data.teams as any)[conf] || [];
      }

      // Sort teams by the order they appear in ids — preserves seed order
      return ids
        .map((id) => teams.find((t) => t.id === id))
        .filter((t): t is Team => t !== undefined);
    },
    [data.seed_data, teams],
  );

  const modalContext = useMemo(() => {
    if (!toSelect) return null;

    const filteredTeams = teams.filter((t) => {
      if (toSelect === 'any') return true;
      return t.conference === toSelect;
    });

    let currentIds: number[] = [];

    if (config?.conferences) {
      currentIds = (data.seed_data?.teams as any)?.[toSelect] || [];
    } else {
      currentIds = (data.seed_data?.teams as number[]) || [];
    }

    return {
      teams: filteredTeams,
      title:
        toSelect === 'any'
          ? 'Teams'
          : `${toSelect.charAt(0).toUpperCase() + toSelect.slice(1)} ${config?.label}`,
      selectedIds: currentIds,
    };
  }, [toSelect, teams, data.seed_data, config]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const executeLeagueChange = (value: number | null, resetSeeds = true) => {
    const selected = leagues.find((l) => l.id === value);
    const leagueSlug = selected?.short_name.toLowerCase();

    if (resetSeeds) {
      let initialSeedData: TeamIdsSeedData | null = null;

      if (leagueSlug === 'pba') {
        initialSeedData = { league: 'pba', teams: [] };
      } else if (leagueSlug === 'nba') {
        initialSeedData = { league: 'nba', teams: { east: [], west: [] } };
      } else if (leagueSlug === 'mpbl') {
        initialSeedData = { league: 'mpbl', teams: { north: [], south: [] } };
      }

      setData((prev) => ({
        ...prev,
        league_id: value,
        seed_data: initialSeedData,
      }));
    } else {
      // Edit mode mount — preserve existing seed_data
      setData('league_id', value);
    }

    if (selected) {
      loadLeague(selected.short_name);
    }

    setShowConfirmReset(false);
    setPendingLeagueId(null);
  };

  const handleSelectLeague = (value: number | null) => {
    const hasSelectedTeams =
      data.seed_data &&
      (Array.isArray(data.seed_data.teams)
        ? data.seed_data.teams.length > 0
        : Object.values(data.seed_data.teams).some(
            (conf: any) => conf.length > 0,
          ));

    if (hasSelectedTeams && value !== data.league_id) {
      setPendingLeagueId(value);
      setShowConfirmReset(true);
      return;
    }

    executeLeagueChange(value);
  };

  const handleUpdateTeams = (selected: number[]) => {
    const leagueSlug = leagueSelected?.short_name.toLowerCase();
    if (!leagueSlug) return;

    if (leagueSlug === 'pba') {
      setData('seed_data', { league: 'pba', teams: selected });
    } else if (toSelect && toSelect !== 'any') {
      const currentTeams = (data.seed_data?.teams as any) || {};
      setData('seed_data', {
        league: leagueSlug as any,
        teams: { ...currentTeams, [toSelect]: selected },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      post('/admin/bracket-challenges', {
        onBefore: () => clearErrors(),
      });
      return;
    }

    put(`/admin/bracket-challenges/${content.id}`, {
      onBefore: () => clearErrors(),
      preserveScroll: true,
    });
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className={cn(className)}>
      <h2 className="text-lg font-bold text-gray-300">
        {!content ? 'Create' : 'Edit'} Bracket Challenge
      </h2>
      <hr className="my-1 border-b border-gray-500" />

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        {hasErrors && <PromptMessage type="error" errors={errors} />}

        <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-[1fr_1fr]">
          {/* Left column */}
          <div className="space-y-3">
            <TextInput
              label="Name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="border border-gray-300 bg-transparent text-sm text-gray-300"
              required
            />

            <div className="space-y-2">
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                League
              </p>
              <DropdownSelectButton
                options={leagues.map((l) => ({ label: l.name, value: l.id }))}
                value={data.league_id}
                onChange={(value) => handleSelectLeague(value)}
                optionsView="list"
                position="bottom-left"
                disabled={processing}
                className="w-full"
                addEmpty={true}
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                Submission Start
              </p>
              <DateTimePicker
                type="date"
                value={data.submission_start}
                onChange={(v) => setData('submission_start', v)}
                maxYear={new Date().getFullYear() + 1}
                optionsPosition="bottom"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                Submission End
              </p>
              <DateTimePicker
                type="date"
                value={data.submission_end}
                onChange={(v) => setData('submission_end', v)}
                maxYear={new Date().getFullYear() + 1}
                optionsPosition="bottom"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                Description
              </p>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={5}
                className="block w-full resize-none rounded border border-gray-300 bg-transparent p-1 px-2 text-sm text-gray-400 outline-none"
              />
            </div>

            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_public"
                checked={data.is_public}
                onChange={(e) => setData('is_public', e.target.checked)}
                className="aspect-square w-4 rounded accent-amber-100"
              />
              <label htmlFor="is_public" className="text-sm text-gray-300">
                Is Public
              </label>
            </div> */}
            <CheckButton
              label="Is Public"
              onChange={() => setData('is_public', !data.is_public)}
              checked={data.is_public || false}
              disabled={processing}
            />
          </div>

          {/* Right column — team seeding */}
          <div>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase">
              Teams
            </p>
            <div className="mt-1 space-y-3">
              {config?.conferences ? (
                config.conferences.map((conf) => (
                  <TeamsSelectedView
                    key={conf}
                    title={`${conf.charAt(0).toUpperCase() + conf.slice(1)} ${config.label}`}
                    selected={getSelectedTeamsByConference(conf)}
                    onChangeClick={() => setToSelect(conf)}
                    disabled={loading}
                  />
                ))
              ) : config ? (
                <TeamsSelectedView
                  title="Seeded Teams"
                  selected={getSelectedTeamsByConference()}
                  onChangeClick={() => setToSelect('any')}
                  disabled={loading}
                />
              ) : (
                <div className="mt-1 flex items-center justify-center rounded bg-gray-800 p-3 text-gray-400">
                  <p className="text-sm">Select a league to load teams.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <CustomLink
            href={
              !content
                ? '/admin/bracket-challenges'
                : `/admin/bracket-challenges/${content.id}`
            }
            type="button"
            label="Cancel"
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

      {/* Team selection modal */}
      {toSelect && modalContext && (
        <BaseModal size="2xl">
          <TeamSelectOptions
            teams={modalContext.teams}
            title={modalContext.title}
            selected={modalContext.selectedIds}
            onSelect={handleUpdateTeams}
            onClose={() => setToSelect(null)}
          />
        </BaseModal>
      )}

      {/* League change confirmation modal */}
      {showConfirmReset && (
        <ConfirmationModal
          message="Changing the league will reset all currently selected teams. Are you sure you want to proceed?"
          onConfirm={() => executeLeagueChange(pendingLeagueId)}
          onClose={() => {
            setShowConfirmReset(false);
            setPendingLeagueId(null);
          }}
        />
      )}
    </div>
  );
};

export default BracketChallengeForm;

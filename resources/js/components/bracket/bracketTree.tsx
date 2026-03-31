import BracketConference from './bracketConference';
import BracketFinals from './bracketFinals';
import { useBracket } from '@/context/BracketChallengeProvider';
import CustomButton from '../customButton';

const BracketTree = () => {
  const {
    league,
    predictionsFilledOut,
    clearAll,
    submit,
    isFilledAny,
    mode,
    revert,
    update,
    loading,
    isUpdated,
    canUpdateMatches,
    hasRealWinners,
  } = useBracket();

  return (
    <div className="w-full overflow-hidden select-none">
      {/* control panel */}
      <div className="mb-3 flex items-center justify-end gap-2">
        {mode !== 'view' && (
          <CustomButton
            label="Clear All"
            onClick={clearAll}
            className="bg-rose-600 px-3 text-sm uppercase hover:bg-rose-500"
            disabled={!isFilledAny || loading}
          />
        )}

        {mode == 'create' && (
          <CustomButton
            label={'Submit Entry'}
            disabled={!predictionsFilledOut || loading}
            loading={loading}
            onClick={submit}
            className="bg-sky-600 px-3 text-sm uppercase hover:bg-sky-500"
          />
        )}
        {mode == 'update' && (
          <>
            {hasRealWinners && (
              <CustomButton
                label="Revert"
                onClick={revert}
                className="bg-amber-600 px-3 text-sm uppercase hover:bg-amber-500"
                disabled={loading}
              />
            )}
            <CustomButton
              label="Update"
              onClick={update}
              className="bg-sky-600 px-3 text-sm uppercase hover:bg-sky-500"
              disabled={!isUpdated || !canUpdateMatches || loading}
            />
          </>
        )}
      </div>

      {/* bracket tree */}
      <div className="w-full overflow-x-auto bg-zinc-900 p-4">
        <div className="flex min-w-max items-center justify-center gap-x-6">
          {league == 'nba' && (
            <>
              <BracketConference
                title="Eastern Conference"
                conference={'east'}
                wing={'left'}
                className="z-20"
              />

              <BracketFinals title="NBA Finals" />

              <BracketConference
                title="Western Conference"
                conference={'west'}
                wing={'right'}
                className="z-20"
              />
            </>
          )}
          {league == 'mpbl' && (
            <>
              <BracketConference
                title="North Division"
                conference={'north'}
                wing={'left'}
              />

              <BracketFinals title="MPBL Finals" />

              <BracketConference
                title="South Division"
                conference={'south'}
                wing={'right'}
              />
            </>
          )}
          {league == 'pba' && (
            <>
              <BracketConference wing={'left'} />
              <BracketFinals title="PBA Finals" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BracketTree;

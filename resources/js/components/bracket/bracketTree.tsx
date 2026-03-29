import BracketConference from './bracketConference';
import { cn } from '@/lib/utils';
import BracketFinals from './bracketFinals';
import { useBracket } from '@/context/BracketChallengeProvider';
import CustomButton from '../customButton';

const BracketTree = () => {
  const { league, isFilled, clearAll, submit, hasPrediction } = useBracket();

  return (
    <div className="w-full overflow-hidden select-none">
      <div className="mb-3 flex items-center justify-end gap-2">
        <CustomButton
          label="Reset"
          onClick={clearAll}
          className="bg-orange-400 px-3 text-sm uppercase hover:bg-orange-300"
          disabled={!hasPrediction}
        />
        <CustomButton
          label="Submit"
          disabled={!isFilled}
          onClick={submit}
          className="bg-sky-600 px-3 text-sm uppercase hover:bg-sky-500"
        />
      </div>

      <div className="w-full overflow-x-auto bg-zinc-900 py-4">
        <div className="flex min-w-max items-center justify-center gap-x-6">
          {league == 'nba' && (
            <>
              <BracketConference
                title="Eastern Conference"
                conference={'east'}
                wing={'left'}
              />

              <BracketFinals title="NBA Finals" />

              <BracketConference
                title="Western Conference"
                conference={'west'}
                wing={'right'}
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

import ActionMenu from '@/components/actionMenu';
import BracketTree from '@/components/bracket/bracketTree';
import ContentBase from '@/components/contentBase';
import CustomLink from '@/components/customLink';
import DetailCard from '@/components/detailCard';
import Detail from '@/components/detailCard';
import Pill from '@/components/pill';
import BracketChallengeProvider from '@/context/BracketChallengeProvider';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { BracketChallenge, BracketChallengeEntry } from '@/types/bracket';
import { PillColor } from '@/types/general';
import { Pi } from 'lucide-react';
import { useState } from 'react';

const BracketChallengeEntryShow = ({
  entry,
  isUserEntry,
}: {
  entry: BracketChallengeEntry;
  isUserEntry: boolean;
}) => {
  const statusClr: Record<string, PillColor> = {
    active: 'sky',
    eliminated: 'rose',
    won: 'emerald',
  };

  // console.log('e', entry);

  return (
    <ContentBase className="pt-0 pb-4">
      <div className="relative">
        <div className="flex justify-between gap-2 bg-gray-900 py-3">
          <h2 className="flex-1 border-b border-gray-400 py-1 text-lg font-bold md:text-xl">
            {entry.name}
          </h2>
        </div>

        <div className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <DetailCard label="Entry By">
              <p
                className={cn(
                  'text-sm font-semibold tracking-wider uppercase',
                  isUserEntry && 'text-yellow-600',
                )}
              >
                {isUserEntry ? 'You' : entry.user?.username}
              </p>
            </DetailCard>
            <DetailCard label="Date Submitted">
              <p className="text-sm">{formatDate(entry.created_at)}</p>
            </DetailCard>
            <DetailCard label="League">
              <p className="text-sm font-semibold">
                {entry.bracket_challenge.league?.short_name}
              </p>
            </DetailCard>
            <DetailCard label="Status">
              <Pill text={entry.status} color={statusClr[entry.status]} />
            </DetailCard>
          </div>

          <div className="rounded border border-gray-400 p-3">
            <BracketChallengeProvider
              challenge={entry.bracket_challenge}
              entryPredictions={entry.predictions}
              mode="view"
            >
              <BracketTree />
            </BracketChallengeProvider>
          </div>
        </div>
      </div>
    </ContentBase>
  );
};

BracketChallengeEntryShow.layout = (page: React.ReactNode) => (
  <AppCustomLayout children={page} />
);

export default BracketChallengeEntryShow;

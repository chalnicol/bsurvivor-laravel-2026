import ActionMenu from '@/components/actionMenu';
import BracketTree from '@/components/bracket/bracketTree';
import ContentBase from '@/components/contentBase';
import DetailCard from '@/components/detailCard';
import Detail from '@/components/detailCard';
import Pill from '@/components/pill';
import BracketChallengeProvider from '@/context/BracketChallengeProvider';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import { formatDate } from '@/lib/dateUtils';
import { BracketChallenge } from '@/types/bracket';
import { Pi } from 'lucide-react';
import { useState } from 'react';

const BracketChallengeShow = ({
  challenge,
}: {
  challenge: BracketChallenge;
}) => {
  // console.log(challenge);
  const [loading, setLoading] = useState(false);

  const pageOptions: { label: string; callback: () => void }[] = [
    {
      label: 'Show Results',
      callback: () => {
        //..
      },
    },
  ];

  return (
    <ContentBase className="pt-0 pb-4">
      <div className="relative">
        <div className="flex justify-between gap-2 bg-gray-900 py-3">
          <h2 className="flex-1 border-b border-gray-400 py-1 text-lg font-bold md:text-xl">
            {challenge.name}
          </h2>
          {/* <ActionMenu options={pageOptions} disabled={loading} /> */}
        </div>

        <div className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <DetailCard label="League">
              <p className="text-sm font-semibold">
                {challenge.league?.short_name}
              </p>
            </DetailCard>
            <DetailCard label="Status">
              <Pill
                text={challenge.status}
                color={challenge.status == 'published' ? 'emerald' : 'amber'}
              />
            </DetailCard>
            <DetailCard label="Submissions Start">
              <p className="text-sm">
                {formatDate(challenge.submission_start)}
              </p>
            </DetailCard>
            <DetailCard label="Submissions End">
              <p className="text-sm">{formatDate(challenge.submission_end)}</p>
            </DetailCard>
          </div>

          <div className="rounded border border-gray-400 p-3">
            <BracketChallengeProvider challenge={challenge}>
              <BracketTree />
            </BracketChallengeProvider>
          </div>
        </div>
      </div>
    </ContentBase>
  );
};

BracketChallengeShow.layout = (page: React.ReactNode) => (
  <AppCustomLayout children={page} />
);

export default BracketChallengeShow;

import FlexNav from '@/components/flexNav';
import { AppCustomLayout } from '../app-custom-layout';
import { NavItem } from '@/types/general';
import ContentBase from '@/components/contentBase';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  // const { url } = usePage();
  const navItems: NavItem[] = [
    { id: 1, href: '/profile', label: 'Settings' },
    { id: 4, href: '/profile/notifications', label: 'Notifications' },
    { id: 3, href: '/profile/friends', label: 'Friends' },
    { id: 2, href: '/profile/entries', label: 'Challenge Entries' },
  ];

  return (
    <AppCustomLayout>
      <ContentBase>
        <h1 className="mb-3 border-b border-gray-300 pb-2 text-lg font-bold text-gray-200">
          Profile
        </h1>

        <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row">
          <FlexNav navItems={navItems} parentPath="/profile" />
          <div className="flex-1">{children}</div>
        </div>
      </ContentBase>
    </AppCustomLayout>
  );
};
export default ProfileLayout;

import FlexNav from '@/components/flexNav';
import { AppCustomLayout } from '../app-custom-layout';
import { NavItem } from '@/types/general';
import ContentBase from '@/components/contentBase';
import AdminProvider from '@/context/AdminProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navItems: NavItem[] = [
    { id: 1, href: '/admin', label: 'Dashboard' },
    { id: 4, href: '/admin/users', label: 'Users' },
    { id: 3, href: '/admin/teams', label: 'Teams' },
    { id: 2, href: '/admin/leagues', label: 'Leagues' },
    { id: 5, href: '/admin/bracket-challenges', label: 'Bracket Challenges' },
    // {
    //   id: 6,
    //   href: '/admin/bracket-challenge-entries',
    //   label: 'Bracket Challenge Entries',
    // },
    // {
    //   id: 8,
    //   href: '/admin/comments',
    //   label: 'Comments',
    // },
    // {
    //   id: 7,
    //   href: '/admin/settings',
    //   label: 'Settings',
    // },
  ];

  return (
    <AppCustomLayout>
      <AdminProvider>
        <ContentBase>
          <h1 className="mb-3 border-b border-gray-300 pb-2 text-lg font-bold text-gray-200">
            Admin
          </h1>

          <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row">
            <FlexNav navItems={navItems} parentPath="/admin" />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </ContentBase>
      </AdminProvider>
    </AppCustomLayout>
  );
};
export default AdminLayout;

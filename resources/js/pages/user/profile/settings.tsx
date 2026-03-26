import DeleteAccount from '@/components/profile/settings/deleteAccount';
import EditDetails from '@/components/profile/settings/editDetails';
import UpdatePassword from '@/components/profile/settings/updatePassword';
import ProfileLayout from '@/layouts/proflle/layout';
import { User } from '@/types/auth';

interface SettingsProps {
    user: User;
}
const Settings = ({ user }: SettingsProps) => {
    return (
        <div className="w-full space-y-6 md:max-w-xl">
            <EditDetails user={user} />
            <UpdatePassword />
            <DeleteAccount />
        </div>
    );
};

Settings.layout = (page: React.ReactNode) => <ProfileLayout children={page} />;

export default Settings;

import ContentBase from '@/components/contentBase';
import Hero from '@/components/hero';
import { AppCustomLayout } from '@/layouts/app-custom-layout';

const Home = () => {
    return (
        <ContentBase className="py-0">
            <Hero />
        </ContentBase>
    );
};

Home.layout = (page: React.ReactNode) => <AppCustomLayout children={page} />;

export default Home;

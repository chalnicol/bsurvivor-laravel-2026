import React from 'react';
import ContentBase from '../components/contentBase';
import CustomLink from '@/components/customLink';

const PageNotFound: React.FC = () => {
    return (
        <>
            <title>{`PAGE NOT FOUND | ${import.meta.env.VITE_APP_NAME}`}</title>
            <ContentBase className="px-4 py-6">
                <div className="mb-4 flex h-50 items-center justify-center space-x-4 rounded bg-gray-800 p-3 text-white">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold lg:text-5xl">404</h1>
                        <h2 className="text-lg font-semibold">
                            Page Not Found
                        </h2>
                        <hr className="my-3" />
                        <p className="text-center">
                            The page you are looking for does not exist. Go to{' '}
                            <CustomLink label="Home" href="/" />
                        </p>
                    </div>
                </div>
            </ContentBase>
        </>
    );
};

export default PageNotFound;

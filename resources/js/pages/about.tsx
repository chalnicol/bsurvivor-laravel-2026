import { useState } from 'react';
import Icon from '../components/icon';
import Header from '../components/header';
import CustomLink from '@/components/customLink';
import PromptMessage from '@/components/promptMessage';
import { useForm } from '@inertiajs/react';
import CustomButton from '@/components/customButton';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import ContentBase from '@/components/contentBase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faYoutube,
    faXTwitter,
    faInstagram,
} from '@fortawesome/free-brands-svg-icons';

const About = () => {
    const { data, setData, post, hasErrors, clearErrors, errors, processing } =
        useForm({
            email: '',
            message: '',
            name: '',
        });

    const [success, setSuccess] = useState<string | null>(null);

    const leaveMessage = async (e: React.SubmitEvent) => {
        e.preventDefault();
        //..
    };

    const socials: { id: number; label: React.ReactNode; link: string }[] = [
        {
            id: 1,
            label: <FontAwesomeIcon icon={faFacebookF} />,
            link: 'https://www.facebook.com',
        },
        {
            id: 2,
            label: <FontAwesomeIcon icon={faInstagram} />,
            link: 'https://www.instagram.com',
        },
        {
            id: 3,
            label: <FontAwesomeIcon icon={faXTwitter} />,
            link: 'https://www.twitter.com',
        },
        {
            id: 4,
            label: <FontAwesomeIcon icon={faYoutube} />,
            link: 'https://www.youtube.com',
        },
    ];

    const details: { id: number; label: string; value: string }[] = [
        { id: 1, label: 'Email', value: import.meta.env.VITE_APP_EMAIL },
        {
            id: 2,
            label: 'Mobile #',
            value: import.meta.env.VITE_APP_MOBILE,
        },
        // { id: 3, label: "Landline", value: import.meta.env.VITE_APP_LANDLINE },
        {
            id: 4,
            label: 'Address',
            value: import.meta.env.VITE_APP_ADDRESS,
        },
    ];

    return (
        <>
            <title>{`ABOUT | ${import.meta.env.VITE_APP_NAME}`}</title>

            <ContentBase>
                <div className="my-8 overflow-hidden rounded-lg border border-gray-700">
                    {/* <h1 className="text-3xl font-bold mb-3">About Us Page</h1> */}
                    <Header title="About Us" />
                    <div className="rounded-b bg-slate-900 px-6 py-6 pb-12 text-white">
                        <p className="mb-5 font-medium">
                            Welcome to the ultimate hub for basketball fanatics
                            and prediction pros! Our Bracket Challenge is
                            designed for fans, to bring an extra layer of
                            excitement to every thrilling moment of the NBA &
                            PBA Playoffs. We believe in the power of friendly
                            competition, the agony of a busted bracket, and the
                            sheer joy of watching your dark horse pick defy the
                            odds.
                        </p>

                        <h2 className="mt-6 mb-2 text-xl font-bold">
                            Our Mission
                        </h2>
                        <p className="font-medium">
                            Our mission is to provide the most engaging and
                            user-friendly bracket experience out there. We
                            believe the NBA & PBA Playoffs are about more than
                            just a championship—they're about community,
                            competition, and shared moments of excitement.
                        </p>
                        <p className="mt-2 font-medium">
                            This platform is designed to be your ultimate hub
                            for playoff predictions. It’s where you can test
                            your knowledge, compete for bragging rights, and
                            connect with other fans who love the game as much as
                            you do.
                        </p>

                        <h2 className="mt-6 mb-2 text-xl font-bold">
                            What Makes This Platform Different?
                        </h2>
                        <p className="mb-1 font-medium">
                            We’ve focused on delivering an experience that is
                            seamless, intuitive, and genuinely thrilling.
                        </p>
                        <ul className="list-disc space-y-1 pl-5">
                            {/* <li>
							<strong>Real-time Updates :</strong> Track your bracket's
							progress in real-time, with live scores and standings that
							keep you on the edge of your seat.
						</li> */}
                            <li>
                                <strong>Intuitive Design :</strong> The platform
                                is built to be clean and easy to use, so you can
                                quickly fill out your bracket and get straight
                                to the fun.
                            </li>
                            <li>
                                <strong>A Fan-First Approach :</strong>{' '}
                                Everything about this platform, from the
                                features to the content, is designed to amplify
                                the excitement of the playoffs and bring fans
                                closer to the game.
                            </li>
                        </ul>

                        <h2 className="mt-6 mb-2 text-xl font-bold">
                            Join the Community
                        </h2>
                        <p className="font-medium">
                            Beyond just predictions, our Bracket Challenge is
                            about community. It's where you can compete for
                            bragging rights, share your insights (or commiserate
                            over unexpected upsets!), and feel more connected to
                            the game you love.
                        </p>

                        <h2 className="mt-6 mb-2 text-xl font-bold">
                            Behind The Bracket
                        </h2>
                        <p className="font-medium">
                            I'm Charlou Nicolas, the creator of this Basketball
                            Survivor. This platform is the result of my lifelong
                            obsession with basketball and a personal mission to
                            build something truly special for fellow fans.
                        </p>
                        <p className="mt-2 font-medium">
                            I've been a die-hard basketball enthusiast for as
                            long as I can remember. From the agony of a busted
                            bracket to the thrill of an underdog victory, I
                            understand the emotional rollercoaster of the
                            playoffs. With a professional background in software
                            development, I decided to combine my skills and
                            passion to create a better, more engaging experience
                            for everyone.
                        </p>

                        <div className="mt-7 space-x-2">
                            <CustomLink
                                href="/privacy-policy"
                                label="Privay Policy"
                                type="button"
                            />

                            <CustomLink
                                href="/terms-of-service"
                                label="Terms of Service"
                                type="button"
                            />
                        </div>

                        <hr className="my-6 border-gray-400" />

                        <div className="space-y-10 gap-x-6 lg:flex lg:space-y-0">
                            <div className="w-80 flex-none">
                                <div>
                                    <Icon className="w-full max-w-45" />
                                    <h2 className="mb-2 text-lg font-bold">
                                        Basketball Survivor
                                    </h2>
                                    {/* <hr className="my-2 border-gray-400" /> */}
                                    <div className="mt-4 space-y-4">
                                        {details.map((detail) => (
                                            // <Detail
                                            // 	key={detail.id}
                                            // 	label={detail.label}
                                            // 	size="xs"
                                            // >
                                            // 	{detail.value}
                                            // </Detail>

                                            <div key={detail.id} className="">
                                                <p className="min-w-20 flex-none text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                                    {detail.label}
                                                </p>
                                                <p>{detail.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center gap-x-2">
                                        {socials.map((social) => (
                                            <a
                                                key={social.id}
                                                href={social.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex aspect-square w-9 flex-none items-center justify-center rounded-full border border-gray-400 text-gray-300 hover:bg-gray-600"
                                            >
                                                {social.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h4 className="mb-2 text-xl font-bold">
                                    Leave A Message
                                </h4>
                                {hasErrors && (
                                    <PromptMessage
                                        type="error"
                                        errors={errors}
                                    />
                                )}
                                {success && (
                                    <PromptMessage
                                        type="success"
                                        message={success}
                                    />
                                )}
                                <form
                                    onSubmit={leaveMessage}
                                    className="space-y-3"
                                >
                                    <input
                                        type="name"
                                        id="name"
                                        value={data.name}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm autofill:bg-gray-800 focus:border-gray-300 focus:ring-gray-300 focus:outline-none"
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        disabled={processing}
                                        placeholder="Name"
                                        required
                                    />
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        className="fill:bg-gray-800 w-full rounded-md border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-gray-300 focus:ring-gray-300 focus:outline-none"
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        disabled={processing}
                                        placeholder="Email"
                                        required
                                    />
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        className="border-gray-30 h-26 h-36 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-white placeholder-gray-400 focus:border-gray-300 focus:ring-gray-300 focus:outline-none"
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        disabled={processing}
                                        required
                                        placeholder="Message"
                                    ></textarea>
                                    <CustomButton
                                        label="Submit"
                                        disabled={processing}
                                        loading={processing}
                                        className="w-full uppercase md:w-44"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </ContentBase>
        </>
    );
};

About.layout = (page: React.ReactNode) => <AppCustomLayout children={page} />;

export default About;

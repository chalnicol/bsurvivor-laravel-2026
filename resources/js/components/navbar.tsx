import { useOutsideClick } from '@/hooks/use-outside-click';
import { User as UserType } from '@/types/auth';
import { Link, useForm, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ChevronDown, Menu, User, User2Icon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import NavLink from './navLink';
import Icon from './icon';
import CustomLink from './customLink';
import { cn } from '@/lib/utils';

const Navbar = ({ className }: { className?: string }) => {
  const { post } = useForm();

  const { auth } = usePage<{ auth: any }>().props;

  // Use the globally shared count from your middleware.
  // This works for BOTH guests and logged-in users.
  // const cartCount = auth.cart_item_count || 0;

  // If you still need the user object for the profile dropdown/name:
  const user = auth.user as UserType | null;

  const isAdmin =
    user &&
    user.roles &&
    (user.roles.includes('admin') || user.roles.includes('moderator'));

  // console.log('auth user', user);

  const [showHiddenMenu, setShowHiddenMenu] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // const hiddenMenuRef = useRef<HTMLDivElement>(null);
  const hiddenMenuRef = useRef<(HTMLDivElement | null)[]>([]);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const parentProfileMenuRef = useOutsideClick<HTMLLIElement>(() => {
    // 2. Callback function: close the dropdown when an outside click occurs
    setShowProfileMenu(false);
  });

  // Update the function to take a "type" or the "setter"
  const closeMenuAnimation = (menuType?: 'profile' | 'hidden') => {
    // 1. Profile Menu Logic (Scale animation)
    if ((menuType === 'profile' || showProfileMenu) && profileMenuRef.current) {
      gsap.to(profileMenuRef.current, {
        height: 0,
        duration: 0.6,
        ease: 'elastic.in(1, 0.5)',
        onComplete: () => setShowProfileMenu(false),
      });
    }

    // 2. Hidden Menu Logic (Timeline animation)
    if ((menuType === 'hidden' || showHiddenMenu) && hiddenMenuRef.current[0]) {
      const tl = gsap.timeline({
        onComplete: () => setShowHiddenMenu(false),
      });

      tl.to(hiddenMenuRef.current[0], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }).to(
        hiddenMenuRef.current[1],
        {
          xPercent: 100,
          duration: 0.3,
          ease: 'power2.in',
        },
        '<',
      );
    }
  };

  const toggleMenu = (
    currentValue: boolean,
    setterFunc: React.Dispatch<React.SetStateAction<boolean>>,
    type: 'profile' | 'hidden', // Add a type hint
  ) => {
    // if (isCategoryListOpen) showCategoryList(false);

    if (!currentValue) {
      setterFunc(true);
    } else {
      closeMenuAnimation(type); // Tells the animation exactly which one to run
    }
  };

  // Usage:
  const handleProfileMenuClick = () =>
    toggleMenu(showProfileMenu, setShowProfileMenu, 'profile');
  const handleMenuClick = () =>
    toggleMenu(showHiddenMenu, setShowHiddenMenu, 'hidden');

  const handleLogout = async () => {
    setShowProfileMenu(false);
    if (showHiddenMenu) {
      closeMenuAnimation();
    }

    post('/logout', {
      onBefore: () => {
        console.log('logging out...');
      },
    });
  };

  useEffect(() => {
    const tl = gsap.timeline();

    if (showHiddenMenu && hiddenMenuRef.current) {
      // Clear any previous inline styles to prevent conflicts
      gsap.set(hiddenMenuRef.current[0], { clearProps: 'all' });
      gsap.set(hiddenMenuRef.current[1], { clearProps: 'all' });

      tl.from(hiddenMenuRef.current[0], {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      }).from(
        hiddenMenuRef.current[1],
        {
          xPercent: 100,
          duration: 0.4,
          ease: 'power4.out',
        },
        '-=0.2',
      );
    }

    if (showProfileMenu && profileMenuRef.current) {
      gsap.fromTo(
        profileMenuRef.current,
        { height: 0 },
        {
          height: 'auto',
          duration: 0.5,
          ease: 'elastic(1, 0.6)',
          transformOrigin: 'top right',
        },
      );
    }

    const handleResize = () => {
      if (window.innerWidth > 768 && showHiddenMenu) {
        setShowHiddenMenu(false);
      }
      if (window.innerWidth <= 768 && showProfileMenu) {
        setShowProfileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      gsap.killTweensOf(hiddenMenuRef.current);
    };
  }, [
    showHiddenMenu,
    showProfileMenu,
    hiddenMenuRef.current,
    profileMenuRef.current,
  ]);

  const fullName = user ? `${user.full_name}` : 'Unknown User';
  const email = user ? user.email : '--';

  const links: { href: string; label: string; icon: string }[] = [
    { href: '/', label: 'Home', icon: 'Home' },
    {
      href: '/bracket-challenges',
      label: 'Bracket Challenges',
      icon: 'Trophy',
    },
    { href: '/about', label: 'About', icon: 'Info' },
  ];

  return (
    <nav
      className={cn(
        'flex h-14 border-b border-gray-700 bg-slate-950 text-white',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-x-6 px-4 text-gray-600">
        <div className="navbar-brand">
          <Link href="/">
            {/* Basketball Survivor */}
            <Icon className="h-9 object-contain" />
          </Link>
        </div>
        <div className="hidden flex-1 items-center md:flex">
          <ul className="space-x-3">
            {links.map((link, i) => (
              <CustomLink
                key={i}
                href={link.href}
                label={link.label}
                type="text"
                // className="text-sm tracking-widest uppercase"
              />
            ))}
          </ul>

          <ul className="ml-auto flex flex-none items-center space-x-3">
            {user ? (
              <>
                <li>
                  <NavLink
                    type="circle"
                    href="/profile/notifications"
                    only={['data']}
                    preserveState
                    showIndicatorCount={user.unread_notifications_count > 0}
                    indicatorCount={user.unread_notifications_count}
                    icon="Bell"
                  />
                </li>
                <li className="relative" ref={parentProfileMenuRef}>
                  <button
                    className="group flex cursor-pointer items-center justify-center gap-x-1 py-1 text-white shadow active:scale-95"
                    onClick={handleProfileMenuClick}
                  >
                    {/* <span className="text-sm font-semibold tracking-wider">
                                            {user.username}
                                        </span> */}
                    <div className="flex aspect-square items-center justify-center rounded-full border border-gray-300 px-1.5 text-gray-300 group-hover:bg-gray-800">
                      <User2Icon size={20} />
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-300 group-hover:text-slate-600',
                        showProfileMenu ? 'rotate-180' : '',
                      )}
                    />
                  </button>
                  {showProfileMenu && (
                    <div
                      ref={profileMenuRef}
                      className="absolute top-full right-0 z-50 mt-0.5 w-48 overflow-hidden rounded border border-gray-500 bg-gray-900/90 p-1.5 shadow-lg shadow-gray-800"
                    >
                      <div className="rounded bg-gray-700 px-2 py-1.5 text-sm font-semibold">
                        <p className="text-gray-200">{fullName}</p>
                        <p className="text-xs text-slate-400">{email}</p>
                      </div>
                      <ul className="mt-1">
                        <li>
                          <CustomLink
                            href="/profile"
                            label="Profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="w-full p-1 text-sm"
                          />
                        </li>
                        {isAdmin && (
                          <li>
                            <CustomLink
                              href="/admin"
                              label="Admin Dashboard"
                              onClick={() => setShowProfileMenu(false)}
                              className="w-full p-1 text-sm"
                            />
                          </li>
                        )}
                        <hr className="my-1 border-b border-gray-700" />
                        <li>
                          <button
                            className="block w-full cursor-pointer p-1 text-left text-sm text-white hover:text-slate-400"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <CustomLink
                    href="/login"
                    label="Login"
                    className="text-sm uppercase"
                    type="button"
                  />
                </li>
                <li>
                  <CustomLink
                    href="/register"
                    label="Register"
                    className="text-sm uppercase"
                    type="button"
                  />
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="relative ml-auto md:hidden">
          <button
            className="cursor-pointer rounded border border-gray-500 px-2 py-1.5 text-white shadow hover:bg-gray-800"
            onClick={handleMenuClick}
          >
            {showHiddenMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
          {user && user.unread_notifications_count > 0 && !showHiddenMenu && (
            <p className="absolute -top-1 -right-1.5 aspect-square w-3 rounded-full bg-rose-500 transition duration-300"></p>
          )}
        </div>

        {showHiddenMenu && (
          <div className="fixed bottom-0 left-0 z-20 h-[calc(100dvh-56px)] w-full text-white">
            <div
              ref={(el) => {
                hiddenMenuRef.current[0] = el;
              }}
              className="absolute inset-0 bg-gray-600/50"
              onClick={() => closeMenuAnimation()}
            ></div>
            <div
              ref={(el) => {
                hiddenMenuRef.current[1] = el;
              }}
              className="absolute top-0 right-0 h-full w-11/12 max-w-72 space-y-1.5 overflow-y-auto bg-gray-900 p-3 text-white"
            >
              {links.map((link, i) => (
                <NavLink
                  key={i}
                  type="rect"
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  onClick={() => closeMenuAnimation('hidden')}
                />
              ))}
              {/* <hr className="my-4 border-gray-500" /> */}

              {user ? (
                <>
                  <NavLink
                    type="rect"
                    href="/profile/notifications"
                    showIndicatorCount={user.unread_notifications_count > 0}
                    indicatorCount={user.unread_notifications_count}
                    onClick={() => closeMenuAnimation('hidden')}
                    icon="Bell"
                    label="Notifications"
                  />

                  <div className="rounded border border-gray-600 bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-white">
                    <div className="flex items-center gap-x-2">
                      <User2Icon size={16} />
                      <div>
                        <p>{fullName}</p>
                        <p className="text-xs text-slate-400">{email}</p>
                      </div>
                    </div>
                  </div>
                  <ul className="">
                    <li>
                      <Link
                        href="/profile"
                        className="block w-full border-t border-gray-300 px-3 py-2"
                        onClick={() => closeMenuAnimation('hidden')}
                      >
                        Profile
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link
                          href="/admin"
                          className="block w-full border-t border-gray-300 px-3 py-2"
                          onClick={() => closeMenuAnimation('hidden')}
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    )}

                    <li>
                      <button
                        className="block w-full border-y border-gray-300 px-3 py-2 text-left"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                // <NavLink
                //     type="rect"
                //     href="/login"
                //     onClick={() => closeMenuAnimation('hidden')}
                //     icon="User"
                //     label="Login/Register"
                // />
                <>
                  <NavLink
                    type="rect"
                    href="/login"
                    icon="LogIn"
                    label="Login"
                    onClick={() => closeMenuAnimation('hidden')}
                  />
                  <NavLink
                    type="rect"
                    href="/register"
                    icon="UserPlus"
                    label="Register"
                    onClick={() => closeMenuAnimation('hidden')}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

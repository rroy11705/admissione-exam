import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;
  activeClassName?: string;
  inactiveClassName?: string;
  className?: string;
};

const ActiveLink: React.FC<ActiveLinkProps> = ({
  children,
  href,
  activeClassName,
  inactiveClassName,
  className,
}) => {
  const router = useRouter();

  const isActive = React.useMemo(() => router.pathname === href, [router.pathname]);

  return (
    <Link href={href} passHref>
      <a className={classNames(className, isActive ? activeClassName : inactiveClassName)}>
        {children}
      </a>
    </Link>
  );
};

export default ActiveLink;

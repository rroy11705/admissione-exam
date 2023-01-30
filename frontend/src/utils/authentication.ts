import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import cookie from 'cookie';
import type { IncomingMessage } from 'http';
import type { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { verifyUser } from '../apis/requests/auth.requests';
import { IUser } from '../types';

type Request = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

export default function parseCookies(req?: Request) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export function withAuth<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (
    context: GetServerSidePropsContext & { req: { user?: IUser } },
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return async function checkJwtToken(
    context: GetServerSidePropsContext & { req: { user?: IUser } },
  ) {
    const cookies = parseCookies(context.req);

    const destination = '/';

    if (!cookies.token) {
      return {
        redirect: {
          permanent: true,
          destination,
        },
        props: {},
      };
    }

    try {
      const result = await verifyUser(cookies.token);

      context.req.user = result.data.user;

      return handler({ ...context });
    } catch (error) {
      return {
        redirect: {
          permanent: true,
          destination,
        },
        props: {},
      };
    }
  };
}

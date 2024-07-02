import { getSession } from 'next-auth/react';
import { NextApiRequest } from 'next';

export const getCurrentUser = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }


  return session.user;
};

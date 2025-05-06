'use client';
import { useEffect } from 'react';
import { useAppDispatch } from './lib/hooks';
import { useSession } from 'next-auth/react';
import { getClasses, updateReduxClassList } from './lib/features/classManagement';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      const fetchClasses = async () => {
        try {
          const response = await dispatch(getClasses({ accessToken: session.user.accessToken }));
          await dispatch(updateReduxClassList(response.payload?.data));
        } catch (err) {
          console.error('Error fetching classes:', err);
        }
      };

      fetchClasses();
    }
  }, [dispatch, session?.user?.accessToken]);

  return <>{children}</>; // ✅ return children so it wraps layout/pages properly
};

export default ReduxProvider;

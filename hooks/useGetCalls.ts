import { useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = useStreamVideoClient();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const appwriteClient = new Client()
          .setEndpoint('https://appwrite.xeve.dev/v1') // Your API Endpoint
          .setProject('mvvideocall'); // Your project ID

        const account = new Account(appwriteClient);
        const user = await account.get();
        setUser(user.$id);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user) return;

      setIsLoading(true);

      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user },
              { members: { $in: [user] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadCalls();
    }
  }, [client, user]);

  const now = new Date();

  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls.filter(({ state: { startsAt } }) => {
    return startsAt && new Date(startsAt) > now;
  });

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};

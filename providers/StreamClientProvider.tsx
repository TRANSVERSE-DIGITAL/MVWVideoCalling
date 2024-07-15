'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { Client, Account } from 'appwrite';
import { useRouter } from 'next/navigation';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        const client = new Client()
          .setEndpoint('https://appwrite.xeve.dev/v1') // Your Appwrite endpoint
          .setProject('mvvideocall'); // Your project ID

        const account = new Account(client);
        const user = await account.get();

        if (!user) {
          setIsAuthenticated(false);
          return;
        }

        if (!API_KEY) {
          throw new Error('Stream API key is missing');
        }

        const videoClient = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user.$id,
            name: user.name || user.$id,
          },
          tokenProvider,
        });

        setVideoClient(videoClient);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null || (isAuthenticated && !videoClient)) {
    return <Loader />;
  }

  return videoClient ? <StreamVideo client={videoClient}>{children}</StreamVideo> : null;
};

export default StreamVideoProvider;

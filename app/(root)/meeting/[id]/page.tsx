'use client';

import { useEffect, useState } from 'react';
import { Client, Account } from 'appwrite';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';

const MeetingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const client = new Client()
          .setEndpoint('https://appwrite.xeve.dev/v1') // Your API Endpoint
          .setProject('metaspheres'); // Your project ID

        const account = new Account(client);
        const user = await account.get();
        setUser(user);
      } catch (error) {
       console.error(error);
      }
    };

    fetchUser();
  }, [router]);

  if (isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.$id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;

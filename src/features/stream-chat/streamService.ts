import { useEffect, useState } from "react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import { useGetStreamTokenMutation } from "@/generated/hooks";

type Status = "idle" | "loading" | "ready" | "error";

export function useStreamChat(userId?: string) {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const getStreamToken = useGetStreamTokenMutation({});

  useEffect(() => {
    if (!userId) return;

    let streamClient: StreamChat;
    setStatus("loading");

    getStreamToken
      .mutateAsync({})
      .then((res) => {
        const token = res.getStreamToken;
        if (!token) throw new Error("No Stream token returned");

        streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_KEY);
        return streamClient.connectUser({ id: userId }, token);
      })
      .then(() => {
        setClient(streamClient);

        const demoChannel = streamClient.channel("messaging", "demo", {
          name: "Demo Chat",
          members: [userId],
        });
        return demoChannel.watch().then(() => {
          setChannel(demoChannel);
          setStatus("ready");
        });
      })
      .catch((err) => {
        console.error("StreamChat init failed", err);
        setStatus("error");
      });

    return () => {
      streamClient?.disconnectUser();
      setClient(null);
      setChannel(null);
      setStatus("idle");
    };
  }, [userId]);

  return { client, channel, status };
}

import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { useMeQuery } from "@/generated/hooks";
import { useStreamChat } from "../streamService";

export function ChatPage() {
  const { data: meData, loading } = useMeQuery();
  const user = meData?.me;
  const { client, channel, status } = useStreamChat(user?.id);

  if (loading) return <p>Loading user…</p>;
  if (!user) return <p>Please log in to use chat.</p>;
  if (status !== "ready" || !client) return <p>Connecting to chat…</p>;

  return (
    <Chat client={client} theme="messaging light">
      {/* Sidebar with channels */}
      <ChannelList filters={{ members: { $in: [user.id] } }} />

      {/* Active channel */}
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, MoreVertical, User, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FarmerBottomNav from "@/components/FarmerBottomNav";
import { messagingService, Message } from "@/services/firebase/messagingService";
import { useAuth } from "@/context/AuthContext";
import { onSnapshot, orderBy, query, collection, where } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { Timestamp } from "firebase/firestore";

const FarmerMessageDetail = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState({ name: "", role: "", status: "accepted" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversation details and messages
  useEffect(() => {
    if (!currentUser || !conversationId) return;

    // Get conversation details to identify the other user
    const conversationRef = messagingService.getConversationsForUser(currentUser.uid);
    const conversationUnsubscribe = onSnapshot(conversationRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.doc.id === conversationId) {
          const convoData = change.doc.data();
          const otherParticipantIndex = convoData.participants.findIndex((id: string) => id !== currentUser.uid);
          setOtherUser({
            name: convoData.participantNames[otherParticipantIndex] || `User ${convoData.participants[otherParticipantIndex].substring(0, 5)}`,
            role: convoData.participantRoles[otherParticipantIndex] || 'buyer',
            status: convoData.status || 'accepted'
          });
        }
      });
    });

    // Get messages for this conversation
    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const messagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const msgData = change.doc.data();
          msgs.push({
            id: change.doc.id,
            senderId: msgData.senderId,
            receiverId: msgData.receiverId,
            senderRole: msgData.senderRole,
            receiverRole: msgData.receiverRole,
            message: msgData.message,
            timestamp: msgData.timestamp,
            read: msgData.read
          });
        }
      });

      setMessages(msgs);
      setLoading(false);

      // Mark conversation as read
      messagingService.markConversationAsRead(currentUser.uid, conversationId);
    });

    // Clean up subscriptions
    return () => {
      conversationUnsubscribe();
      messagesUnsubscribe();
    };
  }, [currentUser, conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !conversationId) return;

    try {
      // Extract the other user's ID from the conversation ID
      const [userId1, userId2] = conversationId.split('_');
      const receiverId = userId1 === currentUser.uid ? userId2 : userId1;

      // Get the other user's role from the conversation data
      const otherUserRole = otherUser.role === 'buyer' ? 'buyer' : 'farmer';

      await messagingService.sendMessage(
        currentUser.uid,
        receiverId,
        'farmer',
        otherUserRole as 'farmer' | 'buyer',
        newMessage.trim()
      );

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/farmer/messages" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{otherUser.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{otherUser.role}</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUser?.uid;
          const messageTime = message.timestamp ?
            new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now';

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${isOwnMessage
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                  }`}
              >
                <p className="text-sm">{message.message}</p>
                <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs opacity-70">{messageTime}</span>
                  {isOwnMessage && (
                    <div className="flex items-center">
                      {message.read ? (
                        <CheckCheck className="w-3 h-3 opacity-70" />
                      ) : (
                        <Check className="w-3 h-3 opacity-70" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input or Accept Banner */}
      <div className="bg-card border-t border-border p-4 safe-bottom">
        {otherUser.status === 'pending' ? (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="text-sm font-medium text-foreground">Connection Request Pending</p>
              <p className="text-xs text-muted-foreground">Accept this request to start chatting with the buyer.</p>
            </div>
            <Button
              variant="farmer"
              onClick={() => messagingService.acceptRequest(conversationId!)}
            >
              Accept Request
            </Button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="pr-12 py-3"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerMessageDetail;
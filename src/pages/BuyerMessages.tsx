import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, Phone, User, MoreVertical, Send, Image, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BuyerBottomNav from "@/components/BuyerBottomNav";
import { messagingService, Conversation } from "@/services/firebase/messagingService";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/services/firebase/config";

const BuyerMessages = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to conversations for the current user
    const conversationsQuery = messagingService.getConversationsForUser(currentUser.uid);
    
    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      const convos: Conversation[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const convoData = change.doc.data() as any;
          const unreadCount = convoData[`unreadCount_${currentUser.uid}`] || 0;
          
          convos.push({
            id: change.doc.id,
            participants: convoData.participants || [],
            participantNames: convoData.participantNames || [],
            participantRoles: convoData.participantRoles || [],
            lastMessage: convoData.lastMessage || '',
            lastMessageTime: convoData.lastMessageTime || null,
            unreadCount: unreadCount
          });
        }
      });
      
      setConversations(convos);
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/buyer/dashboard" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">3 conversations</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Conversations List */}
      <div className="px-4 py-4">
        <div className="space-y-2">
          {conversations.map((conversation) => {
            // Find the other participant (not the current user)
            const otherParticipantIndex = conversation.participants.findIndex(id => id !== currentUser?.uid);
            const otherParticipantId = conversation.participants[otherParticipantIndex];
            const otherParticipantName = conversation.participantNames[otherParticipantIndex] || `User ${otherParticipantId.substring(0, 5)}`;
            const otherParticipantRole = conversation.participantRoles[otherParticipantIndex] || 'farmer';
            
            // Get the first two letters of the name for the avatar
            const avatarLetters = otherParticipantName.substring(0, 2).toUpperCase();
            
            return (
              <button
                key={conversation.id}
                onClick={() => navigate(`/buyer/messages/${conversation.id}`)}
                className="w-full bg-card rounded-2xl p-4 shadow-card border border-border text-left hover:shadow-elevated transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-secondary">{avatarLetters}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{otherParticipantName}</h3>
                      {/* Format timestamp to readable time */}
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessageTime ? 
                          new Date(conversation.lastMessageTime.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : 'Just now'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1 capitalize">{otherParticipantRole}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-xs font-bold text-secondary-foreground">{conversation.unreadCount}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Empty State */}
      <div className="px-4 py-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Start conversations with farmers about their listings
        </p>
        <Link to="/buyer/dashboard" className="mt-4 inline-block">
          <Button variant="secondary">Browse Listings</Button>
        </Link>
      </div>

      <BuyerBottomNav />
    </div>
  );
};

export default BuyerMessages;
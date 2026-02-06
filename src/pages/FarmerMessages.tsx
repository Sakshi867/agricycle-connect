import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Phone, User, MoreVertical, Send, Image, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FarmerBottomNav from "@/components/FarmerBottomNav";

const FarmerMessages = () => {
  const navigate = useNavigate();

  const conversations = [
    {
      id: 1,
      name: "Green Energy Solutions",
      lastMessage: "Is the rice husk still available?",
      time: "2h ago",
      unread: 2,
      avatar: "GE",
      businessType: "Biomass Energy"
    },
    {
      id: 2,
      name: "Organic Compost Co.",
      lastMessage: "Can we pickup tomorrow?",
      time: "5h ago",
      unread: 0,
      avatar: "OC",
      businessType: "Composting"
    },
    {
      id: 3,
      name: "Agri Materials Ltd",
      lastMessage: "Interested in bulk purchase",
      time: "1d ago",
      unread: 1,
      avatar: "AM",
      businessType: "Industrial Buyer"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/farmer/dashboard" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
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
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => navigate(`/farmer/messages/${conversation.id}`)}
              className="w-full bg-card rounded-2xl p-4 shadow-card border border-border text-left hover:shadow-elevated transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{conversation.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{conversation.businessType}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{conversation.unread}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      <div className="px-4 py-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No new messages</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Buyers will message you about your listings. Check back later!
        </p>
      </div>

      <FarmerBottomNav />
    </div>
  );
};

export default FarmerMessages;
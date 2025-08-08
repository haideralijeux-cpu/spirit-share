import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Quote, Trash2, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { EditQuoteDialog } from '@/components/EditQuoteDialog';

interface UserQuote {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

interface UserProfile {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export function Profile() {
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('id, content, author, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setQuotes(quotesData || []);
      setProfile(profileData || null);
    } catch (error: any) {
      toast({
        title: 'Error loading your data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quoteId: string) => {
    setDeletingId(quoteId);

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId)
        .eq('user_id', user?.id); // Extra security check

      if (error) throw error;

      setQuotes(quotes.filter(quote => quote.id !== quoteId));
      
      toast({
        title: 'Quote deleted ✨',
        description: 'Your quote has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to delete quote',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuoteUpdate = (updatedQuote: UserQuote) => {
    setQuotes(quotes.map(quote => 
      quote.id === updatedQuote.id ? updatedQuote : quote
    ));
  };

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile } as UserProfile));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 animate-glow">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="text-lg text-muted-foreground font-medium">Loading your beautiful quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 animate-float">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile avatar" 
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <User className="h-8 w-8 text-white" />
          )}
          <User className="h-8 w-8 text-white hidden" />
        </div>
        <h1 className="text-5xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          {profile?.display_name || 'My Quotes Collection'}
        </h1>
        {profile?.bio && (
          <p className="text-lg text-muted-foreground font-medium mb-4 max-w-2xl mx-auto">
            {profile.bio}
          </p>
        )}
        <div className="inline-flex items-center gap-3 bg-card/70 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-gradient-primary animate-pulse"></div>
          <p className="text-lg text-muted-foreground font-medium">
            {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} shared
          </p>
        </div>
        <div className="flex gap-3 justify-center mb-6">
          <Link to="/home/submit">
            <Button className="bg-gradient-primary hover:shadow-glow font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
              <Plus className="h-5 w-5 mr-2" />
              Add New Quote
            </Button>
          </Link>
        </div>
        <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
      </div>
      
      {/* Profile Information Card */}
      <div className="mb-12 animate-fade-in">
        <Card className="max-w-2xl mx-auto bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden card-hover">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile avatar" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center border-4 border-white/20 ${profile?.avatar_url ? 'hidden' : ''}`}>
                  <User className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  {profile?.display_name || user?.email || 'QuickQuotes User'}
                </h2>
                {profile?.display_name && (
                  <p className="text-muted-foreground font-medium mb-2">
                    {user?.email}
                  </p>
                )}
                {profile?.bio && (
                  <p className="text-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
              <EditProfileDialog onProfileUpdate={handleProfileUpdate} />
            </div>
          </CardHeader>
        </Card>
      </div>
      
      {quotes.length === 0 ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-accent mb-8 animate-float">
            <Quote className="h-10 w-10 text-accent-foreground" />
          </div>
          <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">No quotes yet</h3>
          <p className="text-lg text-muted-foreground font-medium mb-8 max-w-md mx-auto">
            Start your journey by sharing your first inspiring quote with the world! ✨
          </p>
          <Link to="/home/submit">
            <Button className="bg-gradient-primary hover:shadow-glow font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
              <Plus className="h-5 w-5 mr-2" />
              Share Your First Quote 🚀
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {quotes.map((quote, index) => (
            <Card 
              key={quote.id} 
              className={`relative group card-hover card-glow bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Quote className="h-6 w-6 text-primary" />
                    <div className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <EditQuoteDialog 
                      quote={quote}
                      onQuoteUpdate={handleQuoteUpdate}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(quote.id)}
                      disabled={deletingId === quote.id}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-destructive hover:text-white hover:bg-destructive rounded-lg"
                    >
                      {deletingId === quote.id ? (
                        <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-8">
                <div className="space-y-6">
                  <blockquote className="text-lg font-serif font-medium text-foreground leading-relaxed">
                    "{quote.content}"
                  </blockquote>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <cite className="font-semibold text-primary bg-gradient-primary bg-clip-text text-transparent">
                      — {quote.author}
                    </cite>
                    <time 
                      dateTime={quote.created_at}
                      className="text-sm text-muted-foreground font-medium bg-accent/20 px-3 py-1 rounded-full"
                    >
                      {new Date(quote.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
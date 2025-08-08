import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Quote, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserQuote {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export function Profile() {
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserQuotes();
    }
  }, [user]);

  const fetchUserQuotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, content, author, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading your quotes',
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
        title: 'Quote deleted',
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading your quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Quotes</h1>
        <p className="text-muted-foreground mb-4">
          {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} shared
        </p>
        
        {quotes.length === 0 && (
          <Link to="/submit">
            <Button>Share Your First Quote</Button>
          </Link>
        )}
      </div>

      {quotes.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="relative group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Quote className="h-6 w-6 text-primary" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(quote.id)}
                    disabled={deletingId === quote.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <blockquote className="text-lg font-medium text-foreground leading-relaxed">
                    "{quote.content}"
                  </blockquote>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <cite className="font-medium">— {quote.author}</cite>
                    <time dateTime={quote.created_at}>
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
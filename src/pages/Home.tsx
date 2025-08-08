import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Quote } from 'lucide-react';

interface QuoteData {
  id: string;
  content: string;
  author: string;
  created_at: string;
  profiles: {
    id: string;
  } | null;
}

export function Home() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          content,
          author,
          created_at,
          profiles:user_id (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading quotes',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Inspirational Quotes</h1>
        <p className="text-muted-foreground">Discover wisdom shared by our community</p>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-12">
          <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No quotes yet</h3>
          <p className="text-muted-foreground">Be the first to share an inspiring quote!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-primary" />
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
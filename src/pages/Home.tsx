import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Quote, Sparkles } from 'lucide-react';

interface QuoteData {
  id: string;
  content: string;
  author: string;
  created_at: string;
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
        .select('id, content, author, created_at')
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 animate-glow">
            <Quote className="h-8 w-8 text-white" />
          </div>
          <div className="text-lg text-muted-foreground font-medium">Loading beautiful quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 animate-float">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-5xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Inspirational Gallery
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          Discover wisdom and inspiration shared by our beautiful community ✨
        </p>
        <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto mt-6"></div>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-20 animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-accent mb-6 animate-float">
            <Quote className="h-10 w-10 text-accent-foreground" />
          </div>
          <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">No quotes yet</h3>
          <p className="text-lg text-muted-foreground font-medium">Be the first to share an inspiring quote! 🌟</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {quotes.map((quote, index) => (
            <Card 
              key={quote.id} 
              className={`card-hover card-glow bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-primary" />
                    <div className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse"></div>
                  </div>
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
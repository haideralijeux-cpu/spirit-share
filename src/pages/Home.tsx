import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Quote, Sparkles } from 'lucide-react';

// Type definition for quote data from the database
interface QuoteData {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

/**
 * Home page component - displays all quotes from the community
 * 
 * Features:
 * - Loads all quotes from Supabase in chronological order (newest first)
 * - Shows a beautiful gallery layout with animated cards
 * - Handles loading states and error scenarios gracefully
 * - Responsive design that works on all screen sizes
 */
export function Home() {
  // State to store the list of quotes fetched from database
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Fetch all quotes from Supabase database
   * Uses useCallback to prevent unnecessary re-renders and infinite loops
   */
  const fetchQuotes = useCallback(async () => {
    try {
      // Query the quotes table, selecting only needed columns
      // Order by creation date with newest quotes first
      const { data, error } = await supabase
        .from('quotes')
        .select('id, content, author, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuotes(data || []);
    } catch (error) {
      // Show user-friendly error message if something goes wrong
      toast({
        title: 'Error loading quotes',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      // Always stop loading spinner, whether success or failure
      setLoading(false);
    }
  }, [toast]);

  // Load quotes when component mounts
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Show loading spinner while fetching quotes from database
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
      {/* Hero section with page title and description */}
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

      {/* Conditional rendering based on whether we have quotes to display */}
      {quotes.length === 0 ? (
        // Empty state when no quotes exist yet
        <div className="text-center py-20 animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-accent mb-6 animate-float">
            <Quote className="h-10 w-10 text-accent-foreground" />
          </div>
          <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">No quotes yet</h3>
          <p className="text-lg text-muted-foreground font-medium">Be the first to share an inspiring quote! 🌟</p>
        </div>
      ) : (
        // Grid layout for displaying quotes
        // Responsive: 1 column on mobile, 2 on tablet, 3 on desktop
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {quotes.map((quote, index) => (
            <Card 
              key={quote.id} 
              className={`card-hover card-glow bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden animate-scale-in`}
              // Stagger animation timing for each card to create a wave effect
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Quote card header with icon and decorative element */}
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-primary" />
                    <div className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse"></div>
                  </div>
                  
                  {/* The actual quote text */}
                  <blockquote className="text-lg font-serif font-medium text-foreground leading-relaxed">
                    "{quote.content}"
                  </blockquote>
                  
                  {/* Quote footer with author and date */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <cite className="font-semibold text-primary bg-gradient-primary bg-clip-text text-transparent">
                      — {quote.author}
                    </cite>
                    {/* Format the creation date as a human-readable string */}
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
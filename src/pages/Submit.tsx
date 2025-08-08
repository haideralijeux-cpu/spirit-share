import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Quote, Sparkles, Send } from 'lucide-react';

export function Submit() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a quote.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('quotes').insert({
        content: content.trim(),
        author: author.trim(),
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Quote submitted! ✨',
        description: 'Your inspirational quote has been shared with the community.',
      });

      // Reset form
      setContent('');
      setAuthor('');
      
      // Navigate to home to see the new quote
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Failed to submit quote',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 animate-float">
          <Quote className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-5xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Share Your Inspiration
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
          Inspire others by sharing your favorite quote or one you've written ✨
        </p>
        <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto mt-6"></div>
      </div>

      <Card className="card-hover bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-large animate-scale-in">
        <CardHeader className="text-center pb-8 bg-gradient-secondary/30">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-accent mb-4 mx-auto">
            <Sparkles className="h-6 w-6 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">Submit Your Quote</CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">
            Fill in the details below to share an inspiring quote with our community
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="content" className="text-lg font-semibold text-foreground">
                Quote Content
              </Label>
              <Textarea
                id="content"
                placeholder="Enter the quote text here... ✍️"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={5}
                maxLength={500}
                className="resize-none rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg font-serif"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground font-medium">
                  {content.length}/500 characters
                </p>
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  content.length > 400 ? 'bg-warning' : content.length > 0 ? 'bg-success' : 'bg-muted'
                }`}></div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="author" className="text-lg font-semibold text-foreground">
                Author
              </Label>
              <Input
                id="author"
                type="text"
                placeholder="Who said or wrote this quote? 👤"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-lg"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setContent('');
                  setAuthor('');
                }}
                className="flex-1 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300 font-semibold"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim() || !author.trim()}
                className="flex-1 h-12 bg-gradient-primary hover:shadow-glow font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Quote ✨
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
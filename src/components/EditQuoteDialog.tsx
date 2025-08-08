import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Quote, Edit } from 'lucide-react';

interface QuoteData {
  id: string;
  content: string;
  author: string;
}

interface EditQuoteDialogProps {
  quote: QuoteData;
  onQuoteUpdate: (updatedQuote: QuoteData) => void;
}

export function EditQuoteDialog({ quote, onQuoteUpdate }: EditQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(quote.content);
  const [author, setAuthor] = useState(quote.author);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim() || !author.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          content: content.trim(),
          author: author.trim(),
        })
        .eq('id', quote.id)
        .eq('user_id', user.id); // Extra security check

      if (error) throw error;

      const updatedQuote = {
        ...quote,
        content: content.trim(),
        author: author.trim(),
      };

      onQuoteUpdate(updatedQuote);
      
      toast({
        title: 'Quote updated successfully! ✨',
        description: 'Your quote has been saved with the new changes.',
      });

      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Failed to update quote',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContent(quote.content);
    setAuthor(quote.author);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary hover:text-white hover:bg-primary rounded-lg"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-serif font-bold">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Quote className="h-5 w-5 text-white" />
            </div>
            Edit Your Quote
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="content" className="font-semibold text-foreground">
              Quote Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your inspiring quote..."
              rows={4}
              required
              className="bg-background/50 border-border/50 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author" className="font-semibold text-foreground">
              Author
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Quote author or your name"
              required
              className="bg-background/50 border-border/50 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-border/50 hover:bg-accent/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !content.trim() || !author.trim()}
              className="flex-1 bg-gradient-primary hover:shadow-glow font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : null}
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
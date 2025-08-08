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

// Type definition for quote data structure
interface QuoteData {
  id: string;
  content: string;
  author: string;
}

// Props interface for the EditQuoteDialog component
interface EditQuoteDialogProps {
  quote: QuoteData;
  onQuoteUpdate: (updatedQuote: QuoteData) => void;
}

/**
 * EditQuoteDialog component - modal dialog for editing existing quotes
 * 
 * Features:
 * - Pre-populates form with existing quote data
 * - Real-time form validation
 * - Secure database updates with user authentication check
 * - Form reset functionality when dialog is cancelled
 * - Loading states and error handling
 * - Optimistic UI updates via callback to parent component
 */
export function EditQuoteDialog({ quote, onQuoteUpdate }: EditQuoteDialogProps) {
  // Dialog state management
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state - initialized with current quote values
  const [content, setContent] = useState(quote.content);
  const [author, setAuthor] = useState(quote.author);
  
  // Hooks for authentication and user feedback
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Handle form submission - updates quote in database
   * Includes validation and security checks
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - ensure user is authenticated and fields aren't empty
    if (!user || !content.trim() || !author.trim()) return;

    setLoading(true);

    try {
      // Update quote in Supabase database
      // Double security check: match both quote ID and user ID
      const { error } = await supabase
        .from('quotes')
        .update({
          content: content.trim(),
          author: author.trim(),
        })
        .eq('id', quote.id)
        .eq('user_id', user.id); // Extra security: ensure user owns this quote

      if (error) throw error;

      // Create updated quote object for parent component
      const updatedQuote = {
        ...quote,
        content: content.trim(),
        author: author.trim(),
      };

      // Update parent component's state with new data
      onQuoteUpdate(updatedQuote);
      
      // Show success message to user
      toast({
        title: 'Quote updated successfully! ✨',
        description: 'Your quote has been saved with the new changes.',
      });

      // Close the dialog
      setOpen(false);
    } catch (error) {
      // Show error message if update fails
      toast({
        title: 'Failed to update quote',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  /**
   * Reset form fields to original quote values
   * Called when dialog is cancelled or closed
   */
  const resetForm = () => {
    setContent(quote.content);
    setAuthor(quote.author);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        // Reset form to original values when dialog is closed/cancelled
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      {/* Trigger button - only visible on hover over quote card */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary hover:text-white hover:bg-primary rounded-lg"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      {/* Dialog content with backdrop blur effect */}
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-serif font-bold">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Quote className="h-5 w-5 text-white" />
            </div>
            Edit Your Quote
          </DialogTitle>
        </DialogHeader>
        
        {/* Edit form with validation */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Quote content field */}
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
          
          {/* Author field */}
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
          
          {/* Form action buttons */}
          <div className="flex gap-3 pt-4">
            {/* Cancel button - closes dialog without saving */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-border/50 hover:bg-accent/50"
            >
              Cancel
            </Button>
            
            {/* Submit button - disabled during loading or if form is invalid */}
            <Button
              type="submit"
              disabled={loading || !content.trim() || !author.trim()}
              className="flex-1 bg-gradient-primary hover:shadow-glow font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {/* Show spinner during loading */}
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
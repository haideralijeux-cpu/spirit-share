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
import { Quote } from 'lucide-react';

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
        title: 'Quote submitted!',
        description: 'Your inspirational quote has been shared with the community.',
      });

      // Reset form
      setContent('');
      setAuthor('');
      
      // Navigate to home to see the new quote
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Failed to submit quote',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <Quote className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Share a Quote</h1>
        <p className="text-muted-foreground">
          Inspire others by sharing your favorite quote or one you've written
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Quote</CardTitle>
          <CardDescription>
            Fill in the details below to share an inspiring quote with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">Quote Content</Label>
              <Textarea
                id="content"
                placeholder="Enter the quote text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                {content.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                placeholder="Who said or wrote this quote?"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setContent('');
                  setAuthor('');
                }}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim() || !author.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
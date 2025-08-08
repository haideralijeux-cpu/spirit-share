import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Edit } from 'lucide-react';

interface Profile {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface EditProfileDialogProps {
  onProfileUpdate?: (profile: Profile) => void;
}

export function EditProfileDialog({ onProfileUpdate }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    bio: '',
    avatar_url: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      toast({
        title: 'Error loading profile',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  useEffect(() => {
    if (open && user) {
      fetchProfile();
    }
  }, [open, user, fetchProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name || null,
          bio: profile.bio || null,
          avatar_url: profile.avatar_url || null,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: 'Profile updated successfully! ✨',
        description: 'Your profile information has been saved.',
      });

      onProfileUpdate?.(profile);
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="bg-gradient-accent hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] border-border/50"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-serif font-bold">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="display_name" className="font-semibold text-foreground">
              Display Name
            </Label>
            <Input
              id="display_name"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="Enter your display name"
              className="bg-background/50 border-border/50 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="font-semibold text-foreground">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="bg-background/50 border-border/50 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar_url" className="font-semibold text-foreground">
              Avatar URL
            </Label>
            <Input
              id="avatar_url"
              value={profile.avatar_url}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              placeholder="https://example.com/your-avatar.jpg"
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
              disabled={loading}
              className="flex-1 bg-gradient-primary hover:shadow-glow font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : null}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
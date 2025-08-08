import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Quote, Sparkles, Heart, Star, Users, BookOpen, Zap, ArrowRight } from 'lucide-react';

export function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back! ✨',
        description: 'You have successfully signed in.',
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Check your email 📧',
        description: 'We sent you a confirmation link to complete your registration.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stunning animated background with geometric patterns */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute inset-0">
          {/* Large floating circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-200/25 to-teal-200/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-transparent to-cyan-100/50"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(210 90% 65%) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>
      </div>
      
      {/* Floating decoration elements */}
      <div className="absolute top-20 left-10 text-primary/30 animate-float z-10">
        <Quote className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-cyan-500/40 animate-float z-10" style={{ animationDelay: '2s' }}>
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="absolute bottom-32 left-16 text-sky-500/35 animate-float z-10" style={{ animationDelay: '4s' }}>
        <Heart className="h-7 w-7" />
      </div>
      <div className="absolute bottom-20 right-16 text-blue-400/40 animate-float z-10" style={{ animationDelay: '1s' }}>
        <Star className="h-5 w-5" />
      </div>

      <div className="relative min-h-screen z-20">
        {!showAuth ? (
          // Landing Hero Section
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-8 animate-glow">
                <Quote className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-7xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
                QuickQuotes
              </h1>
              <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto mb-8">
                Share inspiring quotes with the world and discover wisdom from our beautiful community ✨
              </p>
              <div className="w-32 h-1 bg-gradient-primary rounded-full mx-auto mb-12"></div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-primary hover:shadow-glow font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAuth(true)}
                  className="font-semibold text-lg px-8 py-4 rounded-xl border-2 border-primary/30 hover:bg-primary/10 transition-all duration-300"
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in">
              <Card className="card-hover bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-accent mb-6 mx-auto">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">Community Driven</h3>
                <p className="text-muted-foreground">Join thousands of quote lovers sharing wisdom and inspiration</p>
              </Card>

              <Card className="card-hover bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 mx-auto">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">Beautiful Gallery</h3>
                <p className="text-muted-foreground">Browse stunning collections of quotes in our responsive gallery</p>
              </Card>

              <Card className="card-hover bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-secondary mb-6 mx-auto">
                  <Zap className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">Quick & Easy</h3>
                <p className="text-muted-foreground">Share your favorite quotes in seconds with our simple interface</p>
              </Card>
            </div>
          </div>
        ) : (
          // Auth Section
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md animate-fade-in-up">
              <div className="text-center mb-10">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAuth(false)}
                  className="mb-6 text-muted-foreground hover:text-foreground"
                >
                  ← Back to Home
                </Button>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6 animate-glow">
                  <Quote className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-serif font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                  Welcome to QuickQuotes
                </h2>
                <p className="text-lg text-muted-foreground font-medium">
                  Join our community of quote enthusiasts ✨
                </p>
                <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto mt-4"></div>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-1">
                  <TabsTrigger 
                    value="signin" 
                    className="rounded-lg font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="rounded-lg font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <Card className="bg-card/70 backdrop-blur-sm border border-border/50 shadow-large rounded-2xl overflow-hidden">
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-2xl font-serif text-foreground">Welcome Back</CardTitle>
                      <CardDescription className="text-muted-foreground font-medium">
                        Sign in to continue sharing beautiful quotes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <form onSubmit={handleSignIn} className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="signin-email" className="text-sm font-semibold text-foreground">
                            Email Address
                          </Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="signin-password" className="text-sm font-semibold text-foreground">
                            Password
                          </Label>
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-primary hover:shadow-glow font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Signing in...
                            </div>
                          ) : (
                            'Sign In ✨'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <Card className="bg-card/70 backdrop-blur-sm border border-border/50 shadow-large rounded-2xl overflow-hidden">
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-2xl font-serif text-foreground">Join QuickQuotes</CardTitle>
                      <CardDescription className="text-muted-foreground font-medium">
                        Create your account to start sharing inspiration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <form onSubmit={handleSignUp} className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="signup-email" className="text-sm font-semibold text-foreground">
                            Email Address
                          </Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="signup-password" className="text-sm font-semibold text-foreground">
                            Password
                          </Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                          />
                          <p className="text-xs text-muted-foreground">Must be at least 6 characters long</p>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-primary hover:shadow-glow font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Creating account...
                            </div>
                          ) : (
                            'Create Account 🚀'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Quote, Sparkles, Heart, Star, Users, BookOpen, Zap, ArrowRight, Edit3, Wand2, Palette } from 'lucide-react';

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
      {/* Enhanced animated background with purple-pink theme */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute inset-0">
          {/* Large floating circles with enhanced animation */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-300/30 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-200/35 to-fuchsia-200/35 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-violet-300/25 to-purple-200/25 rounded-full blur-3xl animate-pulse-slow"></div>
          
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/60 via-transparent to-pink-100/60"></div>
          
          {/* Enhanced grid pattern with rotation */}
          <div className="absolute inset-0 opacity-10 animate-rotate">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(280 90% 65%) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced floating decoration elements */}
      <div className="absolute top-20 left-10 text-primary/40 animate-float z-10">
        <Quote className="h-8 w-8" />
      </div>
      <div className="absolute top-40 right-20 text-pink-500/50 animate-float-delayed z-10">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="absolute bottom-32 left-16 text-violet-500/45 animate-float-slow z-10">
        <Heart className="h-7 w-7" />
      </div>
      <div className="absolute bottom-20 right-16 text-purple-400/50 animate-bounce-in z-10">
        <Star className="h-5 w-5" />
      </div>
      <div className="absolute top-1/2 left-20 text-fuchsia-400/40 animate-pulse-slow z-10">
        <Edit3 className="h-6 w-6" />
      </div>
      <div className="absolute top-1/3 right-10 text-purple-500/35 animate-float z-10">
        <Wand2 className="h-7 w-7" />
      </div>

      <div className="relative min-h-screen z-20">
        {!showAuth ? (
          // Enhanced Landing Hero Section
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-primary mb-8 animate-glow card-hover">
                <Quote className="h-14 w-14 text-white animate-pulse-slow" />
              </div>
              <h1 className="text-8xl font-serif font-bold text-gradient-animate mb-6 animate-bounce-in">
                QuickQuotes
              </h1>
              <p className="text-2xl text-muted-foreground font-medium max-w-4xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Share inspiring quotes with the world, discover wisdom from our beautiful community, and 
                <span className="text-primary font-semibold animate-pulse"> edit quotes seamlessly ✨</span>
              </p>
              <div className="w-40 h-1 bg-gradient-primary rounded-full mx-auto mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}></div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-primary hover:shadow-glow font-bold text-lg px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 btn-bounce"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAuth(true)}
                  className="font-semibold text-lg px-10 py-5 rounded-xl border-2 border-primary/30 hover:bg-primary/10 transition-all duration-500 card-hover"
                >
                  Sign In
                  <Palette className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Enhanced Features Section */}
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <Card className="card-hover card-glow bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl text-center p-8 animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-gradient-accent mb-8 mx-auto animate-pulse-slow">
                  <Users className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6 text-shimmer">Community Driven</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">Join thousands of quote lovers sharing wisdom and inspiration in our vibrant community</p>
              </Card>

              <Card className="card-hover card-glow bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl text-center p-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-gradient-primary mb-8 mx-auto animate-glow">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6 text-shimmer">Beautiful Gallery</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">Browse stunning collections of quotes in our responsive, beautifully designed gallery</p>
              </Card>

              <Card className="card-hover card-glow bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl text-center p-8 animate-fade-in-right" style={{ animationDelay: '0.6s' }}>
                <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-gradient-secondary mb-8 mx-auto animate-bounce-in">
                  <Edit3 className="h-10 w-10 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6 text-shimmer">Edit & Share</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">Create, edit, and share your favorite quotes with our intuitive editing interface</p>
              </Card>
            </div>

            {/* Additional feature highlight */}
            <div className="mt-20 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="inline-flex items-center gap-3 bg-gradient-primary/10 backdrop-blur-sm px-8 py-4 rounded-full border border-primary/20">
                <Zap className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-primary font-semibold text-lg">Quick & Easy Quote Editing</span>
                <Sparkles className="h-6 w-6 text-primary animate-bounce" />
              </div>
            </div>
          </div>
        ) : (
          // Enhanced Auth Section
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md animate-fade-in-up">
              <div className="text-center mb-12">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAuth(false)}
                  className="mb-8 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
                >
                  ← Back to Home
                </Button>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-8 animate-glow card-hover">
                  <Quote className="h-12 w-12 text-white animate-pulse-slow" />
                </div>
                <h2 className="text-5xl font-serif font-bold text-gradient-animate mb-4 animate-bounce-in">
                  Welcome to QuickQuotes
                </h2>
                <p className="text-xl text-muted-foreground font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Join our community of quote enthusiasts ✨
                </p>
                <div className="w-32 h-1 bg-gradient-primary rounded-full mx-auto mt-6 animate-scale-in" style={{ animationDelay: '0.4s' }}></div>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-1 mb-8">
                  <TabsTrigger 
                    value="signin" 
                    className="rounded-xl font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="rounded-xl font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="animate-fade-in">
                  <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-large rounded-3xl overflow-hidden card-hover">
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-3xl font-serif text-foreground animate-fade-in-up">Welcome Back</CardTitle>
                      <CardDescription className="text-muted-foreground font-medium text-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Sign in to continue sharing beautiful quotes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
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
                          size="lg"
                          className="w-full h-16 bg-gradient-primary hover:shadow-glow font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02]" 
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

                <TabsContent value="signup" className="animate-fade-in">
                  <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-large rounded-3xl overflow-hidden card-hover">
                    <CardHeader className="text-center pb-8">
                      <CardTitle className="text-3xl font-serif text-foreground animate-fade-in-up">Join QuickQuotes</CardTitle>
                      <CardDescription className="text-muted-foreground font-medium text-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Create your account to start sharing inspiration and editing quotes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
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

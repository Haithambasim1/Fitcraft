import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Check if a user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  console.log(data?.session?.user?.email);
  return data.session !== null;
};

// Log a user out
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: 'Error logging out',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    // Instead of directly navigating, use a toast to inform the user
    toast({
      title: 'Logged out successfully',
      description: "You've been logged out of your account.",
    });

    // Use a timeout to allow the toast to be seen before redirecting
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  } catch (err: any) {
    console.error('Logout error:', err);
    toast({
      title: 'Error logging out',
      description: err.message || 'An unexpected error occurred during logout.',
      variant: 'destructive',
    });
  }
};

// A simple auth guard component or HOC could be built with this
export const requireAuth = async (navigate: (path: string) => void): Promise<boolean> => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    navigate('/login');
    return false;
  }
  return true;
};

// Login with email and password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Special handling for email not confirmed error
      if (
        error.message?.includes('Email not confirmed') ||
        error.message?.includes('email_not_confirmed')
      ) {
        console.log('Attempting to sign in without email verification...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        return signInData;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Sign up with email and password
export const signupWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Check if email confirmation is disabled
    const isEmailConfirmationDisabled = await checkIfEmailConfirmationIsDisabled();

    // For development, if email verification is required, show a helpful message
    if (!data.session && !isEmailConfirmationDisabled) {
      toast({
        title: 'Email verification required',
        description:
          'Please check your email for a confirmation link. For development, you may need to disable email verification in the Supabase dashboard or use the link in your email.',
      });
    } else if (!data.session && isEmailConfirmationDisabled) {
      // If email confirmation is disabled but we still don't have a session,
      // the user might need to log in manually
      toast({
        title: 'Account created',
        description: 'Your account has been created. Please log in with your credentials.',
      });
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // Get the current URL for proper redirect
    const origin = window.location.origin;
    const redirectTo = `${origin}/dashboard`;

    console.log('Starting Google auth with:');
    console.log('- Origin:', origin);
    console.log('- Redirect URL:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        // Don't include any unnecessary scopes
        scopes: 'email profile',
        queryParams: {
          // These parameters ensure we get refresh tokens and explicit consent
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      toast({
        title: 'Google Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    console.log('Google sign-in initiated successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Google login error:', error);
    toast({
      title: 'Authentication Error',
      description: error.message || 'Failed to authenticate with Google. Please try again.',
      variant: 'destructive',
    });
    throw error;
  }
};

// Check if email confirmation is disabled in Supabase
// This is a best-effort check; it might not always be accurate
const checkIfEmailConfirmationIsDisabled = async (): Promise<boolean> => {
  try {
    // Try to sign up with a random email to see if confirmation is required
    // This is not a perfect check but helps in development
    const testEmail = `test_${Math.random().toString(36).substring(2)}@example.com`;
    const testPassword = Math.random().toString(36).substring(2);

    const { data } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    // If we get a session immediately, email confirmation is likely disabled
    const isDisabled = data.session !== null;

    // Clean up test account (this might not work if confirmation is required)
    if (data.user) {
      await supabase.auth.admin.deleteUser(data.user.id).catch(() => {
        // Ignore errors during cleanup
      });
    }

    return isDisabled;
  } catch (error) {
    console.error('Error checking email confirmation settings:', error);
    return false;
  }
};

// Get the current user's profile
export const getUserProfile = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

// Update user profile
export const updateUserProfile = async (profileData: any) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

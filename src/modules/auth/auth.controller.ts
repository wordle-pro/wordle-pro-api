import { type FastifyRequest, type FastifyReply } from 'fastify';
import { supabase } from '@/lib/supabase';
import { type SignupBodyInput, type LoginBodyInput } from './auth.schema';

export const signupHandler = async (
  request: FastifyRequest<{ Body: SignupBodyInput }>,
  reply: FastifyReply
) => {
	
  const { email, password, username } = request.body;
  const normalizedUsername = username.trim();

  // 1. Pre-check username availability
  const { data: existingUser, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', normalizedUsername)
    .maybeSingle();


  if (checkError) {
    request.log.error(checkError, 'Error checking existing username');
    return reply.status(500).send({ error: 'Failed to verify username availability' });
  }

  
  if (existingUser) {
    return reply.status(409).send({ error: 'Username is already taken' });
  }

  // 2. Call Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: normalizedUsername,
      },
    },
  });

  
  if (authError) {

    // switch (authError.code) {
    //   case 'user_already_exists':
    //     return { field: 'email', message: 'An account with this email already exists.' };
    //   case 'weak_password':
    //     return { field: 'password', message: 'Password is too weak. Must be at least 8 characters.' };
    //   case 'over_request_rate_limit':
    //   case 'over_email_send_limit':
    //     return { form: 'Too many requests. Please wait a few minutes before trying again.' };
    //   case 'signup_disabled':
    //     return { form: 'New registrations are currently disabled.' };
    //   default:
    //     return { form: error.message || 'An unexpected authentication error occurred.' };
    // }

const errorHashMap: Record<string, string> = {
  'user_already_exists': 'An account with this email already exists.',
  'weak_password': 'Password is too weak. Must be at least 8 characters.',
  'over_request_rate_limit': 'Too many requests. Please wait a few minutes before trying again.',
  'over_email_send_limit': 'Too many requests. Please wait a few minutes before trying again.',
  'signup_disabled': 'New registrations are currently disabled.',
};

const defaultErrorMessage = 'An unexpected authentication error occurred.';

// O(1) direct lookup with fallback
const errorMessage = authError.code ? errorHashMap[authError.code] : defaultErrorMessage;    

    return reply.status(authError.status || 400).send({ error: errorMessage });
  }

  if (!authData.user) {
    return reply.status(400).send({ error: 'Failed to create user account' });
  }

  return reply.status(201).send({
    message: 'Registration successful',
    user: {
      id: authData.user.id,
      email: authData.user.email,
      username: normalizedUsername,
    },
  });
}

export const loginHandler = async(
  request: FastifyRequest<{ Body: LoginBodyInput }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user || !authData.session) {
    return reply.status(401).send({ error: 'Invalid email or password' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    return reply.status(500).send({ error: 'Failed to retrieve user profile' });
  }

  return reply.status(200).send({
    message: 'Login successful',
    user: {
      id: authData.user.id,
      email: authData.user.email,
      username: profile.username,
    },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_in: authData.session.expires_in,
    },
  });
}
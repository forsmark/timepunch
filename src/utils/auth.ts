import { User, createClient } from "@supabase/supabase-js";
import { create } from "zustand";
import Cookies from "js-cookie";

import { supabaseAnonKey, supabaseUrl } from "./supabase";

const cookieKey = "timepunch";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type CookieSession = {
  access_token: string;
  refresh_token: string;
};

type AuthProperties = {
  user: User | null;
  signedIn: boolean;
};

type AuthState = {
  signIn: () => void;
  signOut: () => void;
} & AuthProperties;

const defaultAuthState: AuthProperties = {
  user: null,
  signedIn: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...defaultAuthState,
  signIn: () => set({ signedIn: true }),
  signOut: () => set({ signedIn: false }),
}));

const resetAuthStoreState = () => {
  useAuthStore.setState(defaultAuthState);
};

export const signIn = async (
  email: string,
  password: string,
  onSuccess: () => void
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  Cookies.set(
    cookieKey,
    JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    })
  );

  useAuthStore.setState({ signedIn: true, user: data.user });

  onSuccess?.();
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  useAuthStore.setState({ signedIn: false });

  Cookies.remove(cookieKey);

  if (error) {
    throw new Error(error.message);
  }
};

const restoreSession = async () => {
  const session = Cookies.get(cookieKey);

  if (session) {
    const parsedSession = JSON.parse(session) as CookieSession;
    const newSession = await supabase.auth.setSession(parsedSession);

    if (newSession.error) {
      return null;
    }

    if (newSession.data.session) {
      return newSession.data.session;
    }

    return null;
  }
};

export const rememberMe = async (onSuccess: () => void) => {
  const session = await supabase.auth.getSession();

  if (session.data.session) {
    useAuthStore.setState({ signedIn: true, user: session.data.session.user });
    onSuccess();
  } else {
    const restoredSession = await restoreSession();

    if (restoredSession) {
      useAuthStore.setState({
        signedIn: true,
        user: restoredSession.user,
      });
    } else {
      resetAuthStoreState();
    }
  }
};

export const getUser = () => {
  return useAuthStore.getState().user;
};

import { createClient } from "@supabase/supabase-js";
import { getUser } from "./auth";
import { supabaseAnonKey, supabaseUrl } from "./supabase";
import dayjs from "dayjs";
import { create } from "zustand";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PunchProperties = {
  punchedIn: boolean;
  latestPunchInTime: string | null;
  latestPunchOutTime: string | null;
};

type PunchState = {
  punchIn: () => void;
  punchOut: () => void;
} & PunchProperties;

const defaultPunchState: PunchProperties = {
  punchedIn: false,
  latestPunchInTime: null,
  latestPunchOutTime: null,
};

export const usePunchStore = create<PunchState>((set) => ({
  ...defaultPunchState,
  punchIn: () => set({ punchedIn: true }),
  punchOut: () => set({ punchedIn: false }),
}));

export const punchIn = async (
  options?: {
    vacation?: boolean;
    sick?: boolean;
    remote?: boolean;
  },
  onSuccess?: () => void
) => {
  const user = getUser();
  if (!user) return;

  const punchIn = {
    ...options,
    created_by: user.id,
  };

  const { error } = await supabase.from("punch_in").insert(punchIn);

  if (error) {
    throw new Error(error.message);
  }

  const punchedIn = usePunchStore.getState().punchedIn;

  if (!punchedIn) {
    usePunchStore.setState({ punchedIn: true });
  }

  onSuccess?.();
};

export const punchOut = async (onSuccess?: () => void) => {
  const user = getUser();
  if (!user) return;

  const punchOut = {
    created_by: user.id,
  };

  const { error } = await supabase.from("punch_out").insert(punchOut);

  if (error) {
    throw new Error(error.message);
  }

  const punchedIn = usePunchStore.getState().punchedIn;

  if (punchedIn) {
    usePunchStore.setState({ punchedIn: false });
  }

  onSuccess?.();
};

export const updatePunchedIn = async () => {
  const user = getUser();
  if (!user) return;

  const { data: latestPunchIn, error: punchInError } = await supabase
    .from("punch_in")
    .select("created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestPunchOut, error: punchOutError } = await supabase
    .from("punch_out")
    .select("created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (punchInError || punchOutError) {
    throw new Error(punchInError?.message || punchOutError?.message);
  }

  let latestPunchInTime = null;
  if (latestPunchIn) {
    latestPunchInTime = dayjs(latestPunchIn.created_at as string);
  }
  let latestPunchOutTime = null;
  if (latestPunchOut) {
    latestPunchOutTime = dayjs(latestPunchOut.created_at as string);
  }

  let punchedIn = defaultPunchState.punchedIn;

  if (!latestPunchOutTime && latestPunchInTime) {
    punchedIn = true;
  } else if (latestPunchInTime) {
    punchedIn = latestPunchInTime.isAfter(latestPunchOutTime);
  }

  usePunchStore.setState({
    punchedIn,
    latestPunchInTime: (latestPunchIn?.created_at as string) ?? null,
    latestPunchOutTime: (latestPunchOut?.created_at as string) ?? null,
  });
};

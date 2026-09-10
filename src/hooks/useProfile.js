import { useEffect, useState } from "react";

const STORAGE_KEY = "watchly:profile";
const AVATAR_OPTIONS = ["🎬", "🍿", "📺", "🎭", "👾", "🦄", "🐙", "🌟"];

const DEFAULT_PROFILE = {
  nome: "Cinéfilo Anônimo",
  avatar: AVATAR_OPTIONS[0],
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return { profile, setProfile, avatarOptions: AVATAR_OPTIONS };
}

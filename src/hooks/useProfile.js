import { useEffect, useState } from "react";
import { FaClapperboard, FaTv, FaMasksTheater, FaGamepad } from "react-icons/fa6";
import { PiPopcornFill } from "react-icons/pi";
import { IoPlanet } from "react-icons/io5";
import { GiUnicorn, GiOctopus } from "react-icons/gi";

const STORAGE_KEY = "watchly:profile";

// Lista com os componentes de ícones vetorizados
export const AVATAR_OPTIONS = [
  { id: "claquete", icon: <FaClapperboard size={32} color="#a855f7" /> },
  { id: "pipoca", icon: <PiPopcornFill size={32} color="#ec4899" /> },
  { id: "tv", icon: <FaTv size={32} color="#3b82f6" /> },
  { id: "teatro", icon: <FaMasksTheater size={32} color="#f59e0b" /> },
  { id: "game", icon: <FaGamepad size={32} color="#10b981" /> },
  { id: "planeta", icon: <IoPlanet size={32} color="#8b5cf6" /> },
  { id: "unicornio", icon: <GiUnicorn size={32} color="#f43f5e" /> },
  { id: "polvo", icon: <GiOctopus size={32} color="#06b6d4" /> },
];

const DEFAULT_PROFILE = {
  nome: "Cinéfilo Anônimo",
  avatarId: "claquete",
};

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return { profile, setProfile, avatarOptions: AVATAR_OPTIONS };
}
import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';
import { Team } from '@/types/bracket';

interface AdminContextType {
  teams: Team[];
  loading: boolean;
  loadLeague: (name: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLeague, setCurrentLeague] = useState<string>('');
  const [fetchedLeagues, setFetchedLeagues] = useState<Record<string, boolean>>(
    {},
  );

  const loadLeague = async (leagueShortName: string) => {
    if (!leagueShortName) return;

    // Normalize to uppercase for consistent comparison
    const normalized = leagueShortName.toUpperCase();

    setCurrentLeague(normalized);

    if (fetchedLeagues[normalized]) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `/admin/bracket-challenges/get-teams?league=${leagueShortName}`,
      );

      setAllTeams((prev) => {
        // Deduplicate by id before appending
        const existingIds = new Set(prev.map((t) => t.id));
        const newTeams = (data.teams as Team[]).filter(
          (t) => !existingIds.has(t.id),
        );
        return [...prev, ...newTeams];
      });

      setFetchedLeagues((prev) => ({ ...prev, [normalized]: true }));
    } catch (e) {
      console.error(`Failed to load teams for ${leagueShortName}`, e);
    } finally {
      setLoading(false);
    }
  };

  const teams = useMemo(() => {
    if (!currentLeague) return [];
    return allTeams.filter(
      (t) => t.league?.short_name?.toUpperCase() === currentLeague,
    );
  }, [allTeams, currentLeague]);

  return (
    <AdminContext.Provider value={{ teams, loading, loadLeague }}>
      {children}
    </AdminContext.Provider>
  );
};

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}

export default AdminProvider;

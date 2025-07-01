// src/hooks/useInvalidateMission1.ts
import { useQueryClient } from "@tanstack/react-query";
import { mission1Key }    from "./useMission1Query";

export default function useInvalidateMission1() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries(mission1Key);   // 🔥 force un refetch immédiat
}

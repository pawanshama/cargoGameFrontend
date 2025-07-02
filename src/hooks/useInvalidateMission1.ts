// src/hooks/useInvalidateMission1.ts
import { useQueryClient } from "@tanstack/react-query";
import { mission1Key }    from "./useMission1Query";

/**
 * Refetch immédiatement /mission1/status, même si la query était en erreur.
 */
export default function useInvalidateMission1() {
  const qc = useQueryClient();
  return () =>
    qc.refetchQueries({
      queryKey: mission1Key,
      type    : "all",        // active + inactive + error
    });
}

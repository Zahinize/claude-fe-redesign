import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/data/queryKeys'
import { generateRopaActivities } from '@/data/generators/ropa'
import type { RopaActivity, RopaStatus } from '@/data/schemas'

/** All RoPA activities (seed records + any created this session). */
export function useRopaActivities() {
  return useQuery({
    queryKey: queryKeys.ropaActivities,
    queryFn: () => generateRopaActivities(),
  })
}

function useActivities(): RopaActivity[] | undefined {
  const qc = useQueryClient()
  const { data } = useRopaActivities()
  return data ?? qc.getQueryData<RopaActivity[]>(queryKeys.ropaActivities)
}

export function useRopaActivity(id: string | undefined): RopaActivity | undefined {
  const activities = useActivities()
  return useMemo(
    () => (id && activities ? activities.find((a) => a.id === id) : undefined),
    [id, activities],
  )
}

export function useRopaMutations() {
  const qc = useQueryClient()

  /** Append a freshly-created activity to the cache. */
  function createActivity(activity: RopaActivity) {
    qc.setQueryData<RopaActivity[]>(queryKeys.ropaActivities, (rows) => [activity, ...(rows ?? [])])
  }

  /** Replace an activity (used when editing). */
  function updateActivity(activity: RopaActivity) {
    qc.setQueryData<RopaActivity[]>(queryKeys.ropaActivities, (rows) =>
      rows?.map((a) => (a.id === activity.id ? activity : a)),
    )
  }

  /** Transition workflow status + record a timeline event. */
  function transitionStatus(id: string, to: RopaStatus, label: string) {
    const now = new Date().toISOString()
    qc.setQueryData<RopaActivity[]>(queryKeys.ropaActivities, (rows) =>
      rows?.map((a) =>
        a.id === id
          ? {
              ...a,
              status: to,
              updatedAt: now,
              timeline: [
                ...a.timeline,
                { id: `${id}-t${a.timeline.length + 1}`, event: label, state: 'completed', at: now },
              ],
            }
          : a,
      ),
    )
  }

  return { createActivity, updateActivity, transitionStatus }
}

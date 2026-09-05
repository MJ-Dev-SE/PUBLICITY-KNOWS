// Data-layer entry point. Components should import from here, not from the raw
// seed files, so a real API/DB can replace the source later without touching UI.

import type { Entity, Project } from "./types";
import { projects } from "./projects";
import { entities } from "./entities";

export type { Project, Entity, Source } from "./types";
export type {
  ProjectStatus,
  EntityKind,
  AccountabilityStatus,
} from "./types";
export { projects } from "./projects";
export { entities } from "./entities";

// "Data as of" stamp shown in the UI (see §7.6). The date the dataset was last
// reviewed against published reporting. Bump it whenever the seed files change;
// the AI system prompt reads this constant, so it only needs changing here.
// Latest source article in the dataset: 2026-09-04.
export const DATA_AS_OF = "2026-09-05";

const projectsById = new Map<string, Project>(projects.map((p) => [p.id, p]));
const entitiesById = new Map<string, Entity>(entities.map((e) => [e.id, e]));

export function getProject(id: string): Project | undefined {
  return projectsById.get(id);
}

export function getEntity(id: string): Entity | undefined {
  return entitiesById.get(id);
}

// People tied to a project (drops any unresolved ids).
export function peopleOf(project: Project): Entity[] {
  return project.peopleIds
    .map((id) => entitiesById.get(id))
    .filter((e): e is Entity => e !== undefined);
}

// Projects tied to an entity (drops any unresolved ids).
export function projectsOf(entity: Entity): Project[] {
  return entity.projectIds
    .map((id) => projectsById.get(id))
    .filter((p): p is Project => p !== undefined);
}

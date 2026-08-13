import { ChevronRight } from "lucide-react";
import { getEntity, getProject, peopleOf, projectsOf } from "../../data";
import { ProjectAnalysis } from "../ai/ProjectAnalysis";
import { ContractorTrack } from "../accountability/ContractorTrack";
import { BiddingPanel } from "../projects/BiddingPanel";
import { MediaPanel } from "../projects/MediaPanel";
import { PIN_META, precisionOf } from "../../lib/pinMeta";
import type { Entity, Project } from "../../data/types";
import { statusOf } from "../../lib/status";
import { STATUS_META } from "../../lib/statusMeta";
import { formatDate, peso, pesoCompact } from "../../lib/format";
import { StatusBadge, MisreportedBadge } from "../../components/StatusBadge";
import { AccountabilityBadge } from "../../components/AccountabilityBadge";
import { ProgressBar } from "../../components/ProgressBar";
import { SourceLinks } from "../../components/SourceLinks";
import { Drawer } from "../../components/Drawer";
import { useSelection } from "./SelectionContext";

export function DetailDrawer() {
  const { selection, close, openProject, openEntity } = useSelection();

  const project =
    selection?.type === "project" ? getProject(selection.id) : undefined;
  const entity =
    selection?.type === "entity" ? getEntity(selection.id) : undefined;

  const title = project ? "Project" : entity ? "Person or organization" : "";

  return (
    <Drawer open={Boolean(project || entity)} onClose={close} title={title}>
      {project && (
        <ProjectDetail project={project} onOpenEntity={openEntity} />
      )}
      {entity && (
        <EntityDetail entity={entity} onOpenProject={openProject} />
      )}
    </Drawer>
  );
}

function LinkRow({
  primary,
  secondary,
  badge,
  onClick,
}: {
  primary: string;
  secondary?: string;
  badge?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm text-slate-900">{primary}</span>
        {secondary && (
          <span className="block truncate text-xs text-slate-500">
            {secondary}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {badge}
        <ChevronRight size={16} strokeWidth={1.5} className="text-slate-400" />
      </span>
    </button>
  );
}

function ProjectDetail({
  project,
  onOpenEntity,
}: {
  project: Project;
  onOpenEntity: (id: string) => void;
}) {
  const status = statusOf(project);
  const meta = STATUS_META[status];
  const people = peopleOf(project);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-medium text-slate-900">{project.name}</h3>
        <p className="text-sm text-slate-500">{project.location}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusBadge status={status} />
          {project.misreported && <MisreportedBadge />}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{Math.round(project.progress)}%</span>
        </div>
        <ProgressBar value={project.progress} barClass={meta.bar} />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Field label="Allocated" value={pesoCompact(project.allocated)} />
        <Field label="Spent" value={pesoCompact(project.spent)} />
        <Field
          label="Proposed timeline"
          value={`${formatDate(project.proposedStart)} – ${formatDate(project.proposedEnd)}`}
        />
        <Field
          label="Actual start"
          value={project.actualStart ? formatDate(project.actualStart) : "Not started"}
        />
        <Field label="Category" value={project.category} />
        <Field label="Full allocated" value={peso(project.allocated)} />
      </dl>

      {project.coords && (
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${PIN_META[precisionOf(project.coords)].badge}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${PIN_META[precisionOf(project.coords)].dot}`}
              />
              {PIN_META[precisionOf(project.coords)].label}
            </span>
            <a
              href={`https://maps.google.com/?cbll=${project.coords.lat},${project.coords.lng}&cbp=12,0,0,0,0&layer=c`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
            >
              Street view ↗
            </a>
          </div>
          <p className="text-xs text-slate-400">
            {PIN_META[precisionOf(project.coords)].hint}
            {project.coords.note ? ` ${project.coords.note}` : ""}
          </p>
          <p className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs leading-snug text-blue-800">
            <strong>Note on imagery:</strong> Google&apos;s Street View and
            satellite here may be older than this project (proposed{" "}
            {project.proposedStart.slice(0, 4)}). The last camera pass at a spot
            can be from an earlier year, so an older scene — or no visible
            structure — is not proof by itself. Check the capture date shown in
            Google Maps.
          </p>
          {(project.misreported || project.ghost) && (
            <p className="text-xs text-amber-700">
              For this flagged project, that date matters: if imagery taken{" "}
              <em>after</em> the claimed completion still shows no structure,
              that is visible evidence of misreporting.
            </p>
          )}
        </div>
      )}

      {project.note && (
        <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {project.note}
        </p>
      )}

      {project.media && project.media.length > 0 && (
        <MediaPanel media={project.media} />
      )}

      {project.bidding && <BiddingPanel bidding={project.bidding} />}

      <ProjectAnalysis projectId={project.id} />

      <section>
        <h4 className="mb-2 text-sm font-medium text-slate-900">
          People involved{" "}
          <span className="text-slate-400">({people.length})</span>
        </h4>
        {people.length === 0 ? (
          <p className="text-sm text-slate-500">
            No people are linked to this project — no adverse findings reported.
          </p>
        ) : (
          <div className="space-y-2">
            {people.map((e) => (
              <LinkRow
                key={e.id}
                primary={e.name}
                secondary={e.role}
                badge={<AccountabilityBadge status={e.status} />}
                onClick={() => onOpenEntity(e.id)}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-100 pt-3">
        <SourceLinks sources={project.sources} />
      </footer>
    </div>
  );
}

function EntityDetail({
  entity,
  onOpenProject,
}: {
  entity: Entity;
  onOpenProject: (id: string) => void;
}) {
  const linked = projectsOf(entity);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-medium text-slate-900">{entity.name}</h3>
        <p className="text-sm text-slate-500">{entity.role}</p>
        <div className="mt-2">
          <AccountabilityBadge status={entity.status} />
        </div>
      </div>

      <p className="text-sm text-slate-600">{entity.summary}</p>

      {entity.track && <ContractorTrack track={entity.track} />}

      <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
        This is an official/legal status as reported, not a finding of guilt.
        Cases are ongoing.
      </p>

      <section>
        <h4 className="mb-2 text-sm font-medium text-slate-900">
          Linked projects{" "}
          <span className="text-slate-400">({linked.length})</span>
        </h4>
        {linked.length === 0 ? (
          <p className="text-sm text-slate-500">
            No specific tracked project is linked in this sample.
          </p>
        ) : (
          <div className="space-y-2">
            {linked.map((p) => (
              <LinkRow
                key={p.id}
                primary={p.name}
                secondary={p.location}
                badge={<StatusBadge status={statusOf(p)} />}
                onClick={() => onOpenProject(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-100 pt-3">
        <SourceLinks sources={entity.sources} />
      </footer>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-700">{value}</dd>
    </div>
  );
}

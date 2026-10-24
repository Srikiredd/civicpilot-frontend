import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, CheckCircle, ExternalLink, FileCheck2, FileUp, Image, LoaderCircle, Mail, Map, RefreshCw, ShieldCheck, Sparkles, WandSparkles, AlertCircle, Globe2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {  getJourney  } from "../../services/journeyService";
import {  generateAiVisualContent, getJourneyVisualResources, getStaticVisualResources, saveAiVisuals  } from "../../services/visualResourceService";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import {  API_BASE_URL  } from "../../utils/constants";
import {  asArray, errorMessage  } from "../../utils/helpers";
import { startAgent, getAgentStatus, uploadAgentDocument, executeAgent } from "../../services/agentService";

const MODES = {
  STATIC: {
    key: "STATIC", label: "Static Journey", icon: ShieldCheck,
    title: "Verified visual guidance", tone: "static",
    description: "Use predefined visual resources for a predictable, fast guidance experience."
  },
  AI: {
    key: "AI", label: "AI Visual Journey", icon: WandSparkles,
    title: "AI-generated visual guidance", tone: "ai",
    description: "Generate step-specific explanatory visuals from the citizen journey context."
  },
  AGENT: {
    key: "AGENT", label: "Agent Journey", icon: Bot,
    title: "Autonomous assistance", tone: "agent",
    description: "Let CivicPilot prepare documents, navigate the official portal, execute permitted actions, and track the service."
  }
};

function normalizeMode(search) {
  const mode = new URLSearchParams(search).get("mode")?.toUpperCase();
  return MODES[mode] ? mode : "STATIC";
}

function resolveImage(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function JourneyExperiencePage() {
  const { journeyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const modeKey = normalizeMode(location.search);
  const mode = MODES[modeKey];
  const ModeIcon = mode.icon;
  const [journey, setJourney] = useState(null);
  const [visuals, setVisuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const steps = useMemo(() => journey?.steps || journey?.journeySteps || [], [journey]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const j = await getJourney(journeyId);
        if (!active) return;
        setJourney(j);
        const language = j?.language || "English";
        if (modeKey === "AGENT") return;

        if (modeKey === "STATIC") {
          const journeySteps = j?.steps || j?.journeySteps || [];
          const serviceIds = journeySteps
            .map(step => step?.governmentService?.id || step?.serviceId)
            .filter(Boolean);

          const grouped = await Promise.allSettled(
            serviceIds.map((serviceId) =>
              getStaticVisualResources(serviceId, language)
            )
          );
          const flat = grouped
            .filter((result) => result.status === "fulfilled")
            .flatMap((result) => {
              const item = result.value;
              return Array.isArray(item) ? item : item?.resources || [];
            });
          const unique = flat.filter((item, index, arr) =>
            index === arr.findIndex(other =>
              (other.visualId || other.id) === (item.visualId || item.id)
            )
          );
          if (active) setVisuals(unique);
        } else {
          const data = await getJourneyVisualResources(journeyId, language);
          if (active) setVisuals(Array.isArray(data) ? data : data?.resources || []);
        }
      } catch (e) {
        if (active) setError(errorMessage(e, "Unable to load the journey experience."));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [journeyId, modeKey]);

  const createAiVisuals = async () => {
    try {
      setWorking(true);
      setError("");
      const generated = await generateAiVisualContent(journeyId);
      await saveAiVisuals(journeyId, generated);
      const data = await getJourneyVisualResources(journeyId, journey?.language || "English");
      setVisuals(Array.isArray(data) ? data : data?.resources || []);
    } catch (e) {
      setError(errorMessage(e, "AI visual generation failed."));
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <div className="experience-loading"><LoaderCircle className="spin" size={34}/><strong>Preparing your CivicPilot journey...</strong><span>Connecting the selected guidance mode</span></div>;
  }

  return (
    <div className="workspace-page experience-page">
      <Link className="back-link" to={`/journeys/${journeyId}`}><ArrowLeft size={16}/> Back to journey</Link>

      <section className={`experience-hero ${mode.tone}`}>
        <div className="experience-hero-glow" />
        <div className="experience-hero-content">
          <div className="experience-kicker"><ModeIcon size={15}/> {mode.label}</div>
          <span className="eyebrow">CIVICPILOT JOURNEY #{journeyId}</span>
          <h1>{journey?.title || journey?.name || "Your personalized citizen journey"}</h1>
          <p>{mode.description}</p>
          <div className="experience-meta">
            <span><Map size={15}/> {steps.length} service steps</span>
            <span><Sparkles size={15}/> {journey?.language || "English"}</span>
            <span><ShieldCheck size={15}/> Protected workspace</span>
          </div>
        </div>
        <div className="experience-orb">
          <div className="orb-ring ring-one" />
          <div className="orb-ring ring-two" />
          <ModeIcon size={52}/>
          <small>{modeKey === "AGENT" ? "AGENT READY" : modeKey === "AI" ? "AI GUIDANCE" : "VERIFIED GUIDE"}</small>
        </div>
      </section>

      <div className="mode-switcher">
        {Object.values(MODES).map(item => {
          const Icon = item.icon;
          return <button key={item.key} className={modeKey === item.key ? `mode-tab active ${item.tone}` : "mode-tab"} onClick={() => navigate(`/journeys/${journeyId}/experience?mode=${item.key}`)}>
            <Icon size={17}/><span>{item.label}</span>
          </button>;
        })}
      </div>

      {error && <ErrorMessage message={error} />}

      {modeKey === "AGENT" ? (
        <AgentPreview journey={journey} steps={steps} />
      ) : modeKey === "AI" ? (
        <AiExperience visuals={visuals} working={working} onGenerate={createAiVisuals} journey={journey} />
      ) : (
        <StaticExperience visuals={visuals} steps={steps} />
      )}
    </div>
  );
}

function StaticExperience({ visuals, steps }) {
  return <section className="experience-section">
    <div className="section-heading-row">
      <div><span className="eyebrow">STATIC JOURNEY</span><h2>Verified visual guidance</h2><p>Predefined resources are displayed against the steps in your journey.</p></div>
      <span className="count-chip"><ShieldCheck size={14}/> {visuals.length} resources</span>
    </div>
    <JourneyVisualGrid visuals={visuals} steps={steps} />
  </section>;
}

function AiExperience({ visuals, working, onGenerate, journey }) {
  return <section className="experience-section">
    <div className="section-heading-row">
      <div><span className="eyebrow">AI VISUAL JOURNEY</span><h2>Visuals shaped around your journey</h2><p>Each image is generated as explanatory guidance from the service context.</p></div>
      <button className="btn btn-primary" onClick={onGenerate} disabled={working}>{working ? <><LoaderCircle className="spin" size={16}/> Generating...</> : <><WandSparkles size={16}/> Generate AI visuals</>}</button>
    </div>
    {visuals.length === 0 && !working ? <div className="ai-empty panel"><div className="ai-empty-icon"><WandSparkles/></div><h3>Ready to generate your visual journey</h3><p>CivicPilot will create one visual guidance resource for every service step.</p><button className="btn btn-primary" onClick={onGenerate}>Generate visual journey <ArrowLeft className="rotate-180" size={16}/></button></div> : <JourneyVisualGrid visuals={visuals} steps={journey?.steps || journey?.journeySteps || []} />}
  </section>;
}

function AgentPreview({ journey, steps }) {
  const [agentState, setAgentState] = useState(null);
  const [starting, setStarting] = useState(true);
  const [uploadingType, setUploadingType] = useState("");
  const [agentError, setAgentError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const runId = agentState?.agentRunId ?? agentState?.runId ?? agentState?.id;
  const stepExecutionId = agentState?.stepExecutionId ?? agentState?.currentStepExecutionId;
  const status = String(agentState?.status || "STARTING").toUpperCase();
  const requiredDocuments = asArray(agentState?.requiredDocuments);
  const completionUrl = agentState?.completionUrl || agentState?.portalUrl || agentState?.governmentPortalUrl || "";
  const serviceName = agentState?.serviceName || steps?.[Math.max((agentState?.currentStep || 1) - 1, 0)]?.serviceName || "Government Service";

  const refresh = async (id = runId) => {
    if (!id) return;
    const data = await getAgentStatus(id);
    setAgentState(data);
    setLastUpdated(new Date());
    return data;
  };

  useEffect(() => {
    let active = true;
    async function start() {
      try {
        setStarting(true);
        setAgentError("");
        const data = await startAgent(journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId);
        if (!active) return;
        setAgentState(data);
        setLastUpdated(new Date());
      } catch (e) {
        if (active) setAgentError(errorMessage(e, "Unable to start the CivicPilot Agent."));
      } finally {
        if (active) setStarting(false);
      }
    }
    const id = journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId;
    if (id) start();
    return () => { active = false; };
  }, [journey?.id, journey?.journeyId, journey?.citizenJourneyId]);

  useEffect(() => {
    if (!runId) return undefined;
    if (!["RUNNING", "STARTED", "IN_PROGRESS", "UNDER_REVIEW", "VERIFICATION"].includes(status)) return undefined;

    const timer = window.setInterval(() => {
      refresh().catch(() => {});
    }, 5000);

    return () => window.clearInterval(timer);
  }, [runId, status]);

  const handleUpload = async (documentType, file) => {
    if (!file || !runId || !stepExecutionId) return;
    try {
      setUploadingType(documentType);
      setAgentError("");
      await uploadAgentDocument(runId, stepExecutionId, documentType, file);
      await refresh();
    } catch (e) {
      setAgentError(errorMessage(e, `Unable to upload ${documentType}.`));
    } finally {
      setUploadingType("");
    }
  };

  const handleExecute = async () => {
    if (!runId) return;
    try {
      setAgentError("");
      await executeAgent(runId);
      await refresh();
    } catch (e) {
      setAgentError(errorMessage(e, "Agent execution failed."));
    }
  };

  const uploadedCount = requiredDocuments.filter((doc) => doc?.uploaded).length;
  const allDocumentsUploaded = requiredDocuments.length === 0 || uploadedCount === requiredDocuments.length;

  if (starting) {
    return (
      <section className="experience-section">
        <div className="agent-console panel agent-starting">
          <div className="agent-live-icon"><Bot className="agent-bot-pulse" size={30} /></div>
          <div>
            <span className="eyebrow">PHASE 7.3 • AUTONOMOUS AI AGENT</span>
            <h2>Starting CivicPilot Agent...</h2>
            <p>The agent is creating the execution run and identifying the documents required for this journey.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="experience-section agent-experience">
      {agentError && <ErrorMessage message={agentError} />}

      <div className="agent-console panel">
        <div className="agent-console-head">
          <div>
            <span className="eyebrow">PHASE 7.3 • AUTONOMOUS AI AGENT</span>
            <h2>CivicPilot Agent workspace</h2>
            <p>Agent Run #{runId || "—"} · {serviceName}</p>
          </div>
          <div className={`agent-status agent-status-${status.toLowerCase()}`}>
            <span /> {status.replaceAll("_", " ")}
          </div>
        </div>

        <div className="agent-progress-strip">
          <div className={requiredDocuments.length === 0 || uploadedCount > 0 ? "active" : ""}>
            <FileCheck2 size={17} />
            <span>Documents</span>
            <strong>{uploadedCount}/{requiredDocuments.length || 0}</strong>
          </div>
          <div className={status === "READY_TO_SUBMIT" || status === "SUBMITTED" || status === "UNDER_REVIEW" || status === "VERIFICATION" || status === "APPROVED" || status === "COMPLETED" ? "active" : ""}>
            <Globe2 size={17} />
            <span>Government Portal</span>
          </div>
          <div className={status === "SUBMITTED" || status === "UNDER_REVIEW" || status === "VERIFICATION" || status === "APPROVED" || status === "COMPLETED" ? "active" : ""}>
            <Mail size={17} />
            <span>Email Updates</span>
          </div>
          <div className={status === "COMPLETED" ? "active" : ""}>
            <CheckCircle size={17} />
            <span>Completed</span>
          </div>
        </div>

        {requiredDocuments.length > 0 && status !== "COMPLETED" && (
          <div className="agent-document-panel">
            <div className="agent-panel-heading">
              <div>
                <span className="eyebrow">DOCUMENTS REQUIRED</span>
                <h3>Upload the documents requested by the agent</h3>
                <p>Each document is attached to the current agent step and is then available to the real browser agent.</p>
              </div>
              <span className="count-chip"><FileUp size={14}/> {uploadedCount}/{requiredDocuments.length}</span>
            </div>

            <div className="agent-document-list">
              {requiredDocuments.map((doc, index) => {
                const type = doc?.documentType || doc?.type || `Document ${index + 1}`;
                const uploaded = Boolean(doc?.uploaded);
                return (
                  <div className={`agent-document-row ${uploaded ? "uploaded" : ""}`} key={`${type}-${index}`}>
                    <div className="agent-document-icon">
                      {uploaded ? <CheckCircle size={18}/> : <FileUp size={18}/>}
                    </div>
                    <div className="agent-document-info">
                      <strong>{type}</strong>
                      <span>{uploaded ? "Uploaded and available to the agent" : "Required before this step can continue"}</span>
                    </div>
                    {uploaded ? (
                      <span className="agent-uploaded-badge">UPLOADED</span>
                    ) : (
                      <label className="agent-upload-btn">
                        {uploadingType === type ? <LoaderCircle className="spin" size={15}/> : <FileUp size={15}/>}
                        {uploadingType === type ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          disabled={Boolean(uploadingType)}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleUpload(type, file);
                            event.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="agent-action-row">
          <button type="button" className="btn btn-secondary" onClick={() => refresh()} disabled={!runId || Boolean(uploadingType)}>
            <RefreshCw size={15}/> Refresh Agent Status
          </button>

          {runId && status !== "COMPLETED" && (
            <button type="button" className="btn btn-primary" onClick={handleExecute} disabled={!allDocumentsUploaded || Boolean(uploadingType) || status === "RUNNING"}>
              <Bot size={15}/> Continue Agent Execution
            </button>
          )}
        </div>

        {lastUpdated && (
          <div className="agent-updated">Last agent status check: {lastUpdated.toLocaleTimeString()}</div>
        )}
      </div>

      <div className="agent-status-flow">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">AGENT EXECUTION</span>
            <h2>Live service journey</h2>
            <p>The backend agent performs permitted portal actions and updates this state as the workflow progresses.</p>
          </div>
        </div>

        <div className="agent-track enhanced-agent-track">
          {[
            ["DOCUMENTS_REQUIRED", "Collect required documents", FileCheck2],
            ["READY_TO_SUBMIT", "Prepare the government application", ShieldCheck],
            ["SUBMITTED", "Submit through the official portal", Globe2],
            ["UNDER_REVIEW", "Monitor authority review", LoaderCircle],
            ["VERIFICATION", "Handle verification stage", ShieldCheck],
            ["APPROVED", "Receive authority approval", CheckCircle],
            ["COMPLETED", "Finish and provide portal link", CheckCircle2]
          ].map(([key, text, Icon]) => {
            const order = ["DOCUMENTS_REQUIRED", "READY_TO_SUBMIT", "SUBMITTED", "UNDER_REVIEW", "VERIFICATION", "APPROVED", "COMPLETED"];
            const currentIndex = order.indexOf(status);
            const itemIndex = order.indexOf(key);
            const done = currentIndex >= itemIndex && currentIndex >= 0;
            const current = status === key;
            return (
              <div className={`agent-flow-step ${done ? "done" : ""} ${current ? "current" : ""}`} key={key}>
                <div className="agent-flow-icon"><Icon size={16}/></div>
                <div><strong>{key.replaceAll("_", " ")}</strong><span>{text}</span></div>
                {done && <CheckCircle2 className="agent-flow-check" size={17}/>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="agent-email-panel panel">
        <div className="agent-email-icon"><Mail size={20}/></div>
        <div>
          <span className="eyebrow">EMAIL NOTIFICATIONS</span>
          <h3>Application updates are sent automatically</h3>
          <p>Spring Boot JavaMailSender sends multilingual status emails as the backend agent moves through the application lifecycle.</p>
          <div className="agent-email-tags">
            {['READY_TO_SUBMIT','SUBMITTED','UNDER_REVIEW','VERIFICATION','APPROVED','COMPLETED'].map(item => <span key={item}>{item.replaceAll('_',' ')}</span>)}
          </div>
        </div>
      </div>

      {(status === "WAITING_FOR_HUMAN_ACTION" || agentState?.humanActionRequired) && (
        <div className="agent-human-action panel">
          <AlertCircle size={20}/>
          <div>
            <span className="eyebrow">ACTION REQUIRED</span>
            <h3>Citizen action is required to continue</h3>
            <p>{agentState?.humanActionReason || agentState?.message || "The official portal requires a protected action such as OTP, CAPTCHA, biometric verification, signature, or payment authorization."}</p>
          </div>
        </div>
      )}

      {completionUrl && status === "COMPLETED" && (
        <div className="agent-completion panel">
          <div className="agent-completion-icon"><CheckCircle2 size={28}/></div>
          <div>
            <span className="eyebrow">PROCESS COMPLETED</span>
            <h2>Your government service process is complete</h2>
            <p>The completion email contains the same official government portal link.</p>
            <a className="btn btn-primary" href={completionUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16}/> Open Government Portal
            </a>
          </div>
        </div>
      )}

      <div className="section-heading-row agent-journey-steps">
        <div><span className="eyebrow">CURRENT JOURNEY</span><h2>{journey?.title || "Selected service journey"}</h2></div>
      </div>

      <div className="agent-service-list">
        {steps.map((step, i) => {
          const service = step?.governmentService || {};
          return (
            <article className="agent-service-card" key={step?.id || i}>
              <div className="agent-step-number">{i + 1}</div>
              <div>
                <span className="eyebrow">SERVICE STEP</span>
                <h3>{step?.serviceName || service?.name || `Service ${i + 1}`}</h3>
                <p>{step?.procedureDescription || step?.description || "Service workflow prepared for agent execution."}</p>
              </div>
              <StatusBadge status={i + 1 === (agentState?.currentStep || 1) ? status : (step?.status || "PENDING")} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function JourneyVisualGrid({ visuals, steps }) {
  if (!visuals.length) return <div className="panel empty-state"><div className="empty-icon"><Image/></div><h3>No visual resources yet</h3><p>Visual resources for this journey have not been stored yet.</p></div>;
  return <div className="experience-visual-grid">{visuals.map((visual, index) => <article className="experience-visual-card" key={visual.visualId || visual.id || index}>
    <div className="visual-card-top"><div><span className="step-label">STEP {index + 1}</span><h3>{visual.title || visual.serviceName || "Service guidance"}</h3></div><span className={`visual-type ${String(visual.type).toLowerCase()}`}><Sparkles size={13}/> {visual.type === "AI_GENERATED" ? "AI generated" : "Static guide"}</span></div>
    {visual.imageUrl ? <img src={resolveImage(visual.imageUrl)} alt={visual.title || "CivicPilot visual guidance"} loading="lazy"/> : <div className="visual-image-missing"><Image/><span>Image unavailable</span></div>}
    <p>{visual.description || "Citizen-friendly explanatory guidance for this service."}</p>
    <div className="visual-card-foot"><span><FileCheck2 size={14}/> Explanatory guidance</span>{visual.officialLink && <a href={visual.officialLink} target="_blank" rel="noreferrer">Official portal <ExternalLink size={13}/></a>}</div>
  </article>)}</div>;
}

import "./styles/global.css";
import { SceneEngine } from "./engine/SceneEngine.js";
import { LocalProgressStore, DemoProgressStore } from "./store/ProgressStore.js";
import { LiveCompanionClient, DemoCompanionClient } from "./companion/CompanionClient.js";
import { createInitialGameState } from "./types/index.js";
import type { GameState, ScenePhase, ScenarioMeta } from "./types/index.js";
import {
  renderGameView,
  renderCelebration,
  renderParentGate,
  renderTrustScreen,
  renderJourneyReflection,
  type CounselorPanelData,
  type CoPlayStep,
} from "./ui/GameView.js";
import {
  renderLanding,
  renderAuthForm,
  renderOnboarding,
  renderScenarioHub,
} from "./ui/screens.js";
import { getToken } from "./ui/auth.js";
import { buildJourneyReflection } from "./counselor/insights.js";
import { SCENARIOS } from "./content/scenarios.js";

type AppScreen =
  | "landing"
  | "trust"
  | "onboarding"
  | "hub"
  | "game"
  | "parentGate"
  | "celebration"
  | "reflection"
  | "login"
  | "register";

const demoMode =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  new URLSearchParams(location.search).has("demo");

const API_URL = import.meta.env.VITE_API_URL ?? "";

let currentScreen: AppScreen = "landing";
let gameState: GameState = createInitialGameState(demoMode);
let engine: SceneEngine | null = null;
let activeDecisionId: string | null = null;
let companionLine: string | null = null;
let counselorPanel: CounselorPanelData | null = null;
let currentPhase: ScenePhase = "loading";
let activeScenarioTitle = "Adventure complete";
let parentGateNext: AppScreen = "reflection";
let coPlayStep: CoPlayStep = "discuss";

const app = document.getElementById("app")!;

function navigate(screen: AppScreen): void {
  currentScreen = screen;
  render();
}

async function startScenario(scenario: ScenarioMeta, playMode: "solo" | "together" = "solo"): Promise<void> {
  activeScenarioTitle = scenario.title;
  gameState.profile.chapterId = scenario.id;
  gameState.profile.ageBand = scenario.ageBand;
  gameState.progress.currentSceneId = scenario.startSceneId;
  gameState.flags.demoMode = demoMode;
  gameState.flags.playMode = playMode;
  coPlayStep = "discuss";

  const store = demoMode
    ? new DemoProgressStore(gameState)
    : new LocalProgressStore();

  await store.save(gameState);

  const companion = demoMode
    ? new DemoCompanionClient()
    : new LiveCompanionClient(API_URL, getToken() ?? undefined);

  engine = new SceneEngine(gameState, store, companion, {
    onPhaseChange: (phase) => {
      currentPhase = phase;
      if (phase === "decision" || phase === "encounter") {
        const scene = engine?.getCurrentScene();
        if (scene?.decisionPoints[0]) {
          activeDecisionId = scene.decisionPoints[0];
        }
        if (gameState.flags.playMode === "together") {
          coPlayStep = "discuss";
        }
      } else if (phase !== "consequence") {
        activeDecisionId = null;
      }
      renderGame();
    },
    onSceneChange: () => {
      gameState = engine?.getState() ?? gameState;
      renderGame();
    },
    onCompanionLine: (line) => {
      companionLine = line;
      renderGame();
    },
    onCounselorInsight: (insight) => {
      counselorPanel = insight;
      renderGame();
    },
    onMeterJuice: () => renderGame(),
    onCelebration: () => {
      gameState = engine?.getState() ?? gameState;
      navigate("celebration");
    },
    onError: (msg) => console.error(msg),
  });

  gameState = engine.getState();
  counselorPanel = null;
  companionLine = null;
  await engine.loadScene(scenario.startSceneId);
  navigate("game");
}

function renderGame(): void {
  if (currentScreen !== "game") return;
  const scene = engine?.getCurrentScene() ?? null;
  renderGameView(
    app,
    gameState,
    scene,
    currentPhase,
    companionLine,
    activeDecisionId,
    counselorPanel,
    (dpId, optId, parentReflection) => {
      coPlayStep = "discuss";
      void engine?.submitChoice(dpId, optId, parentReflection);
    },
    (dpId, text, parentReflection) => {
      coPlayStep = "discuss";
      void engine?.submitTyped(dpId, text, parentReflection);
    },
    (target) => {
      activeDecisionId = target;
      engine?.triggerEncounter(target);
      currentPhase = "decision";
      if (gameState.flags.playMode === "together") {
        coPlayStep = "discuss";
      }
      renderGame();
    },
    gameState.flags.playMode === "together",
    coPlayStep,
    () => {
      coPlayStep = "choose";
      renderGame();
    },
  );
}

function goToHub(): void {
  navigate("hub");
}

function render(): void {
  switch (currentScreen) {
    case "landing":
      renderLanding(
        app,
        () => {
          gameState.flags.playMode = "solo";
          if (!localStorage.getItem("trunorth_trust_seen")) {
            navigate("trust");
          } else if (!gameState.flags.onboardingComplete) {
            navigate("onboarding");
          } else {
            navigate("hub");
          }
        },
        () => {
          gameState.flags.playMode = "together";
          if (!localStorage.getItem("trunorth_trust_seen")) {
            navigate("trust");
          } else if (!gameState.flags.onboardingComplete) {
            navigate("onboarding");
          } else {
            navigate("hub");
          }
        },
        (s) => navigate(s),
      );
      break;

    case "trust":
      renderTrustScreen(app, () => {
        localStorage.setItem("trunorth_trust_seen", "1");
        navigate(gameState.flags.onboardingComplete ? "hub" : "onboarding");
      });
      break;

    case "onboarding":
      renderOnboarding(app, (data) => {
        gameState.profile.companionName = data.companionName;
        gameState.profile.companionArchetype = data.companionArchetype;
        gameState.profile.avatar = data.avatar as GameState["profile"]["avatar"];
        gameState.profile.ageBand = data.ageBand as GameState["profile"]["ageBand"];
        gameState.profile.baselineStrength = data.baselineStrength;
        gameState.flags.onboardingComplete = true;
        void new LocalProgressStore().save(gameState);
        navigate("hub");
      });
      break;

    case "hub":
      renderScenarioHub(
        app,
        gameState.progress.chaptersCompleted,
        gameState.flags.playMode,
        (scenario) => { void startScenario(scenario, "solo"); },
        (scenario) => { void startScenario(scenario, "together"); },
        () => {
          parentGateNext = "reflection";
          navigate("parentGate");
        },
        () => navigate("landing"),
      );
      break;

    case "game":
      renderGame();
      break;

    case "celebration":
      renderCelebration(
        app,
        activeScenarioTitle,
        () => {
          parentGateNext = "reflection";
          navigate("parentGate");
        },
        goToHub,
      );
      break;

    case "reflection": {
      const reflection = buildJourneyReflection(gameState);
      renderJourneyReflection(app, reflection, goToHub);
      break;
    }

    case "parentGate":
      renderParentGate(
        app,
        () => navigate(parentGateNext),
        () => {},
      );
      break;

    case "login":
      renderAuthForm(app, "login", () => navigate("hub"), () => navigate("landing"));
      break;

    case "register":
      renderAuthForm(app, "register", () => navigate("hub"), () => navigate("landing"));
      break;
  }
}

// Restore saved profile if present
void (async () => {
  const saved = await new LocalProgressStore().load();
  if (saved) {
    gameState = saved;
    gameState.flags.demoMode = demoMode;
    if (!gameState.flags.playMode) {
      gameState.flags.playMode = "solo";
    }
  }
  render();
})();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Keep SCENARIOS referenced for tree-shaking clarity in hub
void SCENARIOS;

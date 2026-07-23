import { appConfig } from "../config/app.js";
import { getToken, signOut } from "./auth.js";
import type { AgeBand } from "../types/index.js";

interface ChildProfile {
  id: string;
  display_name: string;
  age_band: string;
  avatar_json: Record<string, unknown>;
  created_at: string;
}

const AGE_BANDS: AgeBand[] = ["5-7", "8-10", "11-15"];

async function fetchChildren(): Promise<ChildProfile[]> {
  const res = await fetch(`${appConfig.apiUrl}/api/children`, {
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });
  if (!res.ok) throw new Error("Could not load children.");
  const body = (await res.json()) as { data: ChildProfile[] };
  return body.data;
}

async function createChild(displayName: string, ageBand: string): Promise<void> {
  const res = await fetch(`${appConfig.apiUrl}/api/children`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() ?? ""}`,
    },
    body: JSON.stringify({ displayName, ageBand }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? "Could not add child.");
  }
}

export function renderChildren(
  container: HTMLElement,
  onContinue: (childName?: string) => void,
  onSignOut: () => void,
): void {
  container.innerHTML = "";
  const surface = document.createElement("div");
  surface.className = "parent-surface";

  const card = document.createElement("div");
  card.className = "parent-card";
  card.innerHTML = `<h1>Your Children</h1><p>Add a child profile, then tap "Play as" so the game greets them by name.</p>`;

  const list = document.createElement("ul");
  list.className = "children-list";
  card.appendChild(list);

  const error = document.createElement("div");
  error.className = "error-msg";
  card.appendChild(error);

  async function refresh(): Promise<void> {
    list.innerHTML = "<li>Loading…</li>";
    try {
      const children = await fetchChildren();
      list.innerHTML = "";
      if (children.length === 0) {
        list.innerHTML = "<li>No children added yet.</li>";
      }
      for (const child of children) {
        const item = document.createElement("li");
        item.className = "child-list-item";

        const label = document.createElement("span");
        label.textContent = `${child.display_name} (${child.age_band})`;
        item.appendChild(label);

        const playBtn = document.createElement("button");
        playBtn.className = "btn-primary child-play-btn";
        playBtn.textContent = `Play as ${child.display_name}`;
        playBtn.onclick = () => onContinue(child.display_name);
        item.appendChild(playBtn);

        list.appendChild(item);
      }
    } catch (e) {
      error.textContent = e instanceof Error ? e.message : "Could not load children.";
      list.innerHTML = "";
    }
  }

  const nameGroup = document.createElement("div");
  nameGroup.className = "form-group";
  nameGroup.innerHTML = `<label>Child's name</label>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.maxLength = 30;
  nameGroup.appendChild(nameInput);
  card.appendChild(nameGroup);

  const ageGroup = document.createElement("div");
  ageGroup.className = "form-group";
  ageGroup.innerHTML = `<label>Age band</label>`;
  const ageSelect = document.createElement("select");
  for (const band of AGE_BANDS) {
    const option = document.createElement("option");
    option.value = band;
    option.textContent = band;
    ageSelect.appendChild(option);
  }
  ageGroup.appendChild(ageSelect);
  card.appendChild(ageGroup);

  const addBtn = document.createElement("button");
  addBtn.className = "btn-primary";
  addBtn.textContent = "Add Child";
  addBtn.onclick = async () => {
    error.textContent = "";
    if (!nameInput.value.trim()) {
      error.textContent = "Enter a name.";
      return;
    }
    addBtn.disabled = true;
    try {
      await createChild(nameInput.value.trim(), ageSelect.value);
      nameInput.value = "";
      await refresh();
    } catch (e) {
      error.textContent = e instanceof Error ? e.message : "Could not add child.";
    } finally {
      addBtn.disabled = false;
    }
  };
  card.appendChild(addBtn);

  const continueBtn = document.createElement("button");
  continueBtn.className = "btn-secondary";
  continueBtn.textContent = "Continue";
  continueBtn.onclick = () => onContinue();
  card.appendChild(continueBtn);

  const signOutBtn = document.createElement("button");
  signOutBtn.className = "btn-secondary";
  signOutBtn.textContent = "Sign Out";
  signOutBtn.onclick = async () => {
    await signOut();
    onSignOut();
  };
  card.appendChild(signOutBtn);

  surface.appendChild(card);
  container.appendChild(surface);

  void refresh();
}

const DEFAULT_RESPONSE_FORMAT = "1.9.5";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function requiredAnyEnv(names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  throw new Error(`Missing environment variable: ${names[0]}`);
}

function config() {
  return {
    endpoint: requiredAnyEnv(["APPWRITE_ENDPOINT", "VITE_APPWRITE_ENDPOINT"]).replace(/\/$/, ""),
    projectId: requiredAnyEnv(["APPWRITE_PROJECT_ID", "VITE_APPWRITE_PROJECT_ID"]),
    apiKey: requiredEnv("APPWRITE_API_KEY"),
    responseFormat: process.env.APPWRITE_RESPONSE_FORMAT || DEFAULT_RESPONSE_FORMAT,
  };
}

function normalized(value) {
  return String(value || "").trim().toLowerCase();
}

function usernameCandidates(user) {
  const email = normalized(user.email);
  const name = normalized(user.name);
  const emailPrefix = email.includes("@") ? email.split("@")[0] : "";
  const prefs = user.prefs && typeof user.prefs === "object" ? user.prefs : {};
  return [
    email,
    emailPrefix,
    name,
    normalized(prefs.username),
    normalized(prefs.userName),
    normalized(prefs.login),
  ].filter(Boolean);
}

async function readRequestBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }
  if (typeof request.body === "string") {
    return request.body ? JSON.parse(request.body) : {};
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function queryString(queries) {
  const params = new URLSearchParams();
  for (const query of queries) {
    params.append("queries[]", JSON.stringify(query));
  }
  return params.toString();
}

async function listUsers(cfg, offset) {
  const qs = queryString([
    { method: "limit", values: [100] },
    { method: "offset", values: [offset] },
  ]);
  const response = await fetch(`${cfg.endpoint}/users?${qs}`, {
    headers: {
      "X-Appwrite-Project": cfg.projectId,
      "X-Appwrite-Key": cfg.apiKey,
      "X-Appwrite-Response-Format": cfg.responseFormat,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Appwrite users lookup failed: ${detail || response.statusText}`);
  }
  return response.json();
}

async function findUserByUsername(cfg, username) {
  const target = normalized(username);
  if (!target) return null;

  const matches = [];
  for (let offset = 0; offset < 1000; offset += 100) {
    const result = await listUsers(cfg, offset);
    const users = result.users || [];
    for (const user of users) {
      if (usernameCandidates(user).includes(target)) {
        matches.push(user);
      }
    }
    if (users.length < 100) break;
  }

  if (!matches.length) return null;
  const exactEmail = matches.find((user) => normalized(user.email) === target);
  return exactEmail || matches[0];
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { username } = await readRequestBody(request);
    const cleanUsername = String(username || "").trim();
    if (!cleanUsername) {
      response.status(400).json({ error: "Missing username" });
      return;
    }

    if (cleanUsername.includes("@")) {
      response.status(200).json({ email: cleanUsername });
      return;
    }

    const cfg = config();
    const user = await findUserByUsername(cfg, cleanUsername);
    if (!user?.email) {
      response.status(404).json({ error: "Username not found" });
      return;
    }

    response.status(200).json({ email: user.email });
  } catch (error) {
    response.status(500).json({
      error: "Unable to resolve username",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

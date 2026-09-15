(function () {
  "use strict";

  const state = {
    config: null,
    token: "",
    branch: "main",
    fileSha: "",
    tree: [],
    me: null,
  };

  const el = {
    token: document.getElementById("token"),
    branch: document.getElementById("branch"),
    authBtn: document.getElementById("btn-auth"),
    authStatus: document.getElementById("auth-status"),
    panel: document.getElementById("panel"),
    reloadBtn: document.getElementById("btn-reload"),
    addRootBtn: document.getElementById("btn-add-root"),
    exportBtn: document.getElementById("btn-export"),
    treeRoot: document.getElementById("tree-root"),
    yamlPreview: document.getElementById("yaml-preview"),
    saveBtn: document.getElementById("btn-save"),
    saveStatus: document.getElementById("save-status"),
    commitMsg: document.getElementById("commit-msg"),
  };

  function setStatus(target, text, ok) {
    target.textContent = text;
    target.classList.remove("ok", "err");
    target.classList.add(ok ? "ok" : "err");
  }

  async function fetchConfig() {
    const res = await fetch("/admin/config.json", { cache: "no-store" });
    if (!res.ok) {
      throw new Error("admin config를 불러오지 못했습니다.");
    }
    return res.json();
  }

  async function gh(path, opts) {
    const url = "https://api.github.com" + path;
    const headers = Object.assign(
      {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + state.token,
      },
      opts && opts.headers ? opts.headers : {}
    );
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    if (!res.ok) {
      const message = await res.text();
      throw new Error("GitHub API 오류: " + res.status + " " + message);
    }
    return res.json();
  }

  function decodeBase64(str) {
    return decodeURIComponent(
      atob(str.replace(/\n/g, ""))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }

  function encodeBase64Unicode(str) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_m, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  }

  function normalizeTree(input) {
    if (!Array.isArray(input)) {
      return [];
    }
    return input
      .map((node) => {
        const name = typeof node === "string" ? node.trim() : String(node.name || "").trim();
        if (!name) {
          return null;
        }
        const children = normalizeTree(node.children || []);
        return { name, children };
      })
      .filter(Boolean);
  }

  function getByPath(path) {
    let list = state.tree;
    let parent = null;
    for (let i = 0; i < path.length; i += 1) {
      const idx = path[i];
      const node = list[idx];
      if (!node) {
        return null;
      }
      if (i === path.length - 1) {
        return { node, parent, list, index: idx };
      }
      parent = node;
      list = node.children;
    }
    return null;
  }

  function moveInList(list, from, to) {
    if (to < 0 || to >= list.length) {
      return;
    }
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
  }

  function addRoot() {
    state.tree.push({ name: "새 카테고리", children: [] });
    render();
  }

  function addChild(path) {
    const found = getByPath(path);
    if (!found) {
      return;
    }
    found.node.children.push({ name: "새 하위 카테고리", children: [] });
    render();
  }

  function removeNode(path) {
    const found = getByPath(path);
    if (!found) {
      return;
    }
    found.list.splice(found.index, 1);
    render();
  }

  function moveUp(path) {
    const found = getByPath(path);
    if (!found || found.index === 0) {
      return;
    }
    moveInList(found.list, found.index, found.index - 1);
    render();
  }

  function moveDown(path) {
    const found = getByPath(path);
    if (!found || found.index >= found.list.length - 1) {
      return;
    }
    moveInList(found.list, found.index, found.index + 1);
    render();
  }

  function indentNode(path) {
    const found = getByPath(path);
    if (!found || found.index === 0) {
      return;
    }
    const previous = found.list[found.index - 1];
    if (!previous) {
      return;
    }
    const [item] = found.list.splice(found.index, 1);
    previous.children.push(item);
    render();
  }

  function outdentNode(path) {
    if (path.length < 2) {
      return;
    }
    const parentPath = path.slice(0, -1);
    const foundParent = getByPath(parentPath);
    if (!foundParent) {
      return;
    }
    const found = getByPath(path);
    if (!found) {
      return;
    }
    const grandPath = path.slice(0, -2);
    const parentIndex = parentPath[parentPath.length - 1];
    const [item] = found.list.splice(found.index, 1);

    if (grandPath.length === 0) {
      state.tree.splice(parentIndex + 1, 0, item);
    } else {
      const grand = getByPath(grandPath);
      if (!grand) {
        return;
      }
      grand.node.children.splice(parentIndex + 1, 0, item);
    }
    render();
  }

  function renameNode(path, name) {
    const found = getByPath(path);
    if (!found) {
      return;
    }
    found.node.name = name.trim() || found.node.name;
    renderPreview();
  }

  function buildNode(node, path, depth) {
    const item = document.createElement("li");
    item.className = "node";

    const head = document.createElement("div");
    head.className = "node-head";

    const left = document.createElement("div");
    const badge = document.createElement("span");
    badge.className = "pill";
    badge.textContent = "Depth " + depth;

    const input = document.createElement("input");
    input.type = "text";
    input.value = node.name;
    input.addEventListener("change", function () {
      renameNode(path, input.value);
    });

    left.appendChild(badge);
    left.appendChild(document.createTextNode(" "));
    left.appendChild(input);

    const tools = document.createElement("div");
    tools.className = "node-tools";

    const mk = (label, onClick, cls) => {
      const b = document.createElement("button");
      b.textContent = label;
      if (cls) {
        b.classList.add(cls);
      }
      b.addEventListener("click", onClick);
      return b;
    };

    tools.appendChild(mk("+하위", () => addChild(path)));
    tools.appendChild(mk("위", () => moveUp(path)));
    tools.appendChild(mk("아래", () => moveDown(path)));
    tools.appendChild(mk("들여쓰기", () => indentNode(path)));
    tools.appendChild(mk("내어쓰기", () => outdentNode(path)));
    tools.appendChild(mk("삭제", () => removeNode(path), "danger"));

    head.appendChild(left);
    head.appendChild(tools);
    item.appendChild(head);

    if (node.children && node.children.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "node-children";
      node.children.forEach((child, idx) => {
        ul.appendChild(buildNode(child, path.concat(idx), depth + 1));
      });
      item.appendChild(ul);
    }

    return item;
  }

  function renderPreview() {
    const yaml = jsyaml.dump({ categories: state.tree }, { noRefs: true, lineWidth: -1 }).trim() + "\n";
    el.yamlPreview.value = yaml;
  }

  function render() {
    el.treeRoot.innerHTML = "";
    const ul = document.createElement("ul");
    ul.className = "tree";
    state.tree.forEach((node, idx) => ul.appendChild(buildNode(node, [idx], 1)));
    el.treeRoot.appendChild(ul);
    renderPreview();
  }

  async function loadCategoryTree() {
    const cfg = state.config;
    const path = encodeURIComponent(cfg.categoryTreePath);
    const repo = `/${cfg.repositoryOwner}/${cfg.repositoryName}`;
    const data = await gh(`/repos${repo}/contents/${path}?ref=${encodeURIComponent(state.branch)}`);
    state.fileSha = data.sha;
    const text = decodeBase64(data.content);
    const parsed = jsyaml.load(text) || {};
    state.tree = normalizeTree(parsed.categories || []);
    render();
  }

  async function authenticate() {
    state.token = el.token.value.trim();
    state.branch = el.branch.value.trim() || state.config.defaultBranch || "main";
    if (!state.token) {
      setStatus(el.authStatus, "토큰을 입력하세요.", false);
      return;
    }

    try {
      const me = await gh("/user");
      state.me = me;
      if ((me.login || "").toLowerCase() !== String(state.config.masterGithubLogin || "").toLowerCase()) {
        setStatus(el.authStatus, `접근 거부: ${me.login} 계정은 마스터가 아닙니다.`, false);
        el.panel.classList.add("hidden");
        return;
      }

      await loadCategoryTree();
      setStatus(el.authStatus, `인증 성공: ${me.login}`, true);
      el.panel.classList.remove("hidden");
    } catch (err) {
      setStatus(el.authStatus, err.message, false);
      el.panel.classList.add("hidden");
    }
  }

  async function save() {
    try {
      const yamlText = jsyaml.dump({ categories: state.tree }, { noRefs: true, lineWidth: -1 }).trim() + "\n";
      const cfg = state.config;
      const repo = `/${cfg.repositoryOwner}/${cfg.repositoryName}`;
      const path = encodeURIComponent(cfg.categoryTreePath);
      const message = (el.commitMsg.value || "chore: update category tree from admin").trim();
      const payload = {
        message,
        content: encodeBase64Unicode(yamlText),
        branch: state.branch,
        sha: state.fileSha,
      };

      const res = await gh(`/repos${repo}/contents/${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      state.fileSha = res.content.sha;
      setStatus(el.saveStatus, "저장 완료", true);
    } catch (err) {
      setStatus(el.saveStatus, err.message, false);
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ categories: state.tree }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "category_tree.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function bootstrap() {
    try {
      state.config = await fetchConfig();
      el.branch.value = state.config.defaultBranch || "main";
    } catch (err) {
      setStatus(el.authStatus, err.message, false);
    }
  }

  el.authBtn.addEventListener("click", authenticate);
  el.reloadBtn.addEventListener("click", loadCategoryTree);
  el.addRootBtn.addEventListener("click", addRoot);
  el.saveBtn.addEventListener("click", save);
  el.exportBtn.addEventListener("click", exportJson);

  bootstrap();
})();

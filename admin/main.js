(function () {
  "use strict";

  const state = {
    config: null,
    token: "",
    branch: "main",
    fileSha: "",
    tree: [],
    originalTree: [],
    me: null,
    nextNodeId: 1,
    postCategoryIndex: null,
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
    deleteModal: document.getElementById("delete-modal"),
    deleteModalMessage: document.getElementById("delete-modal-message"),
    deleteConfirmInput: document.getElementById("delete-confirm-input"),
    deleteCancel: document.getElementById("delete-cancel"),
    deleteConfirm: document.getElementById("delete-confirm"),
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
        return { id: "node-" + state.nextNodeId++, name, children };
      })
      .filter(Boolean);
  }

  function cloneTree(nodes) {
    return nodes.map((node) => ({
      id: node.id,
      name: node.name,
      children: cloneTree(node.children || []),
    }));
  }

  function collectNodePaths(nodes, parentPath, pathMap) {
    nodes.forEach((node) => {
      const nextPath = parentPath.concat(node.name);
      pathMap[node.id] = nextPath;
      if (node.children && node.children.length > 0) {
        collectNodePaths(node.children, nextPath, pathMap);
      }
    });
    return pathMap;
  }

  function isPrefixPath(prefix, path) {
    if (prefix.length > path.length) {
      return false;
    }
    for (let i = 0; i < prefix.length; i += 1) {
      if (prefix[i] !== path[i]) {
        return false;
      }
    }
    return true;
  }

  // 글이 속한 노드 = 원래 트리에서 글의 categories 와 가장 깊게 일치하는 노드.
  // 그 노드가 지금 트리에 없으면 글을 지우고, 있으면 노드의 지금 경로로 바꿉니다.
  // (하위 카테고리를 밖으로 옮긴 뒤 상위를 지워도 옮긴 쪽 글은 남고, 상위·하위를 함께 바꿔도 둘 다 반영)
  function deepestOriginalId(categories, originalPaths) {
    let found = null;
    Object.keys(originalPaths).forEach((id) => {
      const path = originalPaths[id];
      if (isPrefixPath(path, categories) && (!found || path.length > originalPaths[found].length)) {
        found = id;
      }
    });
    return found;
  }

  function hasTreeChanges() {
    const originalPaths = getOriginalPathMap();
    const currentPaths = getCurrentPathMap();
    return Object.keys(originalPaths).some(
      (id) => !currentPaths[id] || JSON.stringify(originalPaths[id]) !== JSON.stringify(currentPaths[id])
    );
  }

  function parseFrontMatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
    if (!match) {
      return null;
    }
    const data = jsyaml.load(match[1]) || {};
    return { data, body: match[2] || "" };
  }

  // front matter의 categories 줄만 바꿉니다. YAML 전체를 다시 쓰면
  // date가 UTC로 바뀌는 등 다른 값까지 달라지므로 나머지 바이트는 그대로 둡니다.
  function replaceCategoriesLine(content, categories) {
    const match = content.match(/^---(\r?\n)([\s\S]*?)\r?\n---(\r?\n|$)/);
    if (!match) {
      return null;
    }
    const nl = match[1];
    const line = "categories: [" + categories.map((c) => JSON.stringify(c)).join(", ") + "]";
    const lines = match[2].split(/\r?\n/);
    const out = [];
    let replaced = false;
    for (let i = 0; i < lines.length; i += 1) {
      const key = lines[i].match(/^categories\s*:(.*)$/);
      if (!key) {
        out.push(lines[i]);
        continue;
      }
      if (!replaced) {
        out.push(line);
        replaced = true;
      }
      if (key[1].trim() === "") {
        // 블록 목록(- a) 형태면 그 항목 줄들도 함께 교체
        while (i + 1 < lines.length && /^\s*-\s/.test(lines[i + 1])) {
          i += 1;
        }
      }
    }
    if (!replaced) {
      out.push(line);
    }
    return "---" + nl + out.join(nl) + nl + "---" + match[3] + content.slice(match[0].length);
  }

  // 순서를 지키면서 최대 limit 개씩 동시에 요청
  async function mapLimit(items, limit, fn) {
    const results = new Array(items.length);
    let next = 0;
    async function worker() {
      while (next < items.length) {
        const i = next;
        next += 1;
        results[i] = await fn(items[i], i);
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
  }

  function normalizeCategories(categories) {
    if (!categories) {
      return [];
    }
    if (Array.isArray(categories)) {
      return categories.map((item) => String(item));
    }
    return [String(categories)];
  }

  async function loadPostEntries() {
    const cfg = state.config;
    const repo = `/${cfg.repositoryOwner}/${cfg.repositoryName}`;
    const entries = await gh(`/repos${repo}/contents/${encodeURIComponent("_posts")}?ref=${encodeURIComponent(state.branch)}`);
    return entries.filter((entry) => entry.type === "file" && entry.name.endsWith(".md"));
  }

  // 모든 글의 { path, sha, content }
  async function loadPosts() {
    const cfg = state.config;
    const repo = `/${cfg.repositoryOwner}/${cfg.repositoryName}`;
    const entries = await loadPostEntries();
    return mapLimit(entries, 6, async (entry) => {
      const data = await gh(`/repos${repo}/contents/${encodeURIComponent(entry.path)}?ref=${encodeURIComponent(state.branch)}`);
      return { path: entry.path, sha: data.sha, content: decodeBase64(data.content) };
    });
  }

  async function ensurePostCategoryIndex() {
    if (state.postCategoryIndex) {
      return state.postCategoryIndex;
    }

    const index = [];
    for (const post of await loadPosts()) {
      const parsed = parseFrontMatter(post.content);
      if (!parsed) {
        continue;
      }
      const categories = normalizeCategories(parsed.data.categories);
      if (categories.length === 0) {
        continue;
      }
      index.push({ path: post.path, categories });
    }

    state.postCategoryIndex = index;
    return index;
  }

  function getOriginalPathMap() {
    return collectNodePaths(state.originalTree, [], {});
  }

  function getCurrentPathMap() {
    return collectNodePaths(state.tree, [], {});
  }

  function openDeleteModal(categoryName, postCount) {
    return new Promise((resolve) => {
      var done = false;

      function cleanup(result) {
        if (done) {
          return;
        }
        done = true;
        el.deleteModal.classList.remove("is-open");
        el.deleteModal.setAttribute("aria-hidden", "true");
        el.deleteConfirmInput.value = "";
        el.deleteConfirm.disabled = true;
        el.deleteConfirmInput.removeEventListener("input", onInput);
        el.deleteCancel.removeEventListener("click", onCancel);
        el.deleteConfirm.removeEventListener("click", onConfirm);
        el.deleteModal.removeEventListener("click", onOverlayClick);
        document.removeEventListener("keydown", onKeydown);
        resolve(result);
      }

      function onInput() {
        el.deleteConfirm.disabled = el.deleteConfirmInput.value.trim() !== "확인";
      }

      function onCancel() {
        cleanup(false);
      }

      function onConfirm() {
        if (el.deleteConfirmInput.value.trim() !== "확인") {
          return;
        }
        cleanup(true);
      }

      function onOverlayClick(event) {
        if (event.target === el.deleteModal) {
          cleanup(false);
        }
      }

      function onKeydown(event) {
        if (event.key === "Escape") {
          cleanup(false);
        }
      }

      const nameEl = document.createElement("strong");
      nameEl.textContent = categoryName;
      const countEl = document.createElement("strong");
      countEl.textContent = postCount + "개";
      el.deleteModalMessage.replaceChildren(
        nameEl,
        " 카테고리를 삭제하면 연결된 글 ",
        countEl,
        "도 함께 삭제됩니다."
      );
      el.deleteModal.classList.add("is-open");
      el.deleteModal.setAttribute("aria-hidden", "false");
      el.deleteConfirmInput.value = "";
      el.deleteConfirm.disabled = true;
      el.deleteConfirmInput.addEventListener("input", onInput);
      el.deleteCancel.addEventListener("click", onCancel);
      el.deleteConfirm.addEventListener("click", onConfirm);
      el.deleteModal.addEventListener("click", onOverlayClick);
      document.addEventListener("keydown", onKeydown);
      el.deleteConfirmInput.focus();
    });
  }

  async function buildPostMutations() {
    if (!hasTreeChanges()) {
      return [];
    }

    const originalPaths = getOriginalPathMap();
    const currentPaths = getCurrentPathMap();
    const mutations = [];

    for (const post of await loadPosts()) {
      const parsed = parseFrontMatter(post.content);
      if (!parsed) {
        continue;
      }

      const categories = normalizeCategories(parsed.data.categories);
      const id = deepestOriginalId(categories, originalPaths);
      if (!id) {
        continue;
      }

      if (!currentPaths[id]) {
        mutations.push({ type: "delete", path: post.path, sha: post.sha, categories });
        continue;
      }

      const nextCategories = currentPaths[id].concat(categories.slice(originalPaths[id].length));
      if (JSON.stringify(nextCategories) === JSON.stringify(categories)) {
        continue;
      }

      mutations.push({
        type: "update",
        path: post.path,
        sha: post.sha,
        content: replaceCategoriesLine(post.content, nextCategories),
        before: categories,
        after: nextCategories,
      });
    }

    return mutations;
  }

  async function applyPostMutations(mutations, message) {
    if (mutations.length === 0) {
      return;
    }

    const cfg = state.config;
    const repo = `/${cfg.repositoryOwner}/${cfg.repositoryName}`;
    for (let i = 0; i < mutations.length; i += 1) {
      const mutation = mutations[i];
      setStatus(el.saveStatus, `글 동기화 중 ${i + 1}/${mutations.length}`, true);
      if (mutation.type === "delete") {
        await gh(`/repos${repo}/contents/${encodeURIComponent(mutation.path)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `${message} (delete posts in removed category)`,
            sha: mutation.sha,
            branch: state.branch,
          }),
        });
        continue;
      }

      await gh(`/repos${repo}/contents/${encodeURIComponent(mutation.path)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${message} (sync post categories)`,
          content: encodeBase64Unicode(mutation.content),
          sha: mutation.sha,
          branch: state.branch,
        }),
      });
    }
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

  function newNode(name) {
    return { id: "node-" + state.nextNodeId++, name, children: [] };
  }

  function addRoot() {
    state.tree.push(newNode("새 카테고리"));
    render();
  }

  function addChild(path) {
    const found = getByPath(path);
    if (!found) {
      return;
    }
    found.node.children.push(newNode("새 하위 카테고리"));
    render();
  }

  async function removeNode(path) {
    const found = getByPath(path);
    if (!found) {
      return;
    }

    // 저장할 때 실제로 지워질 글 수: 이 노드(와 지금 그 아래 있는 노드)에 속한 글
    const ids = new Set(Object.keys(collectNodePaths([found.node], [], {})));
    const originalPaths = getOriginalPathMap();
    const postIndex = await ensurePostCategoryIndex();
    const postCount = postIndex.filter((entry) => ids.has(deepestOriginalId(entry.categories, originalPaths))).length;
    const confirmed = await openDeleteModal(found.node.name, postCount);

    if (!confirmed) {
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
      input.value = node.name; // 빈 이름이면 원래 이름으로 되돌림
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
    const yaml = jsyaml.dump({ categories: state.tree.map(stripNodeIds) }, { noRefs: true, lineWidth: -1 }).trim() + "\n";
    el.yamlPreview.value = yaml;
  }

  function stripNodeIds(node) {
    return {
      name: node.name,
      children: (node.children || []).map(stripNodeIds),
    };
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
    state.nextNodeId = 1;
    state.postCategoryIndex = null;
    state.tree = normalizeTree(parsed.categories || []);
    state.originalTree = cloneTree(state.tree);
    render();
  }

  async function authenticate() {
    if (!state.config) {
      setStatus(el.authStatus, "admin config를 불러오지 못했습니다. 새로고침해 주세요.", false);
      return;
    }
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
      el.saveBtn.disabled = true;
      const mutations = await buildPostMutations();
      const yamlText = jsyaml.dump({ categories: state.tree.map(stripNodeIds) }, { noRefs: true, lineWidth: -1 }).trim() + "\n";
      const cfg = state.config;
      const repo = `/${cfg.repositoryOwner}/${cfg.repositoryName}`;
      const path = encodeURIComponent(cfg.categoryTreePath);
      const message = (el.commitMsg.value || "chore: update category tree from admin").trim();

      await applyPostMutations(mutations, message);

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
      state.originalTree = cloneTree(state.tree);
      state.postCategoryIndex = null;
      setStatus(el.saveStatus, "저장 완료", true);
    } catch (err) {
      setStatus(el.saveStatus, err.message, false);
    } finally {
      el.saveBtn.disabled = false;
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ categories: state.tree.map(stripNodeIds) }, null, 2)], { type: "application/json" });
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

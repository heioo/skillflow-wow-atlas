const release = encodeURIComponent(document.documentElement.dataset.release);

async function readData(path) {
  const response = await fetch(path + "?v=" + release, {cache: "no-cache"});
  if (!response.ok) throw Error("HTTP " + response.status);
  return response.json();
}

function append(parent, tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}

function externalLink(parent, title, url) {
  const link = append(parent, "a", title + " ↗");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function renderReading(parent, resources, achievementId) {
  const list = append(parent, "ul", "", "readings");
  for (const resource of resources) {
    const row = append(list, "li");
    externalLink(row, resource.title, resource.url);
    append(row, "span", resource.credit, "credit");
    append(row, "p", resource.note);
    if (resource.chapters) {
      const times = append(row, "div", "", "time-links");
      for (const chapter of resource.chapters) {
        if (achievementId && !chapter.ids.includes(achievementId)) continue;
        const stamp = Math.floor(chapter.time / 60) + ":" + String(chapter.time % 60).padStart(2, "0");
        externalLink(times, stamp + " " + chapter.label, resource.url + "?t=" + chapter.time);
      }
    }
  }
}

function renderRoute(body, chapter, resources, source) {
  const section = append(body, "section", "", "route");
  append(section, "h3", chapter.lead);
  const steps = append(section, "ol");
  chapter.steps.forEach(step => append(steps, "li", step));
  externalLink(section, chapter.source === "original" ? "《魔兽世界》公众号推荐原文" : "后续攻略推荐（17173 留存）", source);
  const shelf = append(section, "details", "", "shelf");
  append(shelf, "summary", "视频与图文攻略（" + resources.length + "）");
  renderReading(shelf, resources);
}

async function renderAtlas() {
  const [atlas, guides] = await Promise.all([readData("assets/atlas.json"), readData("assets/field-guides.json")]);
  const records = await readData(atlas.achievementDetails);
  document.querySelector("#edition").textContent = "客户端 " + atlas.build + " · " + atlas.edition;
  for (const raid of atlas.raids) {
    const detail = append(document.querySelector("#raids"), "details");
    append(detail, "summary", raid.name + " · " + raid.bosses.length + " 场首领战");
    const list = append(detail, "ol");
    raid.bosses.forEach(boss => append(list, "li", boss));
  }

  function showAchievement(parent, id, expansion) {
    const record = records[id];
    const children = record.children || [];
    const detail = append(parent, "details", "", expansion ? "achievement chapter" : "achievement");
    const summary = append(detail, "summary");
    const chapter = guides.chapters[id];
    if (expansion) {
      const image = append(summary, "img", "", "region");
      image.src = "assets/region-" + id + ".webp";
      image.alt = "";
      const label = append(summary, "span", "", "label");
      append(label, "span", expansion + " · " + children.length + " 项直属成就", "era");
      append(label, "strong", record.name);
      const reward = append(label, "span", "", "mount-reward");
      const icon = append(reward, "img");
      icon.src = "assets/achievement-" + id + ".jpg";
      icon.alt = "";
      append(reward, "span", "坐骑 · " + chapter.reward);
      const arrow = append(summary, "span", "▸", "arrow");
      arrow.setAttribute("aria-hidden","true");
    } else {
      append(summary, "strong", record.name);
    }

    detail.addEventListener("toggle", () => {
      if (!detail.open || detail.querySelector(":scope > .achievement-body")) return;
      const body = append(detail, "div", "", "achievement-body");
      append(body, "p", record.description);
      if (record.reward) append(body, "p", record.reward, "reward");
      externalLink(body, "在 Wowhead 查看", "https://www.wowhead.com/cn/achievement=" + id);
      if (expansion) {
        renderRoute(body, chapter, guides.links.filter(item => item.root === id), guides.sources[chapter.source]);
      } else {
        const resources = guides.links.filter(item => item.forIds.includes(id));
        if (resources.length) {
          const section = append(body, "section", "", "route");
          append(section, "h3", "相关攻略");
          renderReading(section, resources, id);
        }
      }
      if (children.length) {
        append(body, "h3", "直属子成就（" + children.length + "）");
        children.forEach(child => showAchievement(body, child));
      }
    });
  }
  for (const item of atlas.achievements) showAchievement(document.querySelector("#mounts"), item.id, item.expansion);
}
renderAtlas().catch(error => document.querySelector("#edition").textContent = "图鉴加载失败：" + error.message);

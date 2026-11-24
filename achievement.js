import {release, readData, append, externalLink, achievementCard, renderReading} from "./shared.js?v=outland-4";

function descendantIds(id, records, found = new Set()) {
  if (found.has(id)) return found;
  found.add(id);
  for (const child of records[id].children || []) descendantIds(child, records, found);
  return found;
}

function renderRequirements(parent, tree, root, records, routes, images, depth = 0) {
  if (!tree?.items) return;
  if (depth > 0 && tree.label) append(parent, "h3", tree.label, "requirement-label");
  if (tree.choose) {
    append(parent, "p", "以下 " + tree.items.length + " 项中任选 " + tree.choose + " 项", "choice-note");
  }
  const list = append(parent, "div", "", "requirement-group");
  const cards = append(list, "div", "", "child-grid");
  for (const item of tree.items) {
    if (item.achievement) {
      achievementCard(cards, item.achievement, root, records, routes, images);
    } else if (item.items) {
      renderRequirements(list, item, root, records, routes, images, depth + 1);
    } else if (item.label) {
      append(list, "p", item.label, "requirement-item");
    }
  }
  if (!cards.children.length) cards.remove();
}

async function renderAchievement() {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const [atlas, records, routes, guides, requirements, images] = await Promise.all([
    readData("assets/atlas.json"),
    readData("assets/achievement-details.json"),
    readData("assets/child-guides.json"),
    readData("assets/field-guides.json"),
    readData("assets/achievement-requirements.json"),
    readData("assets/card-images.json")
  ]);
  const record = records[id];
  if (!record) throw Error("没有找到这项成就，请返回成就目录。");
  const memberships = atlas.achievements.filter(item => descendantIds(item.id, records).has(id));
  const root = memberships.find(item => item.id === Number(params.get("root"))) || memberships[0];
  if (!root) throw Error("这项成就尚未收录到版本目录。");

  const title = document.querySelector("#achievement-title");
  title.textContent = record.name;
  document.title = record.name + " · 艾泽拉斯档案馆";
  const image = document.querySelector("#guide-image");
  image.src = "assets/region-" + root.id + ".webp";
  image.hidden = false;
  document.querySelector("#guide-area").textContent = routes[id]?.area || root.expansion;
  const rootLink = "index.html?v=" + release + "#achievement-" + root.id;
  document.querySelector("#back-link").href = rootLink;
  const crumbs = document.querySelector("#breadcrumbs");
  const home = append(crumbs, "a", root.name);
  home.href = rootLink;
  append(crumbs, "span", " / " + record.name);

  const body = document.querySelector("#guide-content");
  append(body, "p", record.description, "guide-description");
  if (record.reward) append(body, "p", record.reward, "reward");
  const route = routes[id];
  if (route) {
    const section = append(body, "section", "", "walkthrough");
    append(section, "h2", "出发前");
    append(section, "p", route.preparation);
    append(section, "h2", "完成路线");
    const steps = append(section, "ol", "", "guide-steps");
    route.steps.forEach(step => append(steps, "li", step));
    append(section, "p", route.tip, "guide-tip");
  }

  const criteria = append(body, "section", "", "completion");
  append(criteria, "h2", "完成清单");
  if (requirements[id]) {
    renderRequirements(criteria, requirements[id], root.id, records, routes, images);
  } else {
    append(criteria, "p", record.description);
  }

  const resources = guides.achievementLinks[String(id)] || [];
  if (resources.length) {
    const sources = append(body, "section", "", "guide-sources");
    append(sources, "h2", "本项攻略");
    renderReading(sources, resources, id);
  }
  const reference = append(body, "section", "", "guide-reference");
  append(reference, "h2", "完成条件参考");
  append(reference, "p", "完成清单按客户端 " + atlas.build + " · zhCN 收录。");
  externalLink(reference, "在 Wowhead 核对本项成就", "https://www.wowhead.com/cn/achievement=" + id);
  const footer = append(body, "footer");
  const back = append(footer, "a", "← 返回" + root.name);
  back.href = rootLink;
  append(footer, "a", "回到页首 ↑").href = "#top";
}
renderAchievement().catch(error => {
  document.querySelector("#achievement-title").textContent = "成就暂时无法读取";
  document.querySelector("#guide-area").textContent = error.message;
});

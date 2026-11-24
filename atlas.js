import {readData, append, externalLink, achievementCard, renderReading} from "./shared.js?v=outland-3";

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
  const [atlas, guides, routes, images] = await Promise.all([
    readData("assets/atlas.json"),
    readData("assets/field-guides.json"),
    readData("assets/child-guides.json"),
    readData("assets/card-images.json")
  ]);
  const records = await readData(atlas.achievementDetails);
  document.querySelector("#edition").textContent = "客户端 " + atlas.build + " · " + atlas.edition;
  for (const raid of atlas.raids) {
    const detail = append(document.querySelector("#raids"), "details");
    append(detail, "summary", raid.name + " · " + raid.bosses.length + " 场首领战");
    const list = append(detail, "ol");
    raid.bosses.forEach(boss => append(list, "li", boss));
  }

  for (const item of atlas.achievements) {
    const record = records[item.id];
    const chapter = guides.chapters[item.id];
    const detail = append(document.querySelector("#mounts"), "details", "", "achievement chapter");
    detail.id = "achievement-" + item.id;
    const summary = append(detail, "summary");
    const image = append(summary, "img", "", "region");
    image.src = "assets/region-" + item.id + ".webp";
    image.alt = "";
    const label = append(summary, "span", "", "label");
    append(label, "span", item.expansion + " · " + record.children.length + " 项直属成就", "era");
    append(label, "strong", record.name);
    const reward = append(label, "span", "", "mount-reward");
    const icon = append(reward, "img");
    icon.src = "assets/achievement-" + item.id + ".jpg";
    icon.alt = "";
    append(reward, "span", "坐骑 · " + chapter.reward);
    append(summary, "span", "▸", "arrow").setAttribute("aria-hidden", "true");

    detail.addEventListener("toggle", () => {
      if (!detail.open || detail.querySelector(":scope > .achievement-body")) return;
      const body = append(detail, "div", "", "achievement-body");
      append(body, "p", record.description);
      if (record.reward) append(body, "p", record.reward, "reward");
      externalLink(body, "在 Wowhead 查看", "https://www.wowhead.com/cn/achievement=" + item.id);
      renderRoute(body, chapter, guides.links.filter(link => link.root === item.id), guides.sources[chapter.source]);
      append(body, "h3", "直属子成就（" + record.children.length + "）");
      const cards = append(body, "div", "", "child-grid");
      for (const child of record.children) achievementCard(cards, child, item.id, records, routes, images);
    });
  }

  function openLinkedChapter() {
    const chapter = document.getElementById(location.hash.slice(1));
    if (chapter?.matches(".chapter")) chapter.open = true;
  }
  openLinkedChapter();
  window.addEventListener("hashchange", openLinkedChapter);
}
renderAtlas().catch(error => document.querySelector("#edition").textContent = "图鉴加载失败：" + error.message);

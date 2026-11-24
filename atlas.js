async function renderAtlas() {
  const response = await fetch("assets/atlas.json?v=" + encodeURIComponent(document.documentElement.dataset.release), {cache: "no-cache"});
  if (!response.ok) throw Error("HTTP " + response.status);
  const atlas = await response.json();
  document.querySelector("#edition").textContent = "客户端 " + atlas.build + " · 图鉴版本 " + atlas.edition;
  function append(parent, tag, text) {
    const item = document.createElement(tag);
    item.textContent = text;
    parent.appendChild(item);
    return item;
  }
  for (const raid of atlas.raids) {
    const detail = append(document.querySelector("#raids"), "details", "");
    append(detail, "summary", raid.name + " · " + raid.bosses.length + " 场首领战");
    const list = append(detail, "ol", "");
    raid.bosses.forEach(boss => append(list, "li", boss));
  }

  const mounts = document.querySelector("#mounts");
  const release = encodeURIComponent(document.documentElement.dataset.release);
  const responseDetails = await fetch(atlas.achievementDetails + "?v=" + release);
  if (!responseDetails.ok) throw Error("成就详情 HTTP " + responseDetails.status);
  const records = await responseDetails.json();

  function showAchievement(parent, id, expansion) {
    const record = records[id];
    const children = record.children || [];
    const detail = append(parent, "details", "");
    detail.className = "achievement";
    const summary = append(detail, "summary", "");
    append(summary, "strong", record.name);
    if (expansion) {
      append(summary, "span", expansion + " · " + children.length + " 项直属成就");
    }

    detail.addEventListener("toggle", () => {
      if (!detail.open || detail.querySelector(".achievement-body")) return;
      const body = append(detail, "div", "");
      body.className = "achievement-body";
      append(body, "p", record.description);
      if (record.reward) append(body, "p", record.reward).className = "reward";
      const link = append(body, "a", "在 Wowhead 查看 ↗");
      link.href = "https://www.wowhead.com/cn/achievement=" + id;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (children.length) {
        append(body, "h3", "直属子成就（" + children.length + "）");
        for (const child of children) showAchievement(body, child);
      }
    });
  }

  for (const item of atlas.achievements) showAchievement(mounts, item.id, item.expansion);

}
renderAtlas().catch(error => document.querySelector("#edition").textContent = "图鉴加载失败：" + error.message);


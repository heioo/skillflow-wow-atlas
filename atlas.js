async function renderAtlas() {
  const response = await fetch("assets/atlas.json", {cache: "no-cache"});
  if (!response.ok) throw Error("HTTP " + response.status);
  const atlas = await response.json();
  document.querySelector("#edition").textContent = "客户端 " + atlas.build + " · 图鉴版本 " + atlas.edition;
  function append(parent, tag, text) {
    const item = document.createElement(tag);
    item.textContent = text;
    parent.appendChild(item);
    return item;
  }
  for (const item of atlas.achievements) {
    const card = append(document.querySelector("#mounts"), "article", "");
    append(card, "strong", item.name);
    append(card, "span", item.children + " 项直属成就");
  }
  for (const raid of atlas.raids) {
    const detail = append(document.querySelector("#raids"), "details", "");
    append(detail, "summary", raid.name + " · " + raid.bosses.length + " 场首领战");
    const list = append(detail, "ol", "");
    raid.bosses.forEach(boss => append(list, "li", boss));
  }
}
renderAtlas().catch(error => document.querySelector("#edition").textContent = "图鉴加载失败：" + error.message);


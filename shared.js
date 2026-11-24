const release = encodeURIComponent(document.documentElement.dataset.release);

export async function readData(path) {
  const response = await fetch(path + "?v=" + release, {cache: "no-cache"});
  if (!response.ok) throw Error("HTTP " + response.status);
  return response.json();
}

export function append(parent, tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}

export function externalLink(parent, title, url) {
  const link = append(parent, "a", title + " ↗");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

export function achievementCard(parent, id, root, records, routes) {
  const record = records[id];
  const link = append(parent, "a", "", "child-card");
  link.href = "achievement.html?id=" + id + "&root=" + root;
  append(link, "strong", record.name);
  append(link, "span", record.description, "card-description");
  if (routes[id]?.area) append(link, "span", routes[id].area, "card-meta");
  append(link, "span", routes[id] ? "查看攻略 →" : "查看完成条件 →", "card-action");
  return link;
}

export function renderReading(parent, resources, achievementId) {
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

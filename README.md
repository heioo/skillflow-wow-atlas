# 艾泽拉斯手册
公开的 Skillflow Project Home 前端实验。在线页面 https://heioo.github.io/skillflow-wow-atlas/ 。
页面加载 assets/atlas.json，展示四项综合成就和两个团队副本。打开副本可展开首领清单。

## 查询数据
读取 [图鉴 JSON](https://raw.githubusercontent.com/heioo/skillflow-wow-atlas/main/assets/atlas.json)。edition 是演示图鉴的版本码。raids 按客户端地下城手册顺序列出各副本首领。
本地可运行 python3 -m http.server 后打开首页。
数据取自魔兽世界正式服简中客户端 12.1.5.70961 的 Achievement、CriteriaTree、JournalInstance、JournalEncounter 表，经 [Wago.Tools](https://wago.tools/db2) 核对。此为玩家制作的演示。前端代码采用 MIT 许可，游戏名称与相关权利归原权利人。


## 发布更新
修改页面、脚本或数据后，将 index.html 中的 data-release 与 CSS、JS 引用的版本参数一起更新，再推送 main。Pages 部署完成后，重新打开 Skillflow 活动主页即可请求已发布版本。

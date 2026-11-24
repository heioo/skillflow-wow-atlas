# 艾泽拉斯手册
公开的 Skillflow Project Home 前端实验。在线页面 https://heioo.github.io/skillflow-wow-atlas/ 。
页面加载 assets/atlas.json，展示四项综合成就和两个团队副本。打开成就可查看客户端简中说明、已记录的奖励和各级子成就，打开副本可展开首领清单。

## 查询数据
读取 [图鉴 JSON](https://raw.githubusercontent.com/heioo/skillflow-wow-atlas/main/assets/atlas.json)。edition 是演示图鉴的版本码。achievementDetails 指向以成就 ID 索引的 [详细记录](assets/achievement-details.json)，其中 children 保存直属子成就 ID。raids 按客户端地下城手册顺序列出各副本首领。
本地可运行 python3 -m http.server 后打开首页。
数据取自魔兽世界正式服简中客户端 12.1.5.70961 的 Achievement、CriteriaTree、JournalInstance、JournalEncounter 表，经 [Wago.Tools](https://wago.tools/db2) 核对。此为玩家制作的演示。前端代码采用 MIT 许可，游戏名称与相关权利归原权利人。


## 发布更新
修改页面、脚本或数据后，将 index.html 中的 data-release 与 CSS、JS 引用的版本参数一起更新，再推送 main。Pages 部署完成后，重新打开 Skillflow 活动主页即可请求已发布版本。

## 成就攻略与插画
四张资料片卡片可展开攻略路线、作者来源和直属子成就。攻略索引保存在 `assets/field-guides.json`。视频条目链接到作者页面；抖音专用码链接到公众号原始分享卡，NGA 条目标注登录要求。读者可在「地心寻魂」视频条目中按时间跳到对应分支。
题图和资料片场景为本项目生成的原创插画。成就图标按游戏成就 ID 通过 Wowhead 的公开图标数据核对，游戏图标和游戏名称归原权利人。源码许可不涵盖第三方游戏美术与外链攻略。

## 子成就攻略页
主页「直属子成就」使用卡片链接进入 `achievement.html?id=成就ID&root=版本成就ID`。58 项直属成就的准备、路线与提示在 `assets/child-guides.json`，继续点开下级卡片可以核对各项完成条件。
`assets/achievement-requirements.json` 保留客户端条件树中的任选分支，包含外观八选四、盟约突袭九选四、阵营分支与地下堡的替代条件。攻略中旧视频的活动与赛季说明按录制版本保留，执行时核对当前游戏条件。

配图索引在 `assets/card-images.json`。58 项直属子成就使用对应首领、场景或玩法截图，下级条目使用各自的游戏成就图标。图片文件随仓库保存，每项记录保留原始来源页面，可从配图索引核对。

子成就页的攻略链接按 `assets/field-guides.json` 中的 `achievementLinks` 逐项登记。视频合辑使用已经核对的分段起止时间，页面显示本项片段范围。配图的来源保存在 `assets/card-images.json`，完成条件参考直达当前成就的数据库条目。

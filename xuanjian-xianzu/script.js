/* ======================================================================
   玄鉴仙族 · 深度拆解 — behavior + data rendering
   Standalone, no framework. Mirrors the original DC prototype's data model.
   ====================================================================== */
(function () {
  'use strict';

  var JADE = '#6fd6c0', GOLD = '#d8b15a', VIO = '#b8a7d9',
      GRAY = '#c9a24b', FOE = '#d8755a', GREEN = '#9bbf86';

  // small helpers ------------------------------------------------------
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ====================================================================
  // DATA
  // ====================================================================
  var navItems = [
    { id: 'identity', l: '身份' }, { id: 'realm', l: '境界' }, { id: 'lineage', l: '谱系' },
    { id: 'factions', l: '势力' }, { id: 'timeline', l: '时间轴' }, { id: 'conflict', l: '矛盾' }, { id: 'mirror', l: '玄鉴' }
  ];

  var stats = [
    { n: '13', l: '卷' }, { n: '1497', l: '章' }, { n: '7', l: '代传承' }, { n: '200+', l: '年家族史' }
  ];

  function colorFor(line) { return line === 'taiyin' ? JADE : line === 'mingyang' ? GOLD : VIO; }

  var masks = [
    { tag: '镜', name: '陆江仙', role: '青铜镜器灵 · 全书第一视角 · 太阴本体', chap: '第1卷 1章', line: 'taiyin' },
    { tag: '群', name: '李江群', role: '月华元府传人 · 第一道身份悬念', chap: '第1卷 57章 昏厥', line: 'taiyin' },
    { tag: '昃', name: '盈昃', role: '月华元府府主 · 转世前身', chap: '第5卷 531章 确认', line: 'taiyin' },
    { tag: '乾', name: '李乾元', role: '魏国太祖 · 明阳真君（被落霞镇压于煆山）', chap: '第4卷 380章 署名', line: 'mingyang' },
    { tag: '诰', name: '真诰 · 太阴府君', role: '镜内位格升格 · 铸青箓白箓', chap: '第7卷 801章', line: 'taiyin' },
    { tag: '尊', name: '南世尊', role: '明慧以「残经篇」认定', chap: '第12卷 1432章', line: 'truth' }
  ];

  var realms = [
    { name: '胎息境', alias: '养轮', trait: '六轮制：凝月华之气筑轮，玉京轮诞生灵识', chap: '第1卷', t: 1 },
    { name: '练气境', alias: '服气', trait: '前中后期约12层，可餐风饮露', chap: '第1卷', t: 2 },
    { name: '筑基境', alias: '——', trait: '六轮兵解 → 凝聚仙基，分初中后期', chap: '第1–2卷', t: 3 },
    { name: '紫府境', alias: '炼神', trait: '凝聚神通（五道为满），近五百年罕有金丹', chap: '第2卷 131章', t: 4 },
    { name: '大真人', alias: '——', trait: '四神通起步，神通圆满可压制八世摩诃', chap: '第7卷起', t: 5 },
    { name: '金丹真君', alias: '求性 · 证果位', trait: '寿元约千年，当世轻易不令出手 · 终极门槛', chap: '第2–3卷', t: 6 },
    { name: '道胎', alias: '——', trait: '感应天外大道，离开这片天地', chap: '第3卷 264章', t: 7 },
    { name: '金仙 · 大罗', alias: '——', trait: '仙道最高，「天不以三灾打」', chap: '第12卷', t: 8 }
  ];

  var generations = [
    { roman: 'I', zi: '木', label: '一代', color: GOLD, people: [
      { name: '李木田', note: '一代族长 · 凡人老兵 · 最深谋者，临终立大宗/小宗/支脉制' } ] },
    { roman: 'II', zi: '尺通项长', label: '二代', color: JADE, people: [
      { name: '李通崖', note: '次子 · 仙基「浩瀚海/泾龙王」· 卷2–3真正主角，独抗忿怒摩诃坐化' },
      { name: '李尺泾', note: '幼子 · 宗内名「李启」· 湖月秋月阙剑意，被青池炼死，剑意化青尺剑传世' },
      { name: '李项平', note: '三子 · 聪明多疑 · 第一代执行人，被山越黑气咒诛杀' } ] },
    { roman: 'III', zi: '玄', label: '三代', color: JADE, people: [
      { name: '李玄宣', note: '遗腹子 · 洞泉声 · 家族基盘维护者，长寿老祖' },
      { name: '李玄锋', note: '弓道宗师 · 镂金石，以命换江南后坐化' },
      { name: '李清虹', note: '枪修/雷修 · 紫雷秘元功' } ] },
    { roman: 'IV', zi: '渊清', label: '四代', color: GREEN, people: [
      { name: '李渊蛟', note: '山越血统 · 泾龙王，持青尺剑斩郁慕仙，后成龙属紫府' },
      { name: '李渊平', note: '体弱命短的政治谋略家，病逝留十五封绝笔信' } ] },
    { roman: 'V', zi: '曦', label: '五代', color: GOLD, people: [
      { name: '李曦明', note: '昭景真人 · 明阳紫府/大真人，卷6–13长期主视角，修成「天下明」' },
      { name: '李曦峻', note: '松上雪/明阳，东海殉道留明方天石' },
      { name: '李曦治', note: '究天阁峰主 · 虹霞道统' } ] },
    { roman: 'VI', zi: '周', label: '六代', color: GOLD, people: [
      { name: '李周巍', note: '明煌/白麒麟/魏王 · 明阳道统转世，世间最强战力，证道求金的明牌' },
      { name: '李周洛', note: '望月内政交接者' } ] },
    { roman: 'VII', zi: '绛', label: '七代', color: JADE, people: [
      { name: '李绛迁', note: '昶离 · 离火「大离书」· 家族实际主事者，第13卷有叛离伏笔' },
      { name: '李阙宛', note: '素韫 · 候神殊，打通太阴资源转化链' },
      { name: '李遂宁', note: '重生者 · 司天道统，献五现秘法的「变数」棋子' } ] }
  ];

  var relLegend = [
    { label: '主角方', color: GOLD }, { label: '盟友', color: JADE },
    { label: '剥削者 / 又合作又防范', color: GRAY }, { label: '敌对 / 反派', color: FOE }
  ];
  var rc = { self: GOLD, ally: JADE, gray: GRAY, foe: FOE };
  var rb = { self: 'rgba(216,177,90,.3)', ally: 'rgba(111,214,192,.3)', gray: 'rgba(201,162,75,.3)', foe: 'rgba(216,117,90,.35)' };
  function F(name, relKey, relLabel, note) {
    return { name: name, rel: relLabel, relColor: rc[relKey], relBorder: rb[relKey], note: note };
  }

  var factionGroups = [
    { group: '主角方 · 黎泾李家', items: [
      F('黎泾李氏 → 魏王一脉', 'self', '主角方', '越国黎泾山凡农起家，捡到法鉴；受青池庇护兼并立族，李曦明成紫府晋仙族，李周巍称藩封魏王、问鼎证道。')
    ] },
    { group: '宗门体系 · 自下而上的剥削链', items: [
      F('青池仙宗（迟家）', 'gray', '靠山兼剥削者', '前身「青迟魔门」，南五郡最大宗门。李家名义靠山，定期养肥收割世家；迟家嫡系覆灭后被阴司接管。'),
      F('萧家（衔忧山）', 'gray', '联姻又野心', '头号世家→紫府仙族。萧初庭暗成紫府自立、疑暗中操盘望月湖七大事，与李家世代联姻又暗存野心。'),
      F('金羽宗（金一道统）', 'gray', '又合作又防范', '三金之首，实控两条金道、道胎在望。既与李家合作又防范，张易革斩程郇之成真君。'),
      F('费家（寒云峰）', 'ally', '盟友→内附', '间道锦。与李家结盟重创郁家；费望白被白袍剑修暗杀，后举族内附，终因叛投北方被族灭。'),
      F('玄岳门（孔氏）', 'ally', '盟友→灭门', '搬山建峰的重要盟友，多次助战。长奚化山殒落、道统覆灭，孔婷云/孔孤皙相继自裁灭门。'),
      F('郁家', 'foe', '望月湖宿敌', '郁玉封→郁慕高→郁慕仙相继身死，被青尺剑斩杀，四分五裂彻底覆亡。'),
      F('镗金门（司徒氏）', 'foe', '北方世仇', '屠戮黎夏郡凡人、焰中乌旧仇。司徒末被李周巍击杀，遗孤司徒霍流亡三百年后归宋。'),
      F('长霄门', 'foe', '兜玄遗脉·反派', '命神通确认李周巍白麟身份、追杀李曦明；第9卷被李周巍灭门偿仇补资粮。')
    ] },
    { group: '幕后大反派 · 释魔 · 龙属', items: [
      F('落霞山', 'foe', '千年宿敌·大反派', '通玄道统幕后大反派。反复令明阳金转世身死、磨损命数，镇压李乾元于煆山——贯穿全书的终极对手。'),
      F('北方释修 · 摩诃', 'foe', '南北之争的魔方', '慈悲/大欲/空有三相南下掀魔灾。忿怒摩诃（九世食命）、广蝉（五世，魏李血裔，被李周巍斩）等。'),
      F('龙属 · 东海', 'gray', '既合作又博弈', '白龙祧（求稳）vs黑龙祧（求变），掌「合水」正位。证道争夺中李家既合作又博弈的一方。')
    ] },
    { group: '上层棋局 · 阴司与大宋', items: [
      F('阴司 / 大宋（杨氏）', 'gray', '扶持又博弈', '杨浞以真炁金性转世、立国称宋帝，是李周巍的「魏王」对照。阴司真实目的：借魏王证道放出被封印的魏帝李乾元。'),
      F('三玄道统体系', 'gray', '隐性最高等级', '青玄/通玄/兜玄共出正始观。三玄之下十二府邸，是南北道统与帝国兴亡在力量层面的总框架。')
    ] }
  ];

  function VC(line) { return line === 'g' ? GOLD : line === 'j' ? JADE : GREEN; }
  var volumes = [
    { v: '一', range: '1–120章', title: '器灵寄生与三代立基', tier: '凡农 → 隐秘修仙', gist: '现代人穿越成镜器灵寄生李家，授符种、定牲祭法，完成「被捡起的镜子→被祭祀的神明」的身份蜕变。', jump: '第43章器灵首次主动出手 · 第57章「李江群」悬念 · 第105章镜面四分五裂', c: 'j' },
    { v: '二', range: '121–240章', title: '李通崖立族与格局巨变', tier: '小族 → 第三筑基世家', gist: '李通崖兼并卢家、西征东山越、诛郁玉封三大扩张，成望月湖第三筑基世家。', jump: '第123章太阴升筑基 · 第221章萧初庭暗成紫府自立', c: 'j' },
    { v: '三', range: '241–360章', title: '坐化与代际传承', tier: '坐稳南岸 → 双核接班', gist: '李通崖独抗忿怒摩诃以命换境含笑坐化，李渊蛟/李渊平双核接班，魔灾中稳住根基。', jump: '第321章李通崖坐化 · 代际传承本身即「升级」', c: 'j' },
    { v: '四', range: '361–480章', title: '筑基扩张与斩郁慕仙', tier: '跻身有数筑基世家', gist: '东火/蜃镜洞天争宝、东海立足，斩宿敌郁慕仙，明阳金性接力隐入李周巍胎中。', jump: '第469章青尺剑斩郁慕仙 · 第473章明阳金性隐入李周巍', c: 'j' },
    { v: '五', range: '481–599章', title: '触底与仙人现世', tier: '整合望月湖南岸', gist: '北方释魔南下，燕山关半刻钟崩溃、李月湘战死——全书最低点；盈昃仙君现身赐法回调。', jump: '第531章确认盈昃身份 · 第598章盈昃现世赐法', c: 'j' },
    { v: '六', range: '600–719章', title: '以命换江南与晋位仙族', tier: '世家 → 紫府仙族', gist: '李玄锋以命换江南、迟家覆灭，李家一统望月湖；李曦明苦修终成紫府昭景真人。', jump: 'ch617李玄锋坐化 · ch687李曦明成明阳紫府', c: 'g' },
    { v: '七', range: '720–839章', title: '三线布局与真君旨意', tier: '仙族向江北扩张', gist: '李曦明外交/战争/疗伤三线并进守住底线；真君转世旨意降临江北，南北骤然收紧。', jump: '第730章白麟相首爆 · 第825章落霞仙旨', c: 'g' },
    { v: '八', range: '840–959章', title: '太阳道统溃败', tier: '南北大战的支柱', gist: '太阳道统历史性溃败（奎祈陨落、镗刀山失守）；隋观借百万屠戮逼显宛陵天。', jump: 'ch850开辟独立天宫洞天 · 第922章明阳父子相克揭示', c: 'g' },
    { v: '九', range: '960–1079章', title: '大宋立国与变数引入', tier: '称藩受封魏王', gist: '李周巍二神通横扫宛陵天暴富，李氏称藩封魏王、破灭长霄门；陆江仙推演1891次决意制造变数。', jump: '第992章1891次推演定下总纲 · 第1032章大宋立国', c: 'g' },
    { v: '十', range: '1080–1193章', title: '明阳横扫与成金奠基', tier: '庭州六郡 · 成金之路', gist: '李周巍斩广蝉、杀戚览堰、平江淮；李氏完成太阴资源转化链布局。', jump: '第1098章白乡谷斩广蝉 · 第1137章见阳环「明阳帝君将受其诛」', c: 'g' },
    { v: '十一', range: '1194–1313章', title: '古修棋局与突破大真人', tier: '魏国基业', gist: '陆江仙幕后收编古修入太阴棋局；李周巍抗蜀、奇袭洛下、突破明阳大真人。', jump: '第1255章李遂宁献五现秘法 · 第1305章李周巍成明阳大真人', c: 'g' },
    { v: '十二', range: '1314–1433章', title: '大陵川证道与灭蜀', tier: '灭西蜀 · 三线并行', gist: '萧初庭求金「失败」实被玄女藏匿；李周巍灭西蜀；陆江仙位格跃迁、布局大乌玄天净土。', jump: '第1380章碎片归位位格跃迁 · 第1407章罚杀蜀帝灭西蜀', c: 'g' },
    { v: '十三', range: '1434–1497章余', title: '九世复仇与真相收束', tier: '六王到位 · 证道破局', gist: '李周巍以九世血仇镇压参渌馥；揭元府/玄谙/青诣元心仪千年真相，接收洞华天，布局三阴三阳证道。', jump: '第1442章九世仇了结 · 第1455章青诣元心仪真相 · 第1496章三阴三阳破局', c: 'v' }
  ];

  var conflicts = [
    { num: '01', layer: '家族层', title: '法鉴 = 机缘亦是灭门之祸', color: GOLD, border: 'rgba(216,177,90,.3)', indent: '0',
      desc: '法鉴带来符种、太阴玄光、箓气，使凡人也能修仙、代代天赋不堕；但一旦暴露即招三宗七门觊觎、灭门之祸。这是全书最底层张力，决定了李家「纯血+符种+隐忍」的生存路线。' },
    { num: '02', layer: '世界结构层', title: '阶级剥削链 · 猪牛论', color: GRAY, border: 'rgba(201,162,75,.3)', indent: '0',
      desc: '三宗七门养世家如猪牛，世家养凡人如猪牛——层层剥削是世界底层逻辑。李家每一次升格，本质都是在这条剥削链上「从被收割者变为有资格收割者」的攀爬。' },
    { num: '03', layer: '个体宿命层', title: '命数 vs 自主 · 天命之子的悲剧', color: GREEN, border: 'rgba(155,191,134,.3)', indent: 'clamp(0px,2vw,24px)',
      desc: '从伽泥奚（百年蓄养的祭品）到李周巍（白麟「有命无性」被当作工具），全书反复叩问：命数加身者究竟是天选之子，还是被高层布局的耗材？陆江仙引入重生者作「变数」正是反抗。' },
    { num: '04', layer: '主角终极困局', title: '明阳证道的死亡悖论', color: GOLD, border: 'rgba(216,177,90,.3)', indent: 'clamp(0px,2vw,24px)',
      desc: '明阳果位古今唯认魏太祖一人。李周巍越接近证金丹，就越接近被落霞/阴司/龙属三方瞬间绞杀——「成则死、不成亦被逼成」的双重死局。破局之道是全书后半段的总悬念。' },
    { num: '05', layer: '最高博弈层', title: '太阴 vs 落霞 · 仙道大棋', color: VIO, border: 'rgba(184,167,217,.3)', indent: 'clamp(0px,4vw,48px)',
      desc: '最顶层是陆江仙（太阴/盈昃残识）与落霞山为代表的诸真君大势之争。收集仙鉴碎片、推演大衍天素书、暗养世间明阳之躯，意图放出李乾元真灵、自证道胎。' },
    { num: '06', layer: '复仇暗线', title: '李氏血仇的代际接力', color: FOE, border: 'rgba(216,117,90,.35)', indent: '0',
      desc: '从元家刺杀李长湖、青池炼死李尺泾，到南疆参渌馥两百年前将李氏先祖炼入丹炉——血仇跨越九世，由代理人逐一清偿。第1442章「恩仇善恶，我自报之」是最完整的情感闭环。' }
  ];

  var abilities = [
    { name: '太阴玄光', desc: '战力约等胎息巅峰全力一击，猝不及防可击杀练气初期；每十二日一次，击杀后需飨祭。' },
    { name: '玄珠符种', desc: '向李家分发法力/契约的核心机制：最多六枚（筑基后九枚），受种后法诀无法外泄，死后命数修为自动反哺。' },
    { name: '箓气系统', desc: '从凡人香火提炼箓气凝成箓丹——「以民养仙」运营模式，与宗门「以世家为牛羊」剥削链鲜明对照。' },
    { name: '探查不经太虚', desc: '仙鉴凭空出现，令依赖太虚的魂灯命玉失效——隐蔽性核心，也是避开真君算计的关键。' }
  ];

  var mirrorStages = [
    { n: '1', name: '碎裂期', chap: '第1卷 105章', desc: '镜面四分五裂，仅回收十分之一，其余散落成全书寻宝主线。' },
    { n: '2', name: '碎片回收期', chap: '第2–9卷', desc: '李尺泾符种使太阴月华升筑基；玉扣恢复遁游太虚；多枚碎片陆续归位。' },
    { n: '3', name: '鉴中天地期', chap: '第8卷 850章', desc: '开辟独立天宫洞天，日月同辉；箓气催化仙基，圆满时间从5–10年压至不到2年。' },
    { n: '4', name: '位格跃迁期', chap: '第12卷 1380章', desc: '镜面碎片归位，位格大跃迁，可感应三界内外所有金地；化虚为实建「大乌玄天」净土。' },
    { n: '5', name: '真相归一期', chap: '第13卷', desc: '接收洞华天控制权，揭开青诣元心仪/玄谙真相，领悟三阴三阳权柄。' }
  ];

  // ====================================================================
  // RENDER
  // ====================================================================
  function scrollToId(id) {
    var t = document.getElementById(id);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  }

  function renderNav() {
    var wrap = document.getElementById('navLinks');
    navItems.forEach(function (n) {
      var a = el('a', 'nav__link', esc(n.l));
      a.href = '#' + n.id;
      a.dataset.target = n.id;
      a.addEventListener('click', function (e) { e.preventDefault(); scrollToId(n.id); });
      wrap.appendChild(a);
    });
  }

  function renderStats() {
    var wrap = document.getElementById('heroStats');
    stats.forEach(function (s) {
      var d = el('div', 'stat');
      d.appendChild(el('span', 'stat__n', esc(s.n)));
      d.appendChild(el('span', 'stat__l', esc(s.l)));
      wrap.appendChild(d);
    });
  }

  function renderMasks() {
    var wrap = document.getElementById('masks');
    var truthCard = document.getElementById('truthCard');
    masks.forEach(function (m) {
      var c = colorFor(m.line);
      var row = el('div', 'mask');
      row.style.setProperty('--c', c);
      row.dataset.line = m.line;
      row.innerHTML =
        '<div class="mask__node"><span class="mask__tag">' + esc(m.tag) + '</span></div>' +
        '<div class="mask__body">' +
          '<span class="mask__name">' + esc(m.name) + '</span>' +
          '<span class="mask__role">' + esc(m.role) + '</span>' +
          '<span class="mask__chap">' + esc(m.chap) + '</span>' +
        '</div>';
      wrap.insertBefore(row, truthCard);
    });
  }

  function renderRealms() {
    var wrap = document.getElementById('realms');
    realms.forEach(function (r) {
      var bar = (28 + r.t * 8) + 'px';
      var glow = r.t >= 6 ? 'rgba(216,177,90,.85)' : 'rgba(111,214,192,.8)';
      var row = el('div', 'realm');
      row.innerHTML =
        '<div class="realm__bar-col"><div class="realm__bar" style="height:' + bar + ';max-width:' + bar + ';--glow:' + glow + ';"></div></div>' +
        '<div class="realm__body">' +
          '<span class="realm__name">' + esc(r.name) + '</span>' +
          '<span class="realm__alias">' + esc(r.alias) + '</span>' +
          '<span class="realm__trait">' + esc(r.trait) + '</span>' +
          '<span class="realm__chap">' + esc(r.chap) + '</span>' +
        '</div>';
      wrap.appendChild(row);
    });
  }

  function renderLineage() {
    var wrap = document.getElementById('lineage-list');
    generations.forEach(function (g) {
      var gen = el('div', 'gen');
      var people = g.people.map(function (p) {
        return '<div class="person"><div class="person__name">' + esc(p.name) + '</div>' +
               '<div class="person__note">' + esc(p.note) + '</div></div>';
      }).join('');
      gen.innerHTML =
        '<div class="gen__rail">' +
          '<div class="gen__badge" style="--c:' + g.color + ';">' +
            '<span class="gen__roman">' + esc(g.roman) + '</span>' +
            '<span class="gen__zi">' + esc(g.zi) + '</span>' +
          '</div>' +
          '<span class="gen__label">' + esc(g.label) + '</span>' +
        '</div>' +
        '<div class="gen__people">' + people + '</div>';
      wrap.appendChild(gen);
    });
  }

  function renderFactions() {
    var legendWrap = document.getElementById('relLegend');
    relLegend.forEach(function (l) {
      var item = el('div', 'rel-legend__item');
      item.innerHTML = '<span class="rel-legend__swatch" style="background:' + l.color + ';"></span>' +
        '<span>' + esc(l.label) + '</span>';
      legendWrap.appendChild(item);
    });

    var wrap = document.getElementById('factions-list');
    factionGroups.forEach(function (grp) {
      var g = el('div', 'faction-group');
      var cards = grp.items.map(function (f) {
        return '<div class="faction" style="--rc:' + f.relColor + ';--rb:' + f.relBorder + ';">' +
          '<div class="faction__head">' +
            '<span class="faction__name">' + esc(f.name) + '</span>' +
            '<span class="faction__rel">' + esc(f.rel) + '</span>' +
          '</div>' +
          '<div class="faction__note">' + esc(f.note) + '</div>' +
        '</div>';
      }).join('');
      g.innerHTML =
        '<div class="faction-group__head">' +
          '<span class="faction-group__name">' + esc(grp.group) + '</span>' +
          '<span class="faction-group__line"></span>' +
        '</div>' +
        '<div class="faction-group__grid">' + cards + '</div>';
      wrap.appendChild(g);
    });
  }

  function renderTimeline() {
    var wrap = document.getElementById('timeline-list');
    volumes.forEach(function (v) {
      var c = VC(v.c);
      var row = el('div', 'vol');
      row.innerHTML =
        '<div class="vol__rail"><div class="vol__badge" style="--c:' + c + ';">' +
          '<span class="vol__num">' + esc(v.v) + '</span></div></div>' +
        '<div class="vol__body">' +
          '<div class="vol__head">' +
            '<span class="vol__title">' + esc(v.title) + '</span>' +
            '<span class="vol__range">' + esc(v.range) + '</span>' +
            '<span class="vol__tier">' + esc(v.tier) + '</span>' +
          '</div>' +
          '<p class="vol__gist">' + esc(v.gist) + '</p>' +
          '<div class="vol__jump"><span class="c-jade">关键转折 ⟶ </span>' + esc(v.jump) + '</div>' +
        '</div>';
      wrap.appendChild(row);
    });
  }

  function renderConflicts() {
    var wrap = document.getElementById('conflicts-list');
    conflicts.forEach(function (c) {
      var row = el('div', 'conflict');
      row.style.setProperty('--indent', c.indent);
      row.innerHTML =
        '<span class="conflict__num" style="--c:' + c.color + ';">' + esc(c.num) + '</span>' +
        '<div class="conflict__body">' +
          '<div class="conflict__head">' +
            '<span class="conflict__title">' + esc(c.title) + '</span>' +
            '<span class="conflict__layer" style="--c:' + c.color + ';--border:' + c.border + ';">' + esc(c.layer) + '</span>' +
          '</div>' +
          '<p class="conflict__desc">' + esc(c.desc) + '</p>' +
        '</div>';
      wrap.appendChild(row);
    });
  }

  function renderMirror() {
    var aWrap = document.getElementById('abilities-list');
    abilities.forEach(function (a) {
      var d = el('div', 'ability');
      d.innerHTML = '<div class="ability__name">' + esc(a.name) + '</div>' +
        '<p class="ability__desc">' + esc(a.desc) + '</p>';
      aWrap.appendChild(d);
    });

    var sWrap = document.getElementById('stages-list');
    mirrorStages.forEach(function (s) {
      var d = el('div', 'stage');
      d.innerHTML =
        '<div class="stage__top"><span class="stage__n">' + esc(s.n) + '</span>' +
          '<span class="stage__connector"></span></div>' +
        '<div class="stage__name">' + esc(s.name) + '</div>' +
        '<div class="stage__chap">' + esc(s.chap) + '</div>' +
        '<p class="stage__desc">' + esc(s.desc) + '</p>';
      sWrap.appendChild(d);
    });
  }

  // ====================================================================
  // BEHAVIORS
  // ====================================================================
  function initScrollSpy() {
    var ids = ['top', 'identity', 'realm', 'lineage', 'factions', 'timeline', 'conflict', 'mirror'];
    var links = document.querySelectorAll('.nav__link');
    function setActive(id) {
      links.forEach(function (a) { a.classList.toggle('is-active', a.dataset.target === id); });
    }
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(function (id) { var elx = document.getElementById(id); if (elx) obs.observe(elx); });
  }

  function initSpoilerGuard() {
    var card = document.getElementById('truthCard');
    var guard = document.getElementById('truthGuard');
    if (!card || !guard) return;
    card.classList.add('is-guarded');          // spoiler guard ON by default
    guard.addEventListener('click', function () { card.classList.remove('is-guarded'); });
  }

  function initAccentToggle() {
    var masksWrap = document.getElementById('masks');
    var btns = document.querySelectorAll('[data-accent-btn]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.dataset.accentBtn;
        btns.forEach(function (x) { x.classList.toggle('is-active', x === b); });
        if (v === 'both') masksWrap.removeAttribute('data-accent');
        else masksWrap.setAttribute('data-accent', v);
      });
    });
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    var targets = document.querySelectorAll('.reveal');
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); o.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { obs.observe(t); });
  }

  function initGoTop() {
    var brand = document.querySelector('[data-gotop]');
    if (brand) brand.addEventListener('click', function (e) {
      e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ====================================================================
  // BOOT
  // ====================================================================
  function boot() {
    renderNav();
    renderStats();
    renderMasks();
    renderRealms();
    renderLineage();
    renderFactions();
    renderTimeline();
    renderConflicts();
    renderMirror();

    initGoTop();
    initScrollSpy();
    initSpoilerGuard();
    initAccentToggle();
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

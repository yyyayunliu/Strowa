const CONFIG = window.APP_CONFIG || {};
const SHARED_MODE = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
const STORAGE_PREFIX = "strowa-v1";
const POLL_INTERVAL_MS = SHARED_MODE ? 12000 : 5000;

const PLACES = [
  { id: "museumpark", name: "Museumpark", lat: 51.9146, lng: 4.4712 },
  { id: "het-park", name: "Het Park", lat: 51.9087, lng: 4.4681 },
  { id: "vroesenpark", name: "Vroesenpark", lat: 51.9378, lng: 4.4597 },
  { id: "kralingse-bos", name: "Kralingse Bos", lat: 51.9325, lng: 4.5280 },
  { id: "dakpark", name: "Dakpark Rotterdam", lat: 51.9169, lng: 4.4318 },
  { id: "wijkpark", name: "Wijkpark Oude Westen", lat: 51.9194, lng: 4.4653 },
  { id: "bibliotheek", name: "Bibliotheek Rotterdam", lat: 51.9200, lng: 4.4880 },
  { id: "custom", name: "Custom public place", lat: null, lng: null }
];

const DEMO_CHECKINS = [
  {
    id: "demo-1", place_id: "museumpark", place_name: "Museumpark", lat: 51.9146, lng: 4.4712,
    parent_label: "Mila's mum", child_age: "6-12m", intent: "walk", note: "Near the pond with a yellow stroller",
    created_at: new Date(Date.now() - 8 * 60000).toISOString(), expires_at: new Date(Date.now() + 42 * 60000).toISOString(), demo: true
  },
  {
    id: "demo-2", place_id: "het-park", place_name: "Het Park", lat: 51.9087, lng: 4.4681,
    parent_label: "一位爸爸", child_age: "1-2y", intent: "play", note: "在大草坪附近",
    created_at: new Date(Date.now() - 16 * 60000).toISOString(), expires_at: new Date(Date.now() + 54 * 60000).toISOString(), demo: true
  },
  {
    id: "demo-3", place_id: "vroesenpark", place_name: "Vroesenpark", lat: 51.9378, lng: 4.4597,
    parent_label: "Noah + papa", child_age: "2-4y", intent: "chat", note: "English / Nederlands",
    created_at: new Date(Date.now() - 27 * 60000).toISOString(), expires_at: new Date(Date.now() + 23 * 60000).toISOString(), demo: true
  }
];

const I18N = {
  zh: {
    brand: "Strowa", privacyBanner: "只显示公共地点和临时状态，不上传你的实时轨迹。", nearbyNow: "附近现在", familiesOut: "个家庭在外面",
    refresh: "刷新", demoNotice: "这些是演示家庭。配置共享后端后，朋友的真实签到会显示在这里。", hellosReceived: "收到的招呼", clear: "清除",
    emptyTitle: "附近暂时没人签到", emptyBody: "你可以先出现。朋友打开同一个网页后，就会看到你所在的公共地点。", checkIn: "我也在遛娃",
    temporaryCheckin: "临时签到", whereAreYou: "你们在哪里溜娃？", publicPlace: "公共地点", pickOnMap: "在地图上选点", publicOnly: "请选择公园、游乐场或公共空间",
    alias: "临时称呼", aliasPlaceholder: "例如：幽遒爸爸", childAge: "宝宝年龄段", duration: "显示多久", whatNow: "现在想做什么？",
    walk: "一起散步", play: "一起玩", chat: "聊聊天", quiet: "安静走走", noteOptional: "一句话（可选）", notePlaceholder: "例如：我们在喷泉旁边，推着绿色婴儿车",
    safetyNote: "请勿填写孩子姓名、电话号码、住址或精确行程。只在公共场所见面。", publishCheckin: "发布临时签到", sayHello: "匿名打招呼",
    yourAlias: "你的临时称呼", message: "消息", sendHello: "发送招呼", setupTitle: "当前是单机演示", setupBody: "单机模式适合预览界面，但不同手机无法互相看到。按照 README 配置 Supabase 后，会自动切换到共享测试模式。", understood: "知道了",
    sharedMode: "共享测试", demoMode: "演示模式", remove: "结束签到", hello: "打招呼", own: "你的签到", left: "后消失", near: "附近", mapPickMode: "请点击地图上的公共地点",
    mapPicked: "已选择地图位置", checkedIn: "签到已发布", removed: "签到已结束", helloSent: "招呼已发送", locateDenied: "无法获取位置；你仍可手动浏览地图。",
    setupNeeded: "当前为单机模式。点击右上角状态可查看说明。", loadFailed: "暂时无法加载，请稍后重试。", noPersonal: "不要填写个人联系方式。", customPlace: "地图上的公共地点",
    age: "宝宝", minute: "分钟", justNow: "刚刚", minsAgo: "分钟前", family: "家庭"
  },
  en: {
    brand: "Strowa", privacyBanner: "Only public places and temporary status are shared. Your live route is never uploaded.", nearbyNow: "Nearby now", familiesOut: "families are out",
    refresh: "Refresh", demoNotice: "These are demo families. After connecting the shared backend, your friends' check-ins will appear here.", hellosReceived: "Hellos received", clear: "Clear",
    emptyTitle: "Nobody has checked in nearby", emptyBody: "You can appear first. Friends opening the same page will see your public meeting place.", checkIn: "We're out too",
    temporaryCheckin: "Temporary check-in", whereAreYou: "Where are you strolling?", publicPlace: "Public place", pickOnMap: "Pick on map", publicOnly: "Choose a park, playground or public space",
    alias: "Temporary alias", aliasPlaceholder: "For example: Youqiu's dad", childAge: "Child's age range", duration: "Visible for", whatNow: "What would you like to do?",
    walk: "Walk together", play: "Play together", chat: "Have a chat", quiet: "Quiet stroll", noteOptional: "One line (optional)", notePlaceholder: "For example: by the fountain with a green stroller",
    safetyNote: "Do not share a child's name, phone number, home address or precise itinerary. Meet only in public places.", publishCheckin: "Publish temporary check-in", sayHello: "Anonymous hello",
    yourAlias: "Your temporary alias", message: "Message", sendHello: "Send hello", setupTitle: "Local demo mode", setupBody: "Local mode previews the interface, but separate phones cannot see each other. Follow the README to connect Supabase and enable shared testing.", understood: "Got it",
    sharedMode: "Shared test", demoMode: "Demo mode", remove: "End check-in", hello: "Say hello", own: "Your check-in", left: "left", near: "nearby", mapPickMode: "Tap a public place on the map",
    mapPicked: "Map location selected", checkedIn: "Check-in published", removed: "Check-in ended", helloSent: "Hello sent", locateDenied: "Location unavailable; you can still browse the map manually.",
    setupNeeded: "This is local mode. Tap the top-right status for setup info.", loadFailed: "Unable to load right now. Try again shortly.", noPersonal: "Do not include personal contact details.", customPlace: "Public place on map",
    age: "child", minute: "min", justNow: "just now", minsAgo: "min ago", family: "family"
  }
};

let language = localStorage.getItem(`${STORAGE_PREFIX}:language`) || (navigator.language.startsWith("zh") ? "zh" : "en");
let supabase = null;
let checkins = [];
let waves = [];
let selectedCustomPlace = null;
let mapPickMode = false;
let userLocation = null;
let markersLayer;
let toastTimer;

const ownerToken = getOrCreateOwnerToken();
const map = L.map("map", { zoomControl: false, attributionControl: true }).setView([51.9225, 4.4792], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
markersLayer = L.layerGroup().addTo(map);

const els = Object.fromEntries([
  "modeButton", "modeLabel", "languageButton", "privacyBanner", "dismissPrivacy", "activeCount", "refreshButton", "demoNotice", "inbox", "waveList", "clearWavesButton",
  "checkinList", "emptyState", "openCheckinButton", "checkinDialog", "checkinForm", "placeSelect", "pickOnMapButton", "pickedLocationLabel", "aliasInput", "ageSelect", "durationSelect", "noteInput",
  "submitCheckinButton", "waveDialog", "waveForm", "waveTargetId", "waveTargetTitle", "waveAliasInput", "waveMessageSelect", "setupDialog", "locateButton", "toast"
].map(id => [id, document.getElementById(id)]));

init().catch((error) => {
  console.error(error);
  showToast(t("loadFailed"));
});

async function init() {
  renderLanguage();
  populatePlaces();
  bindEvents();
  renderPlaceMarkers();
  els.modeButton.classList.toggle("shared", SHARED_MODE);
  els.modeLabel.textContent = SHARED_MODE ? t("sharedMode") : t("demoMode");
  els.demoNotice.classList.toggle("hidden", SHARED_MODE);

  if (SHARED_MODE) {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
  }

  const savedAlias = localStorage.getItem(`${STORAGE_PREFIX}:alias`);
  if (savedAlias) {
    els.aliasInput.value = savedAlias;
    els.waveAliasInput.value = savedAlias;
  }

  await refreshData();
  setInterval(refreshData, POLL_INTERVAL_MS);

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").catch(console.warn);
  }
}

function bindEvents() {
  els.languageButton.addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    localStorage.setItem(`${STORAGE_PREFIX}:language`, language);
    renderLanguage();
    populatePlaces();
    renderAll();
  });

  els.dismissPrivacy.addEventListener("click", () => els.privacyBanner.classList.add("hidden"));
  els.modeButton.addEventListener("click", () => {
    if (!SHARED_MODE) els.setupDialog.showModal();
    else showToast(t("sharedMode"));
  });
  els.refreshButton.addEventListener("click", refreshData);
  els.openCheckinButton.addEventListener("click", () => els.checkinDialog.showModal());
  els.locateButton.addEventListener("click", locateUser);
  els.clearWavesButton.addEventListener("click", clearWaves);

  els.pickOnMapButton.addEventListener("click", () => {
    mapPickMode = true;
    els.checkinDialog.close();
    showToast(t("mapPickMode"));
    map.getContainer().classList.add("map-picking");
  });

  map.on("click", (event) => {
    if (!mapPickMode) return;
    mapPickMode = false;
    map.getContainer().classList.remove("map-picking");
    selectedCustomPlace = {
      id: `custom-${roundCoord(event.latlng.lat)}-${roundCoord(event.latlng.lng)}`,
      name: t("customPlace"),
      lat: roundCoord(event.latlng.lat),
      lng: roundCoord(event.latlng.lng)
    };
    els.placeSelect.value = "custom";
    els.pickedLocationLabel.textContent = `${t("mapPicked")}: ${selectedCustomPlace.lat.toFixed(3)}, ${selectedCustomPlace.lng.toFixed(3)}`;
    els.checkinDialog.showModal();
  });

  els.checkinForm.addEventListener("submit", async (event) => {
    const submitter = event.submitter;
    if (submitter?.value === "cancel") return;
    event.preventDefault();
    await submitCheckin();
  });

  els.waveForm.addEventListener("submit", async (event) => {
    const submitter = event.submitter;
    if (submitter?.value === "cancel") return;
    event.preventDefault();
    await submitWave();
  });
}

function renderLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  els.languageButton.textContent = language === "zh" ? "EN" : "中";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (I18N[language][key]) node.textContent = I18N[language][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (I18N[language][key]) node.placeholder = I18N[language][key];
  });
  els.modeLabel.textContent = SHARED_MODE ? t("sharedMode") : t("demoMode");
}

function t(key) { return I18N[language][key] || key; }

function populatePlaces() {
  const current = els.placeSelect.value;
  els.placeSelect.innerHTML = PLACES.map(place => `<option value="${escapeHtml(place.id)}">${escapeHtml(place.id === "custom" ? (language === "zh" ? "地图选点" : "Pick on map") : place.name)}</option>`).join("");
  if (current) els.placeSelect.value = current;
}

async function refreshData() {
  try {
    if (SHARED_MODE) {
      const [{ data: active, error: activeError }, { data: inboxData, error: inboxError }] = await Promise.all([
        supabase.rpc("get_active_checkins", { p_owner_token: ownerToken }),
        supabase.rpc("get_my_waves", { p_owner_token: ownerToken })
      ]);
      if (activeError) throw activeError;
      if (inboxError) throw inboxError;
      checkins = (active || []).map(row => ({ ...row, own: Boolean(row.is_own) }));
      waves = inboxData || [];
    } else {
      const saved = readLocalCheckins();
      checkins = [...DEMO_CHECKINS.filter(item => new Date(item.expires_at) > new Date()), ...saved];
      waves = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}:waves`) || "[]");
    }
    renderAll();
  } catch (error) {
    console.error("Refresh failed", error);
    showToast(t("loadFailed"));
  }
}

function renderAll() {
  renderCheckins();
  renderMapCheckins();
  renderWaves();
}

function renderCheckins() {
  const sorted = [...checkins].sort((a, b) => {
    if (a.own && !b.own) return -1;
    if (!a.own && b.own) return 1;
    const da = distanceTo(a);
    const db = distanceTo(b);
    return da - db;
  });
  els.activeCount.textContent = sorted.filter(item => !item.demo).length || (SHARED_MODE ? 0 : sorted.length);
  els.emptyState.classList.toggle("hidden", sorted.length > 0);
  els.checkinList.innerHTML = sorted.map(checkinCardHtml).join("");

  els.checkinList.querySelectorAll("[data-wave-id]").forEach(button => {
    button.addEventListener("click", () => openWave(button.dataset.waveId));
  });
  els.checkinList.querySelectorAll("[data-remove-id]").forEach(button => {
    button.addEventListener("click", () => removeCheckin(button.dataset.removeId));
  });
  els.checkinList.querySelectorAll("[data-focus-id]").forEach(button => {
    button.addEventListener("click", () => focusCheckin(button.dataset.focusId));
  });
}

function checkinCardHtml(item) {
  const intent = intentMeta(item.intent);
  const own = Boolean(item.own || (!SHARED_MODE && item.owner_token === ownerToken));
  const minutesLeft = Math.max(1, Math.ceil((new Date(item.expires_at) - Date.now()) / 60000));
  const distance = distanceTo(item);
  const distanceText = Number.isFinite(distance) ? formatDistance(distance) : "";
  return `
    <article class="checkin-card ${own ? "own" : ""}" data-focus-id="${escapeHtml(item.id)}">
      <div class="avatar-bubble">${intent.emoji}</div>
      <div>
        <div class="card-title">
          <strong>${escapeHtml(item.parent_label)}</strong>
          <span class="badge">${escapeHtml(ageLabel(item.child_age))}</span>
          ${own ? `<span class="badge">${t("own")}</span>` : ""}
          ${item.demo ? `<span class="badge">DEMO</span>` : ""}
        </div>
        <p class="card-meta">${escapeHtml(item.place_name)} · ${escapeHtml(intent.label)} · ${minutesLeft} ${t("minute")} ${t("left")}</p>
        ${item.note ? `<p class="card-note">${escapeHtml(item.note)}</p>` : ""}
      </div>
      <div class="card-action">
        ${own ? `<button class="remove-button" type="button" data-remove-id="${escapeHtml(item.id)}">${t("remove")}</button>` : `<button class="wave-button" type="button" data-wave-id="${escapeHtml(item.id)}" ${item.demo ? "disabled" : ""}>👋 ${t("hello")}</button>`}
        ${distanceText ? `<span class="distance">${distanceText}</span>` : ""}
      </div>
    </article>`;
}

function renderMapCheckins() {
  markersLayer.clearLayers();
  renderPlaceMarkers();
  const grouped = new Map();
  checkins.forEach(item => {
    const key = `${roundCoord(item.lat)}:${roundCoord(item.lng)}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  });
  grouped.forEach(items => {
    const first = items[0];
    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div class="marker-pin"><span>${intentMeta(first.intent).emoji}</span>${items.length > 1 ? `<b class="marker-cluster-label">${items.length}</b>` : ""}</div>`,
      iconSize: [42,42], iconAnchor: [18,38]
    });
    const popup = items.map(item => `<strong>${escapeHtml(item.parent_label)}</strong><br>${escapeHtml(item.place_name)} · ${escapeHtml(intentMeta(item.intent).label)}`).join("<hr>");
    L.marker([first.lat, first.lng], { icon }).bindPopup(popup).addTo(markersLayer);
  });
}

function renderPlaceMarkers() {
  PLACES.filter(place => place.lat && place.lng).forEach(place => {
    const icon = L.divIcon({ className: "custom-marker", html: `<div class="marker-pin place"><span>•</span></div>`, iconSize: [30,30], iconAnchor: [12,26] });
    L.marker([place.lat, place.lng], { icon, interactive: true }).bindTooltip(place.name, { direction: "top" }).addTo(markersLayer);
  });
}

function renderWaves() {
  els.inbox.classList.toggle("hidden", waves.length === 0);
  els.waveList.innerHTML = waves.map(wave => `
    <div class="wave-item">
      <strong>👋 ${escapeHtml(wave.sender_alias)}</strong>
      <p>${escapeHtml(wave.message)}</p>
    </div>`).join("");
}

async function submitCheckin() {
  const placeId = els.placeSelect.value;
  const preset = PLACES.find(place => place.id === placeId);
  const place = placeId === "custom" ? selectedCustomPlace : preset;
  if (!place || place.lat == null || place.lng == null) {
    showToast(t("publicOnly"));
    return;
  }
  const alias = (els.aliasInput.value || (language === "zh" ? "一位家长" : "A parent")).trim().slice(0,30);
  const payload = {
    place_id: place.id,
    place_name: place.name,
    lat: roundCoord(place.lat),
    lng: roundCoord(place.lng),
    parent_label: alias,
    child_age: els.ageSelect.value,
    intent: document.querySelector('input[name="intent"]:checked').value,
    note: els.noteInput.value.trim().slice(0,120),
    expires_minutes: Number(els.durationSelect.value)
  };
  localStorage.setItem(`${STORAGE_PREFIX}:alias`, alias);
  els.waveAliasInput.value = alias;
  els.submitCheckinButton.disabled = true;
  try {
    if (SHARED_MODE) {
      const { error } = await supabase.rpc("create_checkin", {
        p_owner_token: ownerToken,
        p_place_id: payload.place_id,
        p_place_name: payload.place_name,
        p_lat: payload.lat,
        p_lng: payload.lng,
        p_parent_label: payload.parent_label,
        p_child_age: payload.child_age,
        p_intent: payload.intent,
        p_note: payload.note,
        p_expires_minutes: payload.expires_minutes
      });
      if (error) throw error;
    } else {
      const rows = readLocalCheckins().filter(row => row.owner_token !== ownerToken);
      rows.push({
        id: crypto.randomUUID(), ...payload, owner_token: ownerToken, own: true,
        created_at: new Date().toISOString(), expires_at: new Date(Date.now() + payload.expires_minutes * 60000).toISOString()
      });
      localStorage.setItem(`${STORAGE_PREFIX}:checkins`, JSON.stringify(rows));
    }
    els.checkinDialog.close();
    showToast(t("checkedIn"));
    await refreshData();
    map.setView([payload.lat, payload.lng], 15, { animate: true });
  } catch (error) {
    console.error(error);
    showToast(t("loadFailed"));
  } finally {
    els.submitCheckinButton.disabled = false;
  }
}

async function removeCheckin(id) {
  try {
    if (SHARED_MODE) {
      const { error } = await supabase.rpc("remove_checkin", { p_checkin_id: id, p_owner_token: ownerToken });
      if (error) throw error;
    } else {
      const rows = readLocalCheckins().filter(row => row.id !== id);
      localStorage.setItem(`${STORAGE_PREFIX}:checkins`, JSON.stringify(rows));
    }
    showToast(t("removed"));
    await refreshData();
  } catch (error) {
    console.error(error);
    showToast(t("loadFailed"));
  }
}

function openWave(id) {
  const target = checkins.find(item => item.id === id);
  if (!target || target.demo) return;
  els.waveTargetId.value = id;
  els.waveTargetTitle.textContent = `👋 ${target.parent_label}`;
  els.waveDialog.showModal();
}

async function submitWave() {
  const targetId = els.waveTargetId.value;
  const senderAlias = els.waveAliasInput.value.trim().slice(0,30);
  const message = els.waveMessageSelect.value.slice(0,120);
  if (!senderAlias) return;
  localStorage.setItem(`${STORAGE_PREFIX}:alias`, senderAlias);
  els.aliasInput.value = senderAlias;
  try {
    if (SHARED_MODE) {
      const { error } = await supabase.rpc("send_wave", {
        p_target_checkin: targetId,
        p_sender_alias: senderAlias,
        p_message: message
      });
      if (error) throw error;
    } else {
      const localWaves = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}:waves`) || "[]");
      localWaves.unshift({ id: crypto.randomUUID(), sender_alias: senderAlias, message, created_at: new Date().toISOString() });
      localStorage.setItem(`${STORAGE_PREFIX}:waves`, JSON.stringify(localWaves.slice(0,20)));
    }
    els.waveDialog.close();
    showToast(t("helloSent"));
  } catch (error) {
    console.error(error);
    showToast(t("loadFailed"));
  }
}

async function clearWaves() {
  try {
    if (SHARED_MODE) {
      const { error } = await supabase.rpc("clear_my_waves", { p_owner_token: ownerToken });
      if (error) throw error;
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}:waves`);
    }
    waves = [];
    renderWaves();
  } catch (error) {
    console.error(error);
    showToast(t("loadFailed"));
  }
}

function readLocalCheckins() {
  const rows = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}:checkins`) || "[]");
  const active = rows.filter(row => new Date(row.expires_at) > new Date());
  if (active.length !== rows.length) localStorage.setItem(`${STORAGE_PREFIX}:checkins`, JSON.stringify(active));
  return active.map(row => ({ ...row, own: row.owner_token === ownerToken }));
}

function locateUser() {
  if (!navigator.geolocation) return showToast(t("locateDenied"));
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      userLocation = { lat: coords.latitude, lng: coords.longitude };
      map.setView([coords.latitude, coords.longitude], 15, { animate: true });
      L.circleMarker([coords.latitude, coords.longitude], { radius: 7, color: "#173f31", fillColor: "#ecff69", fillOpacity: 1, weight: 3 }).addTo(markersLayer);
      renderCheckins();
    },
    () => showToast(t("locateDenied")),
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
  );
}

function focusCheckin(id) {
  const item = checkins.find(row => row.id === id);
  if (item) map.setView([item.lat, item.lng], 15, { animate: true });
}

function distanceTo(item) {
  if (!userLocation) return Number.POSITIVE_INFINITY;
  return haversine(userLocation.lat, userLocation.lng, item.lat, item.lng);
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function roundCoord(value) { return Math.round(Number(value) * 1000) / 1000; }

function intentMeta(intent) {
  const labels = {
    walk: { emoji: "🚶", label: t("walk") },
    play: { emoji: "🛝", label: t("play") },
    chat: { emoji: "☕", label: t("chat") },
    quiet: { emoji: "😴", label: t("quiet") }
  };
  return labels[intent] || labels.walk;
}

function ageLabel(value) {
  const map = { "0-6m": "0–6m", "6-12m": "6–12m", "1-2y": "1–2y", "2-4y": "2–4y", "4y+": "4y+" };
  return map[value] || value;
}

function getOrCreateOwnerToken() {
  const key = `${STORAGE_PREFIX}:owner-token`;
  let token = localStorage.getItem(key);
  if (!token) {
    token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    localStorage.setItem(key, token);
  }
  return token;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

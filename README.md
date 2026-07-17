# Strowa Prototype V1

**Strowa — Meet nearby families.**

这是一个手机优先、无需注册的亲子临时签到原型。默认是演示模式，可以立即体验地图、临时签到、附近家庭、匿名打招呼和中英文切换。

## 立即预览

不要直接双击 `index.html`，地图和模块脚本可能被浏览器拦截。

在本文件夹打开 PowerShell，运行：

```powershell
python -m http.server 8080
```

然后打开：

```text
http://localhost:8080
```

## 手机上预览

电脑和手机连接同一 Wi-Fi。在 PowerShell 运行 `ipconfig`，找到电脑的 IPv4 地址，例如 `192.168.1.20`，手机打开：

```text
http://192.168.1.20:8080
```

Windows 防火墙第一次询问时允许“专用网络”。

## 多部手机共享真实签到

默认演示模式的数据只保存在当前浏览器。要让朋友在不同手机上看到彼此：

1. 创建免费 Supabase 项目。
2. 在 SQL Editor 运行 `supabase.sql`。
3. 打开 `config.js`，填入项目 URL 与 publishable/anon key。
4. 将整个文件夹发布到 GitHub Pages、Netlify 或 Vercel。

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_PUBLISHABLE_OR_ANON_KEY"
};
```

不要使用 `service_role` key。

## 已有功能

- 无需账号、邮箱或手机号
- 鹿特丹公共地点地图
- 30 / 60 / 90 分钟临时签到
- 宝宝年龄段与活动意图
- 自定义公共地点选点，并降低坐标精度
- 附近家庭卡片
- 匿名 Say Hi
- 自己结束签到
- 自动过滤过期签到
- 中文 / English
- PWA manifest 与离线外壳
- 演示模式 / Supabase 共享模式

## 测试建议

先邀请 5–10 位认识的家长，在同一时段、同一个公园测试。观察：是否愿意签到、是否敢点击 Say Hi、有没有真的在线下打招呼。

> **关于本 README**：本仓库的 README 由咕咕（[gugu123a](https://github.com/gugu123a)）授权 Claude 代笔整理。

# Claude Fake - Mobile

一个披着 Claude 皮的 DeepSeek 聊天 App，Expo / React Native 构建，直接安装到 Android 手机。

## 快速开始

### 开发

```bash
# 安装依赖
npm install

# 启动 Expo 开发服务器
npx expo start
```

用手机上的 **Expo Go** App 扫码即可在手机上预览。

### 构建 APK

方式一：**EAS Cloud Build**（推荐，无需 Android Studio）

```bash
# 1. 安装 eas-cli（如果没装）
npm install -g eas-cli

# 2. 登录 Expo 账号（免费注册：https://expo.dev/signup）
npx eas login

# 3. 构建 APK
npx eas build --platform android --profile preview
```

构建完成后会返回一个下载链接，下载 `.apk` 文件传到手机安装即可。

方式二：**本地构建**（需要 Android Studio + SDK）

```bash
npx expo run:android
```

## 配置

API Key 在 `app.json` 的 `expo.extra.deepseekApiKey` 中配置。

如需更换模型，修改 `src/services/deepseek.ts` 中的 `model` 字段：
- `deepseek-v4-flash`：快速便宜（默认，推荐）
- `deepseek-v4-pro`：更强推理能力

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Expo SDK 56 + React Native 0.85 |
| 字体 | Anthropic Sans / Serif / Mono |
| 图标 | `@lobehub/icons-rn` (Claude, DeepSeek) |
| 设计 | Claude 官方设计系统（暖色调、珊瑚色强调） |
| API | DeepSeek v4-flash（流式 SSE） |

## 项目结构

```
src/
├── constants/theme.ts    # 颜色、字体、间距
├── types/chat.ts         # TypeScript 类型
├── services/deepseek.ts  # DeepSeek API 流式调用
├── components/
│   ├── ChatMessage.tsx       # 消息气泡
│   ├── ChatInput.tsx         # 输入栏
│   ├── EmptyState.tsx        # 空白欢迎页
│   └── ThinkingIndicator.tsx # 思考动画
App.tsx                 # 主入口
app.json                # Expo 配置
eas.json                # EAS Build 配置
```

## 网络说明

手机直接 HTTPS 调用 `api.deepseek.com`，国内三大运营商全部直连，无需任何代理/VPN。

## 免责声明

本项目仅借鉴了 Anthropic / Claude 的视觉风格，与官方无关联。模型由 DeepSeek 提供。

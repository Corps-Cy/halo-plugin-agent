# Halo 插件入门 (Hello World)

## 1. 初始化项目 (Initialization)
Halo 官方提供了基于 Node.js 的脚手架工具，用于快速生成标准的插件项目结构。

### 创建命令
在终端执行以下命令：
```bash
pnpm create halo-plugin
```

### 交互配置说明
执行命令后，你需要回答以下问题：
1.  **Plugin name**: 插件名称 (例如 `hello-world`)，将作为项目文件夹名。
2.  **Group**: Maven Group ID / 包名 (例如 `run.halo.plugin.demo`)。
3.  **Version**: 初始版本号 (默认 `1.0.0-SNAPSHOT`)。
4.  **Author name**: 作者名称。
5.  **Repository URL**: Git 仓库地址 (可选)。
6.  **UI Build Tool**: 选择前端构建工具，推荐 **Rsbuild** (速度更快) 或 Vite。

## 2. 项目结构深度解析 (Structure Analysis)
生成的项目遵循标准的 Gradle + pnpm 混合结构：

```text
hello-world/
├── build.gradle             # [后端] Gradle 构建脚本，定义依赖和插件任务
├── settings.gradle          # [后端] Gradle 项目设置
├── src/
│   └── main/
│       ├── java/            # [后端] Java 源码目录
│       │   └── .../StarterPlugin.java  # 插件入口类 (继承 BasePlugin)
│       └── resources/
│           └── plugin.yaml  # [核心] 插件描述文件 (定义名称、版本、扩展点等)
├── ui/                      # [前端] 独立的前端工程目录
│   ├── package.json         # [前端] 依赖管理
│   ├── pnpm-workspace.yaml  # [前端] Monorepo 工作区定义
│   ├── src/                 # [前端] Vue/TS 源码
│   │   ├── index.ts         # 前端入口文件
│   │   └── plugin-env.d.ts  # 类型定义
│   └── rsbuild.config.ts    # 构建配置 (如果选择了 Rsbuild)
└── ...
```

### 关键文件说明
*   **`src/main/resources/plugin.yaml`**: 插件的“身份证”。Halo 加载插件时首先读取此文件，定义了插件的元数据、所需的 Halo 版本、以及注册的扩展点。
*   **`ui/` 目录**: 这是一个完整的前端项目。在构建插件时，Gradle 会自动调用 pnpm 命令构建此目录下的代码，并将生成的静态资源打包进最终的 JAR 文件中。

## 3. 运行与调试 (Run & Debug)

### 方式 A: 使用 Halo Gradle Plugin (推荐 - Docker 环境)
这是最快看到效果的方法，无需配置本地数据库或下载 Halo 源码。
*   **原理**: Gradle 会拉取官方 Halo Docker 镜像，挂载你的插件 JAR 包并启动。
*   **命令**:
    ```bash
    # macOS / Linux
    ./gradlew haloServer
    
    # Windows
    gradlew.bat haloServer
    ```
*   **调试**: 默认开启远程调试端口 (通常是 5005)，可以在 IDE 中配置 "Remote JVM Debug" 连接此端口进行断点调试。

### 方式 B: 链接到本地 Halo 源码 (传统方式)
适用于需要修改 Halo 核心源码配合调试的场景 (参考 `02_run.md`)。
1.  **构建插件**: 在插件目录执行 `./gradlew build`。
2.  **配置 Halo**: 在 Halo 源码项目的 `application-local.yaml` 中添加:
    ```yaml
    halo:
      plugin:
        runtime-mode: development
        fixed-plugin-path:
          - /你的插件绝对路径/hello-world
    ```
3.  **启动 Halo**: 在 Halo 源码目录运行 `./gradlew bootRun ...`。

## 4. 验证安装
启动成功后，访问 Halo 控制台 (默认 `http://localhost:8090/console`)，进入“插件”页面，你应该能看到名为 `hello-world` 的插件状态为“已启用”。
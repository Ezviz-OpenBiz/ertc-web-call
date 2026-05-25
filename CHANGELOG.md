
## 1.0.1 - 2026-05-25
### Fix
- 把 `ertc-web` 依赖从 `^2.1.2` 改为 `workspace:^2.1.3-alpha.21`，避免下游解析到 `ertc-web@2.1.2`。`ertc-web@2.1.2` 的 `package.json` 声明了 `exports` 字段但缺失 `"."` 根入口，导致下游 vite/rollup/webpack 5 报 `Missing "." specifier in "ertc-web" package`、安装后无法 build/dev。

## 1.0.0 - 2024-03-08
### Feat
- 从原有ERTC中进行拆分，单独成一个npm包发布
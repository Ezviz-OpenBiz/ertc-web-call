# ertc-web-call

基于 `ertc-web` 的视频通话 SDK，封装了呼叫、接听、挂断等完整通话流程，支持纯逻辑和带 UI 两种使用方式。

## 安装

```bash
npm install ertc-web-call
```

## 使用方式

### 1. 纯逻辑（自己写 UI）

```typescript
import ERTCCALL, { IStatus } from 'ertc-web-call';

const call = new ERTCCALL({
  domain: 'https://open.ys7.com',
  accessToken: '...',
  deviceSerial: '...',
  resourceToken: '...',
  deviceResourceToken: '...',
  appId: '...',
  strRoomId: '...',
  account: '...',
});

// 监听状态变化
call.on(ERTCCALL.EVENT.STATUS_CHANGE, (status) => {
  console.log('通话状态:', status); // 'init' | 'calling' | 'talking'
});

// 监听远端流
call.on(ERTCCALL.EVENT.REMOTE_STREAM_AVAILABLE, ({ streamtype, stream }) => {
  ERTCCALL.attachMediaStream('#remote-video', stream);
});

// 监听本地流
call.on(ERTCCALL.EVENT.LOCAL_STREAM_AVAILABLE, ({ stream }) => {
  ERTCCALL.attachMediaStream('#local-video', stream);
});

// 监听呼叫超时
call.on(ERTCCALL.EVENT.CALL_TIMEOUT, () => {
  console.log('呼叫超时');
});

// 发起呼叫
await call.makeCall();

// 挂断
await call.hangup();
```

### 2. 带 UI（开箱即用）

```typescript
import { ERTCCallView } from 'ertc-web-call';

const view = new ERTCCallView({
  container: '#app',
  domain: 'https://open.ys7.com',
  roomState: {
    accessToken: '...',
    deviceSerial: '...',
    resourceToken: '...',
    deviceResourceToken: '...',
    appId: '...',
    strRoomId: '...',
    account: '...',
  },
});

// 发起呼叫
view.makeCall();

// 监听事件
view.on('phaseChange', (phase) => console.log(phase));
view.on('peerHangup', () => view.destroy());

// 销毁
view.destroy();
```

### 3. Headless 模式（React/Vue 自己渲染）

```typescript
import { ERTCCallView } from 'ertc-web-call';

const view = new ERTCCallView({
  domain: 'https://open.ys7.com',
  roomState: { ... },
  headless: true, // 不渲染 DOM
});

// 监听状态驱动自己的 UI
view.state.on('phase', (phase) => setPhase(phase));
view.state.on('remoteStream', (stream) => {
  videoRef.current.srcObject = stream;
});

view.makeCall();
```

## API

### ERTCCALL（纯逻辑）

#### 构造参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| domain | string | 否 | 服务域名，默认 `https://open.ys7.com` |
| accessToken | string | 是 | 接口鉴权 token |
| deviceSerial | string | 是 | 设备序列号 |
| resourceToken | string | 是 | Web 端入会 token |
| deviceResourceToken | string | 是 | 设备端入会 token |
| appId | string | 是 | 应用 ID |
| strRoomId | string | 是 | 房间 ID |
| account | string | 是 | 用户账号 ID |
| debug | boolean | 否 | 调试模式 |

#### 方法

| 方法 | 参数 | 返回 | 说明 |
|------|------|------|------|
| `makeCall(data?)` | Partial\<MakeCallParams\> | Promise\<void\> | 发起呼叫 |
| `acceptCall(data)` | EnterRoomParams | Promise\<void\> | 接听呼叫 |
| `cancleCall(data?)` | Partial\<MakeCallParams\> | Promise | 取消呼叫 |
| `rejectCall(data?)` | Partial\<MakeCallParams\> | Promise | 拒接呼叫 |
| `hangup()` | - | Promise\<void\> | 挂断通话 |
| `reset()` | - | void | 重置状态（设备拒接/忙线时调用） |

#### 静态属性

| 属性 | 说明 |
|------|------|
| `ERTCCALL.EVENT` | 事件名常量 |
| `ERTCCALL.STREAM_TYPE` | 流类型常量 |
| `ERTCCALL.attachMediaStream(el, stream)` | 绑定媒体流到 DOM 元素 |

#### 事件

| 事件名 | 回调参数 | 说明 |
|--------|---------|------|
| `STATUS_CHANGE` | `status: IStatus` | 通话状态变化 |
| `CALL_TIMEOUT` | `{ timeout: true }` | 呼叫超时 |
| `REMOTE_STREAM_AVAILABLE` | `{ streamtype, stream }` | 远端流可用 |
| `LOCAL_STREAM_AVAILABLE` | `{ streamtype, stream }` | 本地流可用 |
| `CLIENTJOIN` | `msg` | 对端加入房间 |
| `CLIENTLEAVE` | `msg` | 对端离开房间 |

#### 状态枚举

```typescript
enum IStatus {
  INIT = "init",       // 未呼叫
  CALLING = "calling", // 呼叫中
  TALKING = "talking", // 通话中
}
```

### ERTCCallView（带 UI）

#### 构造参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| container | HTMLElement \| string | 否 | 挂载容器（headless 模式不传） |
| domain | string | 是 | 服务域名 |
| roomState | object | 是 | 房间参数（同 ERTCCALL 构造参数） |
| headless | boolean | 否 | 无 UI 模式 |
| platform | 'web' \| 'h5' | 否 | 平台，不传自动检测 |
| theme | ThemeInput | 否 | 主题配置 |
| layout | { width, height } | 否 | 布局尺寸 |
| callTimeout | number | 否 | 呼叫超时时间（ms） |
| classPrefix | string | 否 | CSS 类名前缀，默认 `ertc` |

#### 方法

| 方法 | 说明 |
|------|------|
| `makeCall(params?)` | 发起呼叫 |
| `acceptCall(params?)` | 接听 |
| `handleup()` | 挂断 |
| `cancelCall()` | 取消呼叫 |
| `rejectCall()` | 拒接 |
| `startCamera()` | 开启摄像头 |
| `stopCamera()` | 关闭摄像头 |
| `startMicrophone()` | 开启麦克风 |
| `stopMicrophone()` | 关闭麦克风 |
| `destroy()` | 销毁实例 |

#### 事件

```typescript
view.on('phaseChange', (phase) => {});   // 通话阶段变化
view.on('remoteStream', (stream, type) => {}); // 远端流到达
view.on('localStream', (stream) => {});  // 本地流到达
view.on('callTimeout', () => {});        // 呼叫超时
view.on('peerHangup', () => {});         // 对方挂断
view.on('error', (err) => {});           // 错误
```

#### 状态监听（Headless 模式）

```typescript
view.state.on('phase', (phase) => {});
view.state.on('remoteStream', (stream) => {});
view.state.on('micEnabled', (enabled) => {});
view.state.on('duration', (seconds) => {});
```

## 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 56+ |
| Firefox | 44+ |
| Safari | 11+ |
| Edge | 79+ |

## License

ISC

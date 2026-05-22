interface DeviceParams {
  cameraId: string;
  frameRate: number;
  width: number;
  height: number;
  bitrate: number;
  simulcast: boolean;
  simulcastMaxBitrates: number;
}

interface EnterRoomParams {
  accessToken: string;
  /** 应用id */
  appId: string;
  roomId: string;
  /** 用户id */
  userId: string;
  /** 房间密码 */
  roomPassword?: string;
}

/**
 * 获取音视频媒体流
 * streamType 1 仅视频 2 仅音频 5 视频大小流 8 屏幕共享
 */
type STREAM_TYPE = 1 | 2 | 4 | 5 | 8;

/** ERTCCore 事件类型映射 */
interface ERTCCoreEvents {
  /** 本地流可用 */
  EVENT_LOCAL_STREAM_AVAILABLE: (data: { streamtype: number; stream: MediaStream }) => void;
  /** 远端流可用 */
  EVENT_REMOTE_STREAM_AVAILABLE: (data: { streamtype: number; stream: MediaStream; customId?: string }) => void;
  /** 其他用户加入 */
  clientJoin: (msg: { customId: string; [key: string]: any }) => void;
  /** 其他用户离开 */
  clientLeave: (msg: { customId: string; [key: string]: any }) => void;
  /** 房间内其他用户流添加 */
  'stream-added': (msg: { customId: string; streamtype: STREAM_TYPE }) => void;
  /** 房间内其他用户流删除 */
  'stream-removed': (msg: { customId: string; streamtype: STREAM_TYPE }) => void;
  /** 自定义消息 */
  custommsg: (res: { msg: string; [key: string]: any }) => void;
  /** SDK 连接状态变化 */
  CONNECT_STATE_CHANGE: (state: string) => void;
  /** 通话状态变更 */
  statusChange: (status: string) => void;
  /** 呼叫超时 */
  callTimeout: (data: { timeout: boolean }) => void;
  /** 错误 */
  error: (err: any) => void;
}

declare class ERTCCore {
  static STREAM_TYPE: {
    /** 仅视频（大流） */
    VIDEO_ONLY: 1;
    /** 仅音频 */
    AUDIO_ONLY: 2;
    /** 视频小流,无法单独发布 */
    VIDEO_SIMULCAST_LITTLE: 4;
    /** 视频大小流,发布的同时会含有小流，接收端可切换 */
    VIDEO_SIMULCAST_LARGE: 5;
    /** 屏幕共享 */
    SCREEN: 8;
  };
  static EVENT: {
    /** sdk连接状态变化 */
    CONNECT_STATE_CHANGE: "CONNECT_STATE_CHANGE";
    /** 用户列表变化 */
    USERS_CHANGE: "EVENT_USERS_CHANGE";
    /** 本地流可用 */
    LOCAL_STREAM_AVAILABLE: "EVENT_LOCAL_STREAM_AVAILABLE";
    /** 远端流可用 */
    REMOTE_STREAM_AVAILABLE: "EVENT_REMOTE_STREAM_AVAILABLE";
    /** 网络质量上报 */
    REPORT_NETWORK_QUALITY: "REPORT_NETWORK_QUALITY";
    /** 网络质量改变上报 */
    REPORT_NETWORK_QUALITY_CHANGE: "REPORT_NETWORK_QUALITY_CHANGE";
    /** 报错（包含消息信令、发布信令、订阅信令） */
    ERROR: "error";
    /** 远端视频流旋转角度 */
    VIDEO_ROTATION: "video-rotation";
    /** 房间内音量变化 */
    AUDIOLEVEL: "audioleve";
    /** 当前用户加入房间结果 */
    ENTERROOMACK: "enterRoomack";
    /** 当前用户退出房间结果 */
    EXITROOMACK: "exitRoomack";
    /** 其他用户加入 */
    CLIENTJOIN: "clientJoin";
    /** 其他用户离开 */
    CLIENTLEAVE: "clientLeave";
    /** 房间内其他用户流添加 */
    STREAM_ADDED: "stream-added";
    /** 房间内其他用户流删除 */
    STREAM_REMOVED: "stream-removed";
    /** 屏幕共享流发布结果 */
    PUBLISHSCREENSTREAMACK: "publishscreenstreamack";
    /** 网络质量通知 */
    NETWORKQUALITY: "networkquality";
    /** 客户端发布权限变化 */
    CLIENT_PERMISSION: "client-permission";
    /** 订阅权限 */
    SUB_PERMISSION: "sub-permission";
    /** 发布本地流结果 */
    PUBLISHLOCALSTREAMACK: "publishlocalstreamack";
    /** 取消发布本地流结果 */
    UNPUBLISHLOCALSTREAMACK: "unpublishlocalstreamack";
    /** 订阅结果 */
    SUBREMOTEACK: "subremoteack";
    /** 取消订阅结果 */
    UNSUBREMOTEACK: "unsubremoteack";
  };
  domain: string;
  params: {
    debug?: boolean;
    exportLogs?: boolean;
    domain?: string;
    iceResetWsTime?: number;
  };
  constructor(options: any);
  /** 进入一个音视频通话房间 */
  enterRoom(data: EnterRoomParams): Promise<any>;
  /** 退出当前房间 */
  leaveRoom(): Promise<any>;
  /** 设置音视频参数（对屏幕共享流同样生效） */
  setProfile(data: Partial<DeviceParams>): void;
  /** 开启本地摄像头采集，并发布到当前的房间中 */
  startLocalVideo(): Promise<any>;
  /** 停止本地摄像头采集与发布 */
  stopLocalVideo(): Promise<any>;
  /** 暂停本地摄像头的采集与发布 */
  pauseLocalVideo(): Promise<any>;
  /** 恢复本地摄像头的采集与发布 */
  resumeLocalVideo(): Promise<any>;
  /** 开启本地麦克风采集，并发布到当前的房间中 */
  startLocalAudio(): Promise<any>;
  /** 停止本地麦克风的采集与发布 */
  stopLocalAudio(): Promise<any>;
  /** 暂停本地麦克风的采集与发布 */
  pauseLocalAudio(): Promise<any>;
  /** 恢复本地麦克风的采集与发布 */
  resumeLocalAudio(): Promise<any>;
  /** 开启屏幕共享，并发布到当前的房间中 */
  startScreenShare(): Promise<any>;
  /** 停止屏幕共享与发布 */
  stopScreenShare(): Promise<any>;
  /** 订阅远端流 */
  subscribeStream(data: { userId: string; type: STREAM_TYPE; view?: string }): Promise<any>;
  /** 取消订阅远端流 */
  unsubscribe(data: { userId: string; type: STREAM_TYPE; view?: string }): Promise<any>;
  /** 暂停订阅 */
  pausePullPeerStream(data: { userId: string; type: any }): Promise<any>;
  /** 恢复订阅 */
  resumePullPeerStream(data: { userId: string; type: any }): Promise<any>;
  /** 获取摄像头列表 */
  getCamerasList(): Promise<any>;
  /** 获取麦克风列表 */
  getMicrophonesList(): Promise<any>;
  /** 获取扬声器列表 */
  getSpeakersList(): Promise<any>;
  getUsers(): Array<Record<string, any>>;
  getVideoSettingParams(): DeviceParams;
  trigger(event: string, data?: any): void;
  on<K extends keyof ERTCCoreEvents>(event: K, callback: ERTCCoreEvents[K]): Function;
  on(event: string, callback: Function): Function;
  once<K extends keyof ERTCCoreEvents>(event: K, callback: ERTCCoreEvents[K]): void;
  once(event: string, callback: Function): void;
  remove(event: string, callback?: Function): void;
  /** 发布流 */
  publishStream(params: { type: STREAM_TYPE; view?: string; stream?: MediaStream; simulcast?: boolean }): Promise<any>;
  /** 取消发布流 */
  unpublishStream(params: { type: STREAM_TYPE }): Promise<any>;
  /** 设置麦克风设备 */
  setMicrophoneDevice(params: { deviceId: string }): Promise<any>;
  /** 设置摄像头设备 */
  setCameraDevice(params: { deviceId: string }): Promise<any>;
}

declare module MERTCCall {
  export interface AuthInfo {
    /** 资源token */
    accessToken: string;
    /** 设备序列号 */
    deviceSerial: string;
    localIndex?: number;
  }

  export interface EnterRoomParams {
    resourceToken: string;
    /** 应用id */
    appId: string;
    strRoomId: string;
    /** 用户id */
    account: string;
    roomPassword?: string;
  }
  
}

interface MakeCallParams extends MERTCCall.AuthInfo {
    /** request-视频呼叫，cancel-取消呼叫，reject-拒绝接听 */
    action: "request" | "cancel" | "reject";
    strRoomId: string;
    appId: string;
    account: string;
    /** web入会token */
    resourceToken: string;
}

declare const Event$1: {
    STATUS_CHANGE: string;
    CALL_TIMEOUT: string;
};
type CommonInfo = MERTCCall.AuthInfo & Omit<MakeCallParams, "action"> & {
    /** 呼叫设备入会resourceToken 通过接口给服务端*/
    deviceResourceToken?: string;
};
declare const enum IStatus {
    /** 未呼叫 */
    INIT = "init",
    /** 呼叫中 */
    CALLING = "calling",
    /** 通话中 */
    TALKING = "talking"
}
declare class ERTCCALL extends ERTCCore {
    [x: string]: any;
    static version: string;
    static STREAM_TYPE: {
        /**  仅视频（大流） */
        VIDEO_ONLY: 1;
        /** 仅音频 */
        AUDIO_ONLY: 2;
        /** 视频小流,无法单独发布 */
        VIDEO_SIMULCAST_LITTLE: 4;
        /** 视频大小流,发布的同时会含有小流，接收端可切换 */
        VIDEO_SIMULCAST_LARGE: 5;
        /** 屏幕共享 */
        SCREEN: 8;
    };
    static EVENT: typeof ERTCCore.EVENT & typeof Event$1;
    /** 给dom绑定媒体流 */
    static attachMediaStream: typeof attachMediaStream;
    commonInfo: CommonInfo;
    status: IStatus;
    private callTimeoutId;
    constructor(config?: Partial<CommonInfo> & {
        debug?: boolean;
        exportLogs?: boolean;
        domain?: string;
        iceResetWsTime?: number;
    });
    private listenEvent;
    /** 检查参数 */
    private checkParams;
    /** 发起呼叫 */
    makeCall(data?: (Partial<MakeCallParams> & Pick<CommonInfo, "deviceResourceToken"> & {
        timeout?: number;
    })): Promise<void>;
    /** 取消呼叫 */
    cancelCall(data?: Partial<MakeCallParams>): Promise<unknown>;
    /** 取消呼叫 @deprecated */
    cancleCall(data?: Partial<MakeCallParams>): Promise<unknown>;
    /** 接听呼叫 */
    acceptCall(data: MERTCCall.EnterRoomParams): Promise<void>;
    /** 拒接呼叫 */
    rejectCall(data?: Partial<MakeCallParams>): Promise<unknown>;
    /** 主动挂断 */
    hangup(): Promise<void>;
    reset(): void;
    publishLocalStream(): Promise<void>;
    setCallTimeout(timeout: number | boolean, data?: any): Promise<void>;
    _updateStatus(data: IStatus): Promise<void>;
}
/** 绑定媒体流 */
declare function attachMediaStream(element: HTMLMediaElement | string, stream: MediaStream, autoPlay?: boolean): void;

interface Options$1 {
    id: string;
    width: number;
    height: number;
    device: any;
    callStatus: string;
}
declare class ERTCCallUITheme extends ERTCCALL {
    container: HTMLElement;
    options: Options$1;
    btnStatus: any;
    cameraList: Array<any>;
    microphonesList: Array<any>;
    swapVideo: boolean;
    isPrivacyMarsking: any;
    constructor(container: HTMLElement, options: Options$1);
    swapVideos(): void;
    setCallTimer: () => void;
    clearCallTimer: () => void;
    secondsToHMS: (seconds: any) => string;
    setMicrophonesList: (microphonesList: any) => void;
    setCameraList: (cameraList: any) => void;
    initTheme(): void;
    ctreateBtns(status: string): void;
    updateMicrophonesList(): void;
    updateCameraList(): void;
    onBtnClick: (e: Event, type: string) => void;
    matchBtn(btnId: string): HTMLDivElement;
    setPrivacyMasking(id: string, status: boolean, target: string): void;
    updateBtn(btnId: string, status: any): void;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
declare class EventEmitter<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  Context extends any = any
> {
  static prefixed: string | boolean;

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  eventNames(): Array<EventEmitter.EventNames<EventTypes>>;

  /**
   * Return the listeners registered for a given event.
   */
  listeners<T extends EventEmitter.EventNames<EventTypes>>(
    event: T
  ): Array<EventEmitter.EventListener<EventTypes, T>>;

  /**
   * Return the number of listeners listening to a given event.
   */
  listenerCount(event: EventEmitter.EventNames<EventTypes>): number;

  /**
   * Calls each of the listeners registered for a given event.
   */
  emit<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    ...args: EventEmitter.EventArgs<EventTypes, T>
  ): boolean;

  /**
   * Add a listener for a given event.
   */
  on<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: Context
  ): this;
  addListener<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: Context
  ): this;

  /**
   * Add a one-time listener for a given event.
   */
  once<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: Context
  ): this;

  /**
   * Remove the listeners of a given event.
   */
  removeListener<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn?: EventEmitter.EventListener<EventTypes, T>,
    context?: Context,
    once?: boolean
  ): this;
  off<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn?: EventEmitter.EventListener<EventTypes, T>,
    context?: Context,
    once?: boolean
  ): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: EventEmitter.EventNames<EventTypes>): this;
}

declare namespace EventEmitter {
  export interface ListenerFn<Args extends any[] = any[]> {
    (...args: Args): void;
  }

  export interface EventEmitterStatic {
    new <
      EventTypes extends ValidEventTypes = string | symbol,
      Context = any
    >(): EventEmitter<EventTypes, Context>;
  }

  /**
   * `object` should be in either of the following forms:
   * ```
   * interface EventTypes {
   *   'event-with-parameters': any[]
   *   'event-with-example-handler': (...args: any[]) => void
   * }
   * ```
   */
  export type ValidEventTypes = string | symbol | object;

  export type EventNames<T extends ValidEventTypes> = T extends string | symbol
    ? T
    : keyof T;

  export type ArgumentMap<T extends object> = {
    [K in keyof T]: T[K] extends (...args: any[]) => void
      ? Parameters<T[K]>
      : T[K] extends any[]
      ? T[K]
      : any[];
  };

  export type EventListener<
    T extends ValidEventTypes,
    K extends EventNames<T>
  > = T extends string | symbol
    ? (...args: any[]) => void
    : (
        ...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]
      ) => void;

  export type EventArgs<
    T extends ValidEventTypes,
    K extends EventNames<T>
  > = Parameters<EventListener<T, K>>;

  export const EventEmitter: EventEmitterStatic;
}

interface RoomState$1 {
    accessToken: string;
    resourceToken: string;
    deviceResourceToken: string;
    deviceSerial: string;
    appId: string;
    strRoomId: string;
    account: string;
}
interface Options {
    id: string;
    width: number;
    height: number;
    roomState: RoomState$1;
    domain: string | null;
    callStatus: string;
    device: any;
    handleInitSuccess: Function;
    debug: boolean;
}
declare class EZRTCCallUI extends ERTCCallUITheme {
    container: HTMLElement;
    call: ERTCCALL;
    hasMediaPermission: boolean;
    options: Options;
    localStream: MediaStream | null;
    microphonesList: any;
    currentMicrophone: string;
    currentCamera: string;
    cameraList: any;
    eventEmitter: EventEmitter;
    status: any;
    constructor(container: HTMLElement, options: Options);
    init: () => void;
    getMicrophonesList: () => Promise<void>;
    selectMicrophoneDevice: (deviceId: string) => void;
    updateMicrophone: (deviceId: string) => void;
    getCamerasList: () => Promise<void>;
    selectCameraDevice: (deviceId: string) => void;
    updateCamera: (deviceId: string) => void;
    getCameraPermission: () => Promise<unknown>;
    getMicrophonePermission: () => Promise<unknown>;
    getMediaPermission: () => Promise<[PromiseSettledResult<unknown>, PromiseSettledResult<unknown>]>;
    setStream: (stream: MediaStream, streamtype: "video" | "audio", user: "local" | "remote") => void;
    updateVideoSize: () => void;
    startCamera: () => Promise<void>;
    stopCamera: () => void;
    startMicrophone: () => Promise<void>;
    stopMicrophone: () => void;
    makeCall: (params: RoomState$1) => Promise<void>;
    acceptCall: () => Promise<void>;
    cancelCall: () => Promise<void>;
    rejectCall: () => Promise<unknown>;
    handleup: () => Promise<void>;
    destroy: () => void;
}

type BusEvents = Record<string, (...args: any[]) => void>;
declare class EventBus<T extends {
    [K in keyof T]: (...args: any[]) => void;
} = BusEvents> {
    private events;
    on<K extends keyof T>(event: K, listener: T[K]): Function;
    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void;
    off<K extends keyof T>(event: K, listener?: T[K]): void;
    once<K extends keyof T>(event: K, listener: T[K]): void;
    removeAllListener(): void;
}

/**
 * ERTCCallView 类型定义
 */
type CallPhase = 'idle' | 'calling' | 'ringing' | 'talking';
interface ICallState {
    /** 通话阶段 */
    phase: CallPhase;
    /** 麦克风是否开启 */
    micEnabled: boolean;
    /** 摄像头是否开启 */
    cameraEnabled: boolean;
    /** 当前麦克风设备 ID */
    currentMicId: string;
    /** 当前摄像头设备 ID */
    currentCameraId: string;
    /** 麦克风设备列表 */
    micList: MediaDeviceInfo[];
    /** 摄像头设备列表 */
    cameraList: MediaDeviceInfo[];
    /** 通话时长（秒） */
    duration: number;
    /** 本地视频流 */
    localStream: MediaStream | null;
    /** 远端视频流 */
    remoteStream: MediaStream | null;
    /** 远端音频流 */
    remoteAudioStream: MediaStream | null;
    /** 隐私遮蔽状态 */
    privacyMask: {
        local: boolean;
        remote: boolean;
    };
    /** 远端摄像头是否关闭（区别于隐私遮蔽） */
    remoteCameraOff: boolean;
    /** 主副视频是否交换 */
    swapped: boolean;
}
interface CallViewEvents {
    phaseChange: (phase: CallPhase) => void;
    remoteStream: (stream: MediaStream, type: 'video' | 'audio') => void;
    localStream: (stream: MediaStream) => void;
    callTimeout: () => void;
    peerHangup: () => void;
    deviceChange: (devices: {
        mic: MediaDeviceInfo[];
        camera: MediaDeviceInfo[];
    }) => void;
    error: (err: {
        code: number;
        message: string;
    }) => void;
    privacyChange: (data: {
        action: 'turnOn' | 'turnOff';
    }) => void;
    /** H5: 切换前后摄像头 */
    switchCamera: () => void;
    /** H5: 切换外放/听筒 */
    toggleSpeaker: () => void;
}
interface RoomState {
    accessToken: string;
    resourceToken: string;
    deviceResourceToken: string;
    deviceSerial: string;
    appId: string;
    strRoomId: string;
    account: string;
}
interface AcceptParams {
    resourceToken: string;
    appId: string;
    strRoomId: string;
    account: string;
    roomPassword?: string;
}
interface ERTCCallViewOptions {
    /** 容器元素或选择器 */
    container?: HTMLElement | string;
    /** 服务域名 */
    domain: string;
    /** 调试模式 */
    debug?: boolean;
    /** 房间参数 */
    roomState?: Partial<RoomState>;
    /** 呼叫超时时间（毫秒） */
    callTimeout?: number;
    /** 无头模式（不渲染 UI） */
    headless?: boolean;
    /** 平台类型 */
    platform?: 'web' | 'h5';
    /** 主题配置 */
    theme?: ThemeInput;
    /** 布局尺寸 */
    layout?: {
        width?: number;
        height?: number;
    };
    /** 是否显示设备选择器 */
    showDevicePicker?: boolean;
    /** 是否显示计时器 */
    showTimer?: boolean;
    /** 是否允许交换主副视频 */
    allowSwap?: boolean;
    /** CSS 类名前缀 */
    classPrefix?: string;
}
interface ThemeColors {
    primary: string;
    danger: string;
    success: string;
    buttonBg: string;
    buttonActiveBg: string;
    text: string;
    textSecondary: string;
    background: string;
    overlay: string;
}
interface ThemeLayout {
    width: number;
    height: number;
    borderRadius: number;
    controlBarPosition: 'bottom' | 'top';
}
type ThemeInput = {
    colors?: Partial<ThemeColors>;
    layout?: Partial<ThemeLayout>;
};

type Listener<K extends keyof ICallState> = (value: ICallState[K]) => void;
type GlobalListener = (state: Readonly<ICallState>, key: keyof ICallState) => void;
declare class CallState {
    private state;
    private listeners;
    private globalListeners;
    constructor();
    /** 获取完整状态快照（只读） */
    get(): Readonly<ICallState>;
    /** 获取单个字段值 */
    getField<K extends keyof ICallState>(key: K): ICallState[K];
    /** 设置单个字段，值未变则不触发通知（stream 类型除外） */
    set<K extends keyof ICallState>(key: K, value: ICallState[K]): void;
    /** 批量更新多个字段 */
    patch(partial: Partial<ICallState>): void;
    /** 订阅单个字段变更，返回取消函数 */
    on<K extends keyof ICallState>(key: K, fn: Listener<K>): () => void;
    /** 订阅任意字段变更 */
    onChange(fn: GlobalListener): () => void;
    /** 重置为初始状态并清理所有订阅 */
    reset(): void;
}

declare class ERTCCallView extends EventBus<CallViewEvents> {
    readonly state: CallState;
    readonly call: ERTCCALL;
    private renderer;
    private durationTimer;
    private options;
    private theme;
    private stateUnsubscribes;
    constructor(options: ERTCCallViewOptions);
    makeCall(params?: Partial<RoomState>): Promise<void>;
    acceptCall(params?: AcceptParams): Promise<void>;
    handleUp(): Promise<void>;
    cancelCall(): Promise<void>;
    rejectCall(): Promise<void>;
    /**
     * 重置通话状态（不发取消请求）
     * 用于设备拒接/忙线场景，业务层收到 webhook 消息后调用
     */
    reset(): void;
    /**
     * H5: 设置外放/听筒模式（由业务层在切换成功后调用）
     * @param mode 'loudspeaker'=外放模式，'receiver'=听筒模式
     */
    setSpeakerMode(mode: "loudspeaker" | "receiver"): void;
    /**
     * 显示 Toast 提示
     */
    showToast(message: string, duration?: number): void;
    startCamera(): void;
    stopCamera(): void;
    startMicrophone(): void;
    stopMicrophone(): void;
    setMicDevice(deviceId: string): Promise<void>;
    setCameraDevice(deviceId: string): Promise<void>;
    refreshDevices(): Promise<void>;
    /**
     * 请求媒体权限（摄像头 + 麦克风）
     * 旧版在构造时自动请求，新版改为手动调用，更灵活
     */
    requestPermissions(): Promise<{
        camera: boolean;
        microphone: boolean;
    }>;
    destroy(): void;
    private bindCoreEvents;
    private initRenderer;
    private handleRendererAction;
    private resolveContainer;
    private mergeTheme;
    private startDurationTimer;
    private stopDurationTimer;
    /**
     * 通话建立后校验设备状态
     * 确保 mic/camera 的开关状态与实际一致
     */
    private verifyDeviceState;
    /**
     * H5: 切换前后摄像头
     * 等底层 setCameraDevice 成功后再更新图标
     */
    private _switchingCamera;
    private switchCameraFacing;
    private dedupeDevices;
}

export { ERTCCALL, ERTCCallView, EZRTCCallUI, IStatus, ERTCCALL as default };
export type { CommonInfo };

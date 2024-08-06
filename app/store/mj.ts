import {
  Stability,
  StoreKey,
  ACCESS_CODE_PREFIX,
  ApiPath,
  MJProxy,
} from "@/app/constant";
import { getBearerToken } from "@/app/client/api";
import { createPersistStore } from "@/app/utils/store";
import { nanoid } from "nanoid";
import { useAccessStore } from "./access";
import { create, StoreApi, UseBoundStore } from "zustand";
import { params } from "@/app/components/sd";
import deepcopy from "deepcopy";

export const useMjDataStore: UseBoundStore<
  StoreApi<{
    data: {
      imagine: any;
      blend: any;
      describe: any;
    };
    action: string;
    setAction: (action: string) => void;
    setData: (data: any, type: string) => void;
    getCurActionData: () => any;
  }>
> = create((set, get) => ({
  data: {
    imagine: {},
    blend: {},
    describe: {},
  },
  action: "imagine",
  setAction: (action: string) => set({ action }),
  setData: (data: any, type: string) =>
    set((state) => ({
      data: {
        ...state.data,
        [type]: data,
      },
    })),
  getCurActionData: () => {
    // @ts-ignore
    return get().data[get().action] as any;
  },
}));

const DEFAULT_MJ_STATE = {
  currentId: 0,
  draw: [],
};

const fetchTasks: any = {};

export const useMjStore = createPersistStore<
  {
    currentId: number;
    draw: any[];
  },
  {
    getNextId: () => number;
    sendTask: (data: any, call?: (err: any) => void) => void;
    updateDraw: (draw: any) => void;
  }
>(
  DEFAULT_MJ_STATE,
  (set, _get) => {
    function get() {
      return {
        ..._get(),
        ...methods,
      };
    }

    const methods = {
      getNextId() {
        const id = ++_get().currentId;
        set({ currentId: id });
        return id;
      },
      async sendTask(data: any, call?: (err: any) => void) {
        const id = nanoid();
        const requestData = deepcopy(data.data);
        const saveData: any = {};
        for (let dataKey in data.data) {
          if (!["base64Array", "base64"].includes(dataKey)) {
            saveData[dataKey] = data.data[dataKey];
          }
        }
        data.data = saveData;
        data = { ...data, id: id, status: "wait" };
        set({ draw: [data, ..._get().draw] });
        this.getNextId();
        switch (data.action) {
          case "imagine":
            await this.commonPostReqSend(
              id,
              MJProxy.ImaginePath,
              requestData,
              call,
            );
            break;
          case "blend":
            await this.commonPostReqSend(
              id,
              MJProxy.BlendPath,
              requestData,
              call,
            );
            break;
          case "describe":
            await this.commonPostReqSend(
              id,
              MJProxy.DescribePath,
              requestData,
              call,
            );
            break;
          case "action":
            await this.commonPostReqSend(
              id,
              MJProxy.ActionPath,
              requestData,
              call,
            );
            break;
        }
      },
      async commonPostReqSend(
        id: string,
        path: string,
        data: any,
        call?: (err: any) => void,
      ) {
        await this.MjRequestCall("POST", path, data, (resData, err) => {
          if (err) {
            call && call(err);
            this.updateDraw({
              id,
              status: "error",
              error: err?.message,
            });
            return;
          }
          if (resData && resData.result) {
            const taskId = resData.result;
            this.updateDraw({
              id,
              taskId: taskId,
            });
            call && call(null);
            this.intervalFetchStatus(id, taskId);
          } else {
            this.updateDraw({
              id,
              status: "error",
              error: "not task id",
            });
            call && call(new Error("not task id"));
          }
        });
      },
      intervalFetchStatus(id: string, taskId: string) {
        if (fetchTasks[taskId]) {
          return;
        }
        setTimeout(async () => {
          await this.MjRequestCall(
            "GET",
            MJProxy.GetTaskById.replace("{id}", taskId),
            null,
            (resData, err) => {
              if (err) {
                this.updateDraw({
                  id,
                  status: "error",
                  error: err?.message,
                });
                return;
              }
              if (resData) {
                if (
                  resData.status != "FAILURE" &&
                  resData.status != "SUCCESS"
                ) {
                  switch (resData.status) {
                    case "IN_PROGRESS":
                    case "SUBMITTED":
                      this.updateDraw({
                        id,
                        status: "running",
                        progress: resData.progress,
                        imageUrl: resData.imageUrl,
                      });
                      break;
                  }
                  this.intervalFetchStatus(id, taskId);
                } else {
                  delete fetchTasks[taskId];
                  switch (resData.status) {
                    case "FAILURE":
                      this.updateDraw({
                        id,
                        status: "error",
                        error: resData.failReason,
                      });
                      break;
                    case "SUCCESS":
                      this.updateDraw({
                        id,
                        status: "success",
                        progress: resData.progress,
                        imageUrl: resData.imageUrl,
                        buttons: resData.buttons,
                        prompt: resData.prompt,
                        promptEn: resData.promptEn,
                      });
                      break;
                  }
                }
              } else {
                this.intervalFetchStatus(id, taskId);
              }
            },
          );
        }, 5000);
      },
      async MjRequestCall(
        method: string,
        path: string,
        data: any,
        call: (data: any, err?: any) => void,
      ) {
        const accessStore = useAccessStore.getState();
        let prefix: string = ApiPath.Mj as string;
        let bearerToken = "";
        if (accessStore.useCustomConfig) {
          prefix = accessStore.mjpUrl || (ApiPath.Mj as string);
          bearerToken = getBearerToken(accessStore.mjpApiKey);
        }
        if (!bearerToken && accessStore.enabledAccessControl()) {
          bearerToken = getBearerToken(
            ACCESS_CODE_PREFIX + accessStore.accessCode,
          );
        }
        const headers = {
          Accept: "application/json",
          Authorization: bearerToken,
        };
        try {
          const init: any = {
            method: method,
            headers,
          };
          if (data) {
            init["body"] = JSON.stringify(data);
          }
          const response = await fetch(`${prefix}/${path}`, init);
          const resData = await response.json();
          call(resData);
        } catch (error) {
          call(null, error);
          console.error("Error:", error);
          this.getNextId();
        }
      },
      updateDraw(_draw: any, override?: boolean) {
        const draw = _get().draw || [];
        draw.some((item, index) => {
          if (item.id === _draw.id) {
            draw[index] = override ? _draw : { ...draw[index], ..._draw };
            set(() => ({ draw }));
            return true;
          }
        });
      },
    };

    return methods;
  },
  {
    name: StoreKey.MjList,
    version: 1.0,
  },
);

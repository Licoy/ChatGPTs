import chatStyles from "@/app/components/chat.module.scss";
import styles from "@/app/components/mj/mj.module.scss";
import homeStyles from "@/app/components/home.module.scss";

import { IconButton } from "@/app/components/button";
import ReturnIcon from "@/app/icons/return.svg";
import Locale from "@/app/locales";
import { Path } from "@/app/constant";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  copyToClipboard,
  getMessageTextContent,
  useMobileScreen,
} from "@/app/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppConfig } from "@/app/store";
import MinIcon from "@/app/icons/min.svg";
import MaxIcon from "@/app/icons/max.svg";
import { getClientConfig } from "@/app/config/client";
import { ChatAction } from "@/app/components/chat";
import DeleteIcon from "@/app/icons/clear.svg";
import CopyIcon from "@/app/icons/copy.svg";
import PromptIcon from "@/app/icons/prompt.svg";
import { useMjDataStore, useMjStore } from "@/app/store/mj";
import locales from "@/app/locales";
import LoadingIcon from "@/app/icons/three-dots.svg";
import ErrorIcon from "@/app/icons/delete.svg";
import { Property } from "csstype";
import {
  showConfirm,
  showImageModal,
  showModal,
} from "@/app/components/ui-lib";
import { removeImage } from "@/app/utils/chat";
import { SideBar } from "./mj-sidebar";
import { WindowContent } from "@/app/components/home";

function getSdTaskStatus(item: any) {
  let s: string;
  let color: Property.Color | undefined = undefined;
  switch (item.status) {
    case "success":
      s = Locale.Mj.Status.Success;
      color = "green";
      break;
    case "error":
      s = Locale.Mj.Status.Error;
      color = "red";
      break;
    case "wait":
      s = Locale.Mj.Status.Wait;
      color = "#af29ef";
      break;
    case "running":
      s = Locale.Mj.Status.Running;
      color = "blue";
      if (item.progress) {
        s += ` (${item.progress})`;
      }
      break;
    default:
      s = item.status.toUpperCase();
  }
  return (
    <p className={styles["line-1"]} title={item.error} style={{ color: color }}>
      <span>
        {locales.Mj.Status.Name}: {s}
      </span>
      {item.status === "error" && (
        <span
          className="clickable"
          onClick={() => {
            showModal({
              title: locales.Mj.Detail,
              children: (
                <div style={{ color: color, userSelect: "text" }}>
                  {item.error}
                </div>
              ),
            });
          }}
        >
          - {item.error}
        </span>
      )}
    </p>
  );
}

export function Mj() {
  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();
  const location = useLocation();
  const clientConfig = useMemo(() => getClientConfig(), []);
  const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;
  const config = useAppConfig();
  const scrollRef = useRef<HTMLDivElement>(null);
  const mjStore = useMjStore();
  const mjDataStore = useMjDataStore();
  const [sdImages, setSdImages] = useState(mjStore.draw);
  const isMj = location.pathname === Path.Mj;

  useEffect(() => {
    setSdImages(mjStore.draw);
    if (!mjDataStore.loadCheck) {
      mjDataStore.loadCheck = true;
      if (mjStore.draw?.length) {
        mjStore.draw.forEach((item: any) => {
          if (
            item.id &&
            item.taskId &&
            !["error", "success"].includes(item.status)
          ) {
            mjStore.intervalFetchStatus(item.id, item.taskId);
          }
        });
      }
    }
  }, [mjStore.currentId]);

  return (
    <>
      <SideBar className={isMj ? homeStyles["sidebar-show"] : ""} />
      <WindowContent>
        <div className={chatStyles.chat} key={"1"}>
          <div className="window-header" data-tauri-drag-region>
            {isMobileScreen && (
              <div className="window-actions">
                <div className={"window-action-button"}>
                  <IconButton
                    icon={<ReturnIcon />}
                    bordered
                    title={Locale.Chat.Actions.ChatList}
                    onClick={() => navigate(Path.Mj)}
                  />
                </div>
              </div>
            )}
            <div
              className={`window-header-title ${chatStyles["chat-body-title"]}`}
            >
              <div className={`window-header-main-title`}>Midjourney</div>
              <div className="window-header-sub-title">
                {Locale.Mj.SubTitle(sdImages.length || 0)}
              </div>
            </div>

            <div className="window-actions">
              {showMaxIcon && (
                <div className="window-action-button">
                  <IconButton
                    icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                    bordered
                    onClick={() => {
                      config.update(
                        (config) => (config.tightBorder = !config.tightBorder),
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={chatStyles["chat-body"]} ref={scrollRef}>
            <div className={styles["mj-img-list"]}>
              {sdImages.length > 0 ? (
                sdImages.map((item: any) => {
                  return (
                    <div className={styles["mj-img-item-box"]} key={item.id}>
                      <div
                        style={{ display: "flex" }}
                        className={styles["mj-img-item"]}
                      >
                        {item.status === "success" ||
                        (item.status === "running" && item.imageUrl) ? (
                          <img
                            className={styles["img"]}
                            src={item.imageUrl}
                            alt={item.id}
                            key={item.imageUrl}
                            onClick={(e) =>
                              showImageModal(
                                item.imageUrl,
                                true,
                                isMobileScreen
                                  ? { width: "100%", height: "fit-content" }
                                  : { maxWidth: "100%", maxHeight: "100%" },
                                isMobileScreen
                                  ? { width: "100%", height: "fit-content" }
                                  : { width: "100%", height: "100%" },
                              )
                            }
                          />
                        ) : item.status === "error" ? (
                          <div className={styles["pre-img"]}>
                            <ErrorIcon />
                          </div>
                        ) : (
                          <div
                            className={`${styles["pre-img"]} ${styles["pre-img-loading"]}`}
                          >
                            <div>
                              <LoadingIcon />
                            </div>
                            {item.progress && <div>{item.progress}</div>}
                          </div>
                        )}
                        <div
                          style={{ marginLeft: "10px" }}
                          className={styles["mj-img-item-info"]}
                        >
                          {item.data.prompt && (
                            <p className={styles["line-1"]}>
                              {locales.MjPanel.Prompt}:{" "}
                              <span
                                className="clickable"
                                title={item.data.prompt}
                                onClick={() => {
                                  showModal({
                                    title: locales.Mj.Detail,
                                    children: (
                                      <div style={{ userSelect: "text" }}>
                                        {item.data.prompt}
                                      </div>
                                    ),
                                  });
                                }}
                              >
                                {item.data.prompt}
                              </span>
                            </p>
                          )}
                          <p>
                            {locales.MjPanel.AIModel}: {item.model}
                          </p>
                          <p>
                            {locales.MjPanel.AIAction}: {item.action}
                          </p>
                          <p>
                            {locales.MjPanel.TaskId}: {item.taskId ?? "-"}
                          </p>
                          {getSdTaskStatus(item)}
                          <p>{item.created_at}</p>
                          <div className={chatStyles["chat-message-actions"]}>
                            <div className={chatStyles["chat-input-actions"]}>
                              <ChatAction
                                text={Locale.Mj.Actions.Params}
                                icon={<PromptIcon />}
                                onClick={() => {
                                  showModal({
                                    title: locales.Mj.GenerateParams,
                                    children: (
                                      <div style={{ userSelect: "text" }}>
                                        {Object.keys(item.data).map((key) => {
                                          let label = key;
                                          let value = item.data[key];
                                          return (
                                            <div
                                              key={key}
                                              style={{ margin: "10px" }}
                                            >
                                              <strong>{label}: </strong>
                                              {value}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ),
                                  });
                                }}
                              />
                              {item.data.prompt && (
                                <ChatAction
                                  text={Locale.Mj.Actions.Copy}
                                  icon={<CopyIcon />}
                                  onClick={() =>
                                    copyToClipboard(
                                      getMessageTextContent({
                                        role: "user",
                                        content: item.data.prompt,
                                      }),
                                    )
                                  }
                                />
                              )}
                              <ChatAction
                                text={Locale.Mj.Actions.Delete}
                                icon={<DeleteIcon />}
                                onClick={async () => {
                                  if (
                                    await showConfirm(Locale.Mj.Danger.Delete)
                                  ) {
                                    // remove img_data + remove item in list
                                    removeImage(item.img_data).finally(() => {
                                      mjStore.draw = sdImages.filter(
                                        (i: any) => i.id !== item.id,
                                      );
                                      mjStore.getNextId();
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {item.buttons?.length && (
                        <div
                          style={{ marginTop: "10px" }}
                          className={chatStyles["chat-message-actions"]}
                        >
                          <div className={chatStyles["chat-input-actions"]}>
                            {item.buttons
                              .filter((btn: any) => {
                                return !["Vary (Region)", "❤️"].includes(
                                  btn.label || btn.emoji,
                                );
                              })
                              .map((btn: any) => {
                                return (
                                  <div
                                    key={btn.customId}
                                    style={{
                                      marginBottom: "5px",
                                      marginRight: "5px",
                                    }}
                                  >
                                    <ChatAction
                                      text={btn.label || btn.emoji}
                                      style={{}}
                                      onClick={() =>
                                        mjStore.sendTask({
                                          action: "action",
                                          model: item.model,
                                          data: {
                                            customId: btn.customId,
                                            taskId: item.taskId,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div>{locales.Mj.EmptyRecord}</div>
              )}
            </div>
          </div>
        </div>
      </WindowContent>
    </>
  );
}

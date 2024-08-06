import { IconButton } from "@/app/components/button";
import GithubIcon from "@/app/icons/github.svg";
import ReturnIcon from "@/app/icons/return.svg";
import HistoryIcon from "@/app/icons/history.svg";
import Locale from "@/app/locales";

import { Path, REPO_URL } from "@/app/constant";

import { useNavigate } from "react-router-dom";
import dynamic from "next/dynamic";
import {
  SideBarContainer,
  SideBarBody,
  SideBarHeader,
  SideBarTail,
  useDragSideBar,
  useHotKey,
} from "@/app/components/sidebar";

import { useMjDataStore, useMjStore } from "@/app/store/mj";
import { showToast } from "@/app/components/ui-lib";
import { useMobileScreen } from "@/app/utils";
import { useRef } from "react";
import {
  getModelParamBasicData,
  getParams,
} from "@/app/components/mj/mj-panel";

const MjPanel = dynamic(
  async () => (await import("@/app/components/mj")).MjPanel,
  {
    loading: () => null,
  },
);

export function SideBar(props: { className?: string }) {
  useHotKey();
  const isMobileScreen = useMobileScreen();
  const { onDragStart, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const mjStore = useMjStore();
  const mjDataStore = useMjDataStore();
  const panelRef = useRef(null);

  const handleSubmit = () => {
    const curParamData = mjDataStore.getCurActionData();
    const columns = getParams(mjDataStore.action, curParamData);
    const reqParams: any = {};
    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];
      reqParams[item.value] = curParamData[item.value] ?? null;
      if (item.required) {
        if (item.type === "images") {
          if (
            !reqParams[item.value] ||
            reqParams[item.value].length === 0 ||
            (item.min && reqParams[item.value].length < item.min)
          ) {
            showToast(Locale.MjPanel.ParamIsRequired(item.name));
            return;
          }
        } else {
          if (!reqParams[item.value]) {
            showToast(Locale.MjPanel.ParamIsRequired(item.name));
            return;
          }
        }
      }
    }
    const sendData: any = {};
    if (mjDataStore.action === "imagine") {
      sendData["prompt"] = reqParams["prompt"];
      const c: any[] = [];
      columns.forEach((item) => {
        if (reqParams[item.value] && item.cmd) {
          if (typeof item.cmd === "string") {
            c.push(`${item.cmd} ${reqParams[item.value]}`);
          } else {
            const cmd = item.cmd(reqParams);
            if (cmd) {
              c.push(`${cmd} ${reqParams[item.value]}`);
            }
          }
        }
      });
      if (c && c.length) {
        sendData["prompt"] = `${reqParams["prompt"]} ${c.join(" ")}`;
      }
      if ((reqParams["model"] || "mj") === "niji") {
        sendData["prompt"] += " --niji";
      }
      if (reqParams["iwImages"] && reqParams["iwImages"].length) {
        sendData["base64Array"] = reqParams["iwImages"].map(
          (item: any) => item.b64,
        );
      }
    } else if (mjDataStore.action === "blend") {
      sendData["base64Array"] = reqParams["images"].map(
        (item: any) => item.b64,
      );
      sendData["dimensions"] = reqParams["dimensions"];
    } else {
      sendData["base64"] = reqParams["images"][0].b64;
    }
    mjStore.sendTask(
      {
        action: mjDataStore.action,
        model: reqParams["model"] || "mj",
        data: sendData,
      },
      () => {
        mjDataStore.setData(
          getModelParamBasicData(columns, curParamData, true),
          mjDataStore.action,
        );
        navigate(Path.MjNew);
      },
    );
  };

  return (
    <SideBarContainer
      onDragStart={onDragStart}
      shouldNarrow={shouldNarrow}
      {...props}
    >
      {isMobileScreen ? (
        <div
          className="window-header"
          data-tauri-drag-region
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <div className="window-actions">
            <div className="window-action-button">
              <IconButton
                icon={<ReturnIcon />}
                bordered
                title={Locale.Mj.Actions.ReturnHome}
                onClick={() => navigate(Path.Home)}
              />
            </div>
          </div>
          <div className="window-actions">
            <div className="window-action-button">
              <IconButton
                icon={<HistoryIcon />}
                bordered
                title={Locale.Mj.Actions.History}
                onClick={() => navigate(Path.MjNew)}
              />
            </div>
          </div>
        </div>
      ) : (
        <SideBarHeader
          title={
            <IconButton
              icon={<ReturnIcon />}
              bordered
              title={Locale.Mj.Actions.ReturnHome}
              onClick={() => navigate(Path.Home)}
            />
          }
        ></SideBarHeader>
      )}
      <SideBarBody>
        <MjPanel />
      </SideBarBody>
      <SideBarTail
        primaryAction={
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <IconButton icon={<GithubIcon />} shadow />
          </a>
        }
        secondaryAction={
          <IconButton
            text={Locale.MjPanel.Submit}
            type="primary"
            shadow
            onClick={handleSubmit}
          ></IconButton>
        }
      />
    </SideBarContainer>
  );
}

import styles from "./mj-panel.module.scss";
import React, { forwardRef, useEffect, useState } from "react";
import { Select } from "@/app/components/ui-lib";
import { IconButton } from "@/app/components/button";
import Locale from "@/app/locales";
import { useMjDataStore, useMjStore } from "@/app/store/mj";
import ImageUploadIcon from "@/app/icons/image-upload.svg";
import { clone } from "@babel/types";
import deepcopy from "deepcopy";
import Locales from "@/app/locales";

export const imagineParams = [
  {
    name: Locale.MjPanel.AIModel,
    value: "model",
    type: "models",
    required: true,
    default: "mj",
    options: [
      { name: "Midjourney", value: "mj" },
      { name: "Niji", value: "niji" },
    ],
  },
  {
    name: Locale.MjPanel.Prompt,
    value: "prompt",
    type: "textarea",
    placeholder: Locale.MjPanel.PleaseInput(Locale.MjPanel.Prompt),
    required: true,
  },
  {
    name: Locale.MjPanel.ModelVersion,
    value: "version",
    type: "select",
    default: "6",
    options: [
      { name: "V6", value: "6" },
      { name: "V5.2", value: "5.2", support: ["mj"] },
      { name: "V5.1", value: "5.1", support: ["mj"] },
      { name: "V5", value: "5" },
    ],
    cmd: "--v",
  },
  {
    name: Locale.MjPanel.NegativePrompt,
    value: "no",
    type: "textarea",
    placeholder: Locale.MjPanel.PleaseInput(Locale.MjPanel.NegativePrompt),
    cmd: "--no",
  },
  {
    name: Locales.MjPanel.ImagineParam.IwImage,
    value: "iwImages",
    type: "images",
    sub: Locales.MjPanel.ImagineParam.IwImageTip,
    max: 2,
  },
  {
    name: Locales.MjPanel.ImagineParam.IwTitle,
    value: "iw",
    type: "number",
    default: 2,
    min: 0,
    max: 2,
    sub: Locales.MjPanel.ImagineParam.IwTip,
    cmd: (data: any) => {
      if (data["iwImages"] && data["iwImages"].length) {
        return "--iw";
      }
      return null;
    },
  },
  {
    name: Locale.MjPanel.AspectRatio,
    value: "area",
    type: "select",
    default: "1:1",
    options: [
      { name: "1:1", value: "1:1" },
      { name: "16:9", value: "16:9" },
      { name: "21:9", value: "21:9" },
      { name: "2:3", value: "2:3" },
      { name: "3:2", value: "3:2" },
      { name: "4:5", value: "4:5" },
      { name: "5:4", value: "5:4" },
      { name: "9:16", value: "9:16" },
      { name: "9:21", value: "9:21" },
    ],
    cmd: "--ar",
  },
  {
    name: "Seed",
    value: "seed",
    type: "number",
    default: 0,
    min: 0,
    max: 4294967294,
    sub: Locales.MjPanel.ImagineParam.SeedTip,
    cmd: "--seed",
  },
];

export const blendParams = [
  {
    name: Locales.MjPanel.BlendParam.ImageTitle,
    value: "images",
    type: "images",
    required: true,
    sub: Locales.MjPanel.BlendParam.ImageTip,
    max: 5,
    min: 2,
  },
  {
    name: Locales.MjPanel.BlendParam.Dimensions,
    value: "dimensions",
    type: "select",
    default: "SQUARE",
    options: [
      { name: "SQUARE - 1:1", value: "SQUARE" },
      { name: "PORTRAIT - 2:3", value: "PORTRAIT" },
      { name: "LANDSCAPE - 3:2", value: "LANDSCAPE" },
    ],
  },
];

export const descParams = [
  {
    name: Locales.MjPanel.DescribeParam.ImageTitle,
    value: "images",
    type: "images",
    sub: Locales.MjPanel.DescribeParam.ImageTip,
    max: 1,
    required: true,
    min: 1,
  },
];

const mjCommonParams = (params: any[], model: string, data: any) => {
  return params
    .filter((item) => {
      return !(item.support && !item.support?.includes?.(model));
    })
    .map((item) => {
      const newItem = deepcopy(item);
      if (newItem.options) {
        newItem.options = newItem.options.filter((opt: any) => {
          return !(opt.support && !opt.support?.includes?.(model));
        });
      }
      return newItem;
    });
};

export const actions = [
  {
    name: Locales.MjPanel.Imagine,
    value: "imagine",
    params: (data: any) => mjCommonParams(imagineParams, data.model, data),
  },
  {
    name: Locales.MjPanel.Blend,
    value: "blend",
    params: (data: any) => mjCommonParams(blendParams, "", data),
  },
  {
    name: Locales.MjPanel.Describe,
    value: "describe",
    params: (data: any) => mjCommonParams(descParams, "", data),
  },
];

const onImageSelected = (
  e: any,
  callback?: (filename: string, b64: string) => void,
) => {
  const file = e.target.files[0];
  const filename = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64 = reader.result;
    callback && callback(filename, base64 as string);
  };
  e.target.value = null;
};

export function ImageUpload(props: {
  id: string;
  max?: number;
  onChange?: (val: any[]) => void;
  data: any[];
}) {
  const els = [];
  for (let i = 0; i < (props.max || 1); i++) {
    const idName = `${props.id}-image-upload-ti-${i}`;
    els.push(
      <div
        className={styles["image-upload-btn"]}
        key={idName}
        onClick={() => {
          if (props.data?.[i]) {
            props.onChange?.(props.data.filter((_, idx) => idx !== i));
          } else {
            document.getElementById(idName)?.click();
          }
        }}
      >
        {props.data?.[i] ? (
          <img alt={props.id} src={props.data[i].b64} />
        ) : (
          <div className={styles["upload-btn-entry"]}>
            <ImageUploadIcon width={30} height={30} />
          </div>
        )}
        <input
          type="file"
          accept=".png,.jpg,.webp,.jpeg"
          id={idName}
          style={{ display: "none" }}
          onChange={(e) =>
            onImageSelected(e, (filename, b64) => {
              props.onChange?.([...props.data, { filename, b64 }]);
            })
          }
        ></input>
      </div>,
    );
  }
  return <div className={styles["image-upload-btn-list"]}>{els}</div>;
}

export function ControlParamItem(props: {
  title?: string;
  subTitle?: string;
  required?: boolean;
  children?: JSX.Element | JSX.Element[];
  className?: string;
}) {
  return (
    <div className={styles["ctrl-param-item"] + ` ${props.className || ""}`}>
      <div className={styles["ctrl-param-item-header"]}>
        <div className={styles["ctrl-param-item-title"]}>
          <div>
            {props.title}
            {props.required && <span style={{ color: "red" }}>*</span>}
          </div>
        </div>
      </div>
      {props.children}
      {props.subTitle && (
        <div className={styles["ctrl-param-item-sub-title"]}>
          {props.subTitle}
        </div>
      )}
    </div>
  );
}

export function ControlParam(props: {
  columns: any[];
  data: any;
  onChange: (field: string, val: any) => void;
}) {
  return (
    <>
      {props.columns?.map((item) => {
        let element: null | JSX.Element;
        switch (item.type) {
          case "textarea":
            element = (
              <ControlParamItem
                title={item.name}
                subTitle={item.sub}
                required={item.required}
              >
                <textarea
                  rows={item.rows || 3}
                  style={{ maxWidth: "100%", width: "100%", padding: "10px" }}
                  placeholder={item.placeholder}
                  onChange={(e) => {
                    props.onChange(item, e.currentTarget.value);
                  }}
                  value={props.data[item.value]}
                ></textarea>
              </ControlParamItem>
            );
            break;
          case "select":
            element = (
              <ControlParamItem
                title={item.name}
                subTitle={item.sub}
                required={item.required}
              >
                <Select
                  value={props.data[item.value]}
                  onChange={(e) => {
                    props.onChange(item, e.currentTarget.value);
                  }}
                >
                  {item.options.map((opt: any) => {
                    return (
                      <option value={opt.value} key={opt.value}>
                        {opt.name}
                      </option>
                    );
                  })}
                </Select>
              </ControlParamItem>
            );
            break;
          case "number":
            element = (
              <ControlParamItem
                title={item.name}
                subTitle={item.sub}
                required={item.required}
              >
                <input
                  type="number"
                  min={item.min}
                  max={item.max}
                  value={props.data[item.value] || 0}
                  onChange={(e) => {
                    props.onChange(item, parseInt(e.currentTarget.value));
                  }}
                />
              </ControlParamItem>
            );
            break;
          case "images":
            element = (
              <ControlParamItem
                title={item.name}
                subTitle={item.sub}
                required={item.required}
              >
                <ImageUpload
                  data={props.data[item.value]}
                  id={`cp-${item.value}`}
                  max={item.max}
                  onChange={(v) => {
                    props.onChange(item, v);
                  }}
                ></ImageUpload>
              </ControlParamItem>
            );
            break;
          case "models":
            element = (
              <ControlParamItem
                title={item.name}
                subTitle={item.sub}
                required={item.required}
              >
                <div className={styles["ai-models"]}>
                  {item.options.map((opt: any) => {
                    return (
                      <IconButton
                        text={opt.name}
                        key={opt.value}
                        type={
                          props.data[item.value] == opt.value ? "primary" : null
                        }
                        shadow
                        onClick={() => props.onChange(item, opt.value)}
                      />
                    );
                  })}
                </div>
              </ControlParamItem>
            );
            break;
          default:
            element = (
              <ControlParamItem
                title={item.name}
                subTitle={item.sub}
                required={item.required}
              >
                <input
                  type="text"
                  value={props.data[item.value]}
                  style={{ maxWidth: "100%", width: "100%" }}
                  onChange={(e) => {
                    props.onChange(item, e.currentTarget.value);
                  }}
                />
              </ControlParamItem>
            );
        }
        return <div key={item.value}>{element}</div>;
      })}
    </>
  );
}

export const getParams = (action: any, data: any) => {
  return actions.find((m) => m.value === action)?.params(data) || [];
};

export const getModelParamBasicData = (
  columns: any[],
  data: any,
  clearText?: boolean,
) => {
  const newParams: any = {};
  columns.forEach((item: any) => {
    if (
      clearText &&
      ["text", "textarea", "number", "images"].includes(item.type)
    ) {
      newParams[item.value] = item.default || "";
    } else {
      // @ts-ignore
      newParams[item.value] = data[item.value] || item.default || "";
    }
  });
  return newParams;
};

export function MjPanel() {
  const mjDataStore = useMjDataStore();

  const handleValueChange = (field: any, val: any) => {
    const data = getActionParamsData(mjDataStore.action);
    mjDataStore.setData(
      {
        ...data,
        [field.value]: val,
      },
      mjDataStore.action,
    );
  };

  function getActionParamsData(action: string) {
    let res: any = {};
    switch (action) {
      case "imagine":
        res = mjDataStore.data.imagine;
        break;
      case "blend":
        res = mjDataStore.data.blend;
        break;
      case "describe":
        res = mjDataStore.data.describe;
        break;
    }
    return res;
  }

  useEffect(() => {
    const paramsData = getActionParamsData(mjDataStore.action);
    if (paramsData) {
      const d: any = {};
      const fields = getParams(mjDataStore.action, {});
      if (fields && fields.length) {
        fields.forEach((item: any) => {
          d[item.value] = paramsData[item.value] || item.default || "";
        });
      }
      mjDataStore.setData(d, mjDataStore.action);
    }
  }, [mjDataStore.action]);

  return (
    <>
      <ControlParamItem>
        <div className={styles["ai-models"]}>
          {actions.map((item) => {
            return (
              <IconButton
                text={item.name}
                key={item.value}
                type={mjDataStore.action == item.value ? "primary" : null}
                shadow
                onClick={() => mjDataStore.setAction(item.value)}
              />
            );
          })}
        </div>
      </ControlParamItem>
      <ControlParam
        columns={
          getParams(
            mjDataStore.action,
            getActionParamsData(mjDataStore.action),
          ) as any[]
        }
        data={getActionParamsData(mjDataStore.action)}
        onChange={handleValueChange}
      ></ControlParam>
    </>
  );
}

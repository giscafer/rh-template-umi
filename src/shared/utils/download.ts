/*
 * @Date: 2021-07-11 08:50:34
 * @Description: 下载
 */

import download from "downloadjs";

export function downloadBlob(
  response: Response | any,
  filename?: string
): void {
  const contentDisposition = response.headers["content-disposition"];
  const responseFilename = contentDisposition
    ? decodeURI(contentDisposition.split("=")[1])
    : "";

  download(response.data, filename || responseFilename || "file.xlsx");
}

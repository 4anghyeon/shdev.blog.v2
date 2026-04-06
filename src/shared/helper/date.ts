import dayjs from "dayjs";
import "dayjs/locale/ko";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat); // 추가
dayjs.locale("ko");

const DATE_FORMAT = {
  DEFAULT: "YYYY-MM-DD",
  LOCAL: "LL",
} as const;
type DateFormatKey = keyof typeof DATE_FORMAT;

export const dateHelper = {
  format: (date: string, format: DateFormatKey = "DEFAULT") => {
    return dayjs(date).format(DATE_FORMAT[format]);
  },
};

import { makeRegex } from '../Helpers/Functions';

const mr = makeRegex();
const mrg = makeRegex('g');
const timeR = /(\d{2}:\d{2})/;
const datetimeR = /(\d+)\-(\d+)\-(\d+)\s+.{3}\s*(\d{2}:\d{2})?(-\d{2}:\d{2})?/;
const repeaterR = /\s*([\+\.]+\d+[ywmdh])?/;
const warningPeriodR = /\s*(-\d+[ywmdh])?/;
const activeTimestamp = mr(/\</, datetimeR, repeaterR, /\>/);
const activeTimestampWithWarningPeriod = mr(
  /\</,
  datetimeR,
  repeaterR,
  warningPeriodR,
  /\>/
);
const inactiveTimestamp = mr(/\[/, datetimeR, /\]/);

export const headlineR = {
  priority: /\[#[ABC]\]/,
  todo: /(^TODO\s+|DONE\s+|NEXT\s+|PROJECT\s+|WAITING\s+|REVIEW\s+|IDEA\s+|BRAINSTORM\s+|SOMEDAY\s+|FIXME\s+|MAYBE\s+)/,
  tags: /\s+:[^\s]+:(\s*|$)/,
  head: /^\*+\s+/,
};

export const nodeMetadataR = {
  scheduled: mr(/\s*SCHEDULED:\s*/, activeTimestampWithWarningPeriod),
  deadline: mr(/\s*DEADLINE:\s*/, activeTimestampWithWarningPeriod),
  closed: mr(/\s*CLOSED:\s*/, inactiveTimestamp),
  activeTimestampRange: mrg(activeTimestamp, /\-{2}/, activeTimestamp),
  inactiveTimestamp: inactiveTimestamp,
  activeTimestamp: mrg(/(?:^|[^-])/, activeTimestamp, /(?!--)/),
  drawer: [/^\s*:([a-zA-Z_0-9]+):\s*$/, /\s*:END:/],
};

export const drawersContentR = {
  clockStarted: mr(/^\s*CLOCK: /, inactiveTimestamp),
  clockEnded: mr(
    /^\s*CLOCK: /,
    inactiveTimestamp,
    /--/,
    inactiveTimestamp,
    /\s*=>\s*/,
    timeR
  ),
  singleProperty: /^\s*:(.*?):\s*(.*?)\s*$/,
};

export const nodeContentR = {
  todoStateHistory: /^\s*- State\s+"\w+"\s+from\s+"\w+"\s+/,
};

export const fileMetadataR = /^#\+(\w+):\s*(.*)/;

export const nodeContentLinesR = {
  checkedCheckboxLine: /^\s*-\s+[x]\s+/,
  checkboxLine: /^\s*-\s+\[\s+]\s+/,
  listLine: /^\s*-\s+/,
  numericListLine: /^\s*[0-9]\./,
};

const createInlineR = reg => mrg(reg, /(\w+)/, reg);

export const nodeContentLinksR = {
  web: /\[\[(.*?)\]\[(.*?)\]\]/g,
  plain: /( |^)(www|http:|https:)+[^\s]+[\w](\/| |$)/g,
};

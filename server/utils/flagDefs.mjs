/**
 * Описание поддерживаемых флагов командной строки.
 *
 * name        — внутреннее имя, которым мы будем пользоваться в коде
 * aliases     — варианты записи флага, распознаваемые в CLI
 * type        — "boolean" | "string" | "number"
 * default     — значение по умолчанию
 * description — Описание, выводимое в -help
 */
export const flagDefs = {
  help: {
    aliases: ["-h"],
    type: "boolean",
    default: false,
    description: "Показать это сообщение"
  },
  quiet: {
    aliases: ["-q"],
    type: "boolean",
    default: false,
    description: "Скрыть вывод каждого прогона, показать только среднее время"
  },
  runs: {
    aliases: ["-r"],
    type: "number",
    default: 10,
    description: "Количество прогонов",
    validate: (r) => Number(r).isFinite() && r >= 1
  },
  precision: {
    aliases: ["-p"],
    type: "number",
    default: 5,
    description: "Точность измерения в знаках после запятой"
  }

  // При необходимости добавляйте новые флаги:
  // exampleFlag: {
  //   aliases: ["-e", "--example"],
  //   type: "string",
  //   default: "foo",
  //   description: "Пример строкового параметра"
  // }
}

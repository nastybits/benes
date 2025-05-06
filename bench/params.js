/**
 * Описание поддерживаемых флагов командной строки.
 * @typedef arg
 * @property {string[]} aliases - варианты записи флага, распознаваемые в CLI
 * @property {string} type - "boolean" | "string" | "number"
 * @property {boolean|string|number} default - значение по умолчанию
 * @property {string} description - Описание, выводимое в -help
 * @property {function} validate - фукция валидации
 */
export const FLAGS = Object.freeze({
  help: {
    aliases: ["-h", "--help"],
    type: "boolean",
    default: false,
    description: "Показать это сообщение"
  },
  engine: {
    aliases: ["-e", "--engine"],
    type: "sting",
    default: "v8",
    description: "Используемый движок",
    validate: (e) => ["v8", "spidermonkey", "javascriptcore", "graaljs", "quickjs", "hermes", "xs"].includes(e)
  },
  runs: {
    aliases: ["-r", "--runs"],
    type: "number",
    default: 100,
    description: "Количество прогонов",
    validate: (r) => r && r >= 1
  },
  precision: {
    aliases: ["-p", "--precision"],
    type: "number",
    default: 5,
    description: "Точность измерения в знаках после запятой"
  },
  all: {
    aliases: ["-a", "--all"],
    type: "boolean",
    default: false,
    description: "Показать вывод каждого прогона"
  }

  // При необходимости добавляйте новые флаги:
  // example: {
  //   aliases: ["-e", "--example"],
  //   type: "string",
  //   default: "foo",
  //   description: "Пример строкового параметра"
  //   validate: (val) => ["foo", "bar"].includes(val)
  // }
})

function isAnyStringParamEmpty(...params: (string | undefined)[]): boolean {
  return params.some((param) => typeof param !== "string" || param.trim() === "");
}

export { isAnyStringParamEmpty };

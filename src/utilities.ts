export function ifElse<T, S = undefined>(condition: boolean, then: T, otherwise?: S) {
  return condition ? then : otherwise;
}

export function flatten(array: any[]): any[] {
  return array.reduce((all, item) => {
    if (!item) { return all; }

    return Array.isArray(item)
      ? [...all, ...flatten(item)]
      : [...all, item];
  }, []);
}

export function removeNullValues<T extends object>(obj: T): object {
  return Object.keys(obj).reduce((all, key: keyof T) => {
    const value = obj[key];
    if (value == null) { return all; }
    return {
      ...all,
      [key]: value,
    }
  }, {});
}

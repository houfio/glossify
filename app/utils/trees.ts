export type WithChildren<T> = T & { children: WithChildren<T>[] };

export function arrayToTree<T extends { id: string; parentId: string | null }>(array: T[]) {
  const map = new Map<string, WithChildren<T>>();

  for (const value of array) {
    map.set(value.id, { ...value, children: [] });
  }

  return array.reduce<WithChildren<T>[]>((previous, current) => {
    const value = map.get(current.id);

    if (!value) {
      return previous;
    }

    if (!current.parentId) {
      previous.push(value);
    } else {
      map.get(current.parentId)?.children.push(value);
    }

    return previous;
  }, []);
}

export function followPath<T extends { id: string }>(children: WithChildren<T>[], path: string[]): WithChildren<T>[] {
  if (!path.length) {
    return [];
  }

  const current = children.find((child) => child.id === path[0]);

  if (!current) {
    return [];
  }

  return [current, ...followPath(current.children, path.slice(1))];
}

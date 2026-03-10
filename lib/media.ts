const object2URL: Map<File | Blob, string> = new Map();
const URL2object: Map<string, File | Blob> = new Map();

export function createObjectURL(object: File | Blob): string {
  if (!object2URL.has(object)) {
    const url = URL.createObjectURL(object);

    object2URL.set(object, url);
    URL2object.set(url, object);
  }

  return object2URL.get(object)!;
}

export function revokeObjectURL(object: File | string) {
  if (typeof object === "string") {
    URL.revokeObjectURL(object);
    object2URL.delete(URL2object.get(object)!);
    URL2object.delete(object);
  } else {
    const url = object2URL.get(object);

    if (!url) return;

    URL.revokeObjectURL(url);
    object2URL.delete(object);
    URL2object.delete(url);
  }
}

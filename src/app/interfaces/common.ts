export interface item {
  id: number,
  name: string,
  description: string,
  tags: string[],
  parentid: number,
  children: item[],
  type: "contenedor" | "item",
  stateactive: boolean
}

export interface objDialogInto {
  node: item,
  createMethod?: boolean,
  formCopyPaste?: boolean
}

export interface messageConfirm {
  title: string
  text: string,
}

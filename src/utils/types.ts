import { type Component as HybridsComponent } from "hybrids"

export type DefineComponent<T> = {
  Props: T
  Component: Omit<HybridsComponent<T>, "tag"> & { tag?: string }
  Definition: Partial<HybridsComponent<T>> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any
  }
}

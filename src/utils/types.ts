import { type Component as HybridsComponent } from "hybrids"

export type DefineComponent<T> = {
  Props: T
  Component: Omit<HybridsComponent<T>, "tag">
  Definition: Partial<Omit<HybridsComponent<T>, "tag">>
}

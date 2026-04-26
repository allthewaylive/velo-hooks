import {Getter, Setter} from "jay-reactive";
import {RefComponent} from "./refs";

interface InputMixin {
  get value(): string
  set value(v: string)
  onChange(handler: (event: any) => void): void
}

interface TextMixin {
  get text(): string
  set text(v: string)
}

/**
 * Two-way binding between an input element's value and a string state.
 * When the state changes, the input value updates.
 * When the user types, the state updates.
 *
 * Example:
 * ```ts
 * let [query, setQuery] = createState('');
 * bindInput(refs.searchInput, query, setQuery);
 * ```
 */
export function bindInput(
  el: RefComponent<InputMixin>,
  get: Getter<string>,
  set: Setter<string>
): void {
  el.value = get;
  el.onChange((event: any) => set(event.target.value));
}

/**
 * One-way binding from state to a text element.
 * When the state changes, the element's text updates.
 *
 * Example:
 * ```ts
 * let formattedName = createMemo(() => `Hello, ${name()}!`);
 * bindText(refs.label, formattedName);
 * ```
 */
export function bindText(
  el: RefComponent<TextMixin>,
  get: Getter<string>
): void {
  el.text = get;
}

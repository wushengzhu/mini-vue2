import { noop } from "src/shared/util";
import type { Component } from "src/types/component";


export let warn:(msg:string,vm?:Component | null) => void = noop
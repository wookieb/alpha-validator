import {OptionalPromise} from "./types";
import {ViolationsList} from "./ViolationsList";
import {Validation} from "monet";

export interface ValidationFunction<TInput, TOutput = TInput, TOptions = unknown> {
    (data: TInput, options?: TOptions): OptionalPromise<Validation<ViolationsList, TOutput>>;
}

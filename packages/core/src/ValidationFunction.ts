import {OptionalPromise} from "./types";
import {ViolationsList} from "./ViolationsList";
import {Either} from "@sweet-monads/either";

export interface ValidationFunction<TInput, TOutput = TInput, TOptions = unknown> {
    (data: TInput, options?: TOptions): OptionalPromise<Either<ViolationsList, TOutput>>;
}

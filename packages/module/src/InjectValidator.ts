import {Inject, reference} from 'alpha-dic';
import {References} from "./References";

export function InjectValidator() {
    return Inject(reference(References.VALIDATOR));
}
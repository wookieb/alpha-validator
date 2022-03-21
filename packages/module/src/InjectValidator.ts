import {Inject, reference} from 'alpha-dic';
import {References} from "./References";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function InjectValidator() {
    return Inject(reference(References.VALIDATOR));
}

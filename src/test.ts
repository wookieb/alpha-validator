import Validator from "./Validator";

const validator = new Validator();

let val = 1;
validator.addKeyword('test', {
    validate: function(data: any) {
        return false;
    }
});

const schema = {
    '$id': 'http://chs/test',
    properties: {
        key: {
            type: 'string',
            test: 1
        }
    }
};

validator.addSchema(schema);

(async () => {
    console.log(await validator.checkIsValid({key: 'test'}, 'http://chs/test'));
})();
